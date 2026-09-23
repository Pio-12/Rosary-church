import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const required = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
};

function getSupabaseAdmin() {
  return createClient(
    required("NEXT_PUBLIC_SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

async function sendDonationEmail(params: {
  recipients: string[];
  subject: string;
  html: string;
  filename: string;
  content: string;
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${required("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: required("PRAYER_EMAIL_FROM"),
      to: params.recipients,
      subject: params.subject,
      html: params.html,
      attachments: [
        {
          filename: params.filename,
          content: params.content,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Donation email delivery failed: ${errorText}`);
  }
}

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("donations")
      .select("donor_name, amount, created_at")
      .eq("payment_status", "verified")
      .eq("display_publicly", true)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Public donations fetch error:", error);
      return NextResponse.json(
        { error: "Unable to load public donations." },
        { status: 500 }
      );
    }

    // Normalize the response so the client always receives the exact
    // fields it needs for the ticker. Empty names are excluded here.
    const donations = (data ?? [])
      .map((row) => ({
        donor_name: typeof row.donor_name === "string" ? row.donor_name.trim() : "",
        amount: Number(row.amount),
        created_at: row.created_at,
      }))
      .filter((row) => row.donor_name.length > 0 && Number.isFinite(row.amount) && row.amount > 0);

    return NextResponse.json({ donations });
  } catch (error) {
    console.error("Public donations route error:", error);
    return NextResponse.json(
      { error: "Unable to load public donations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let uploadedReceiptPath: string | null = null;

  try {
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const purpose = String(
      formData.get("purpose") ?? "General Donation"
    ).trim();
    const paymentReference = String(
      formData.get("paymentRef") ?? ""
    ).trim();
    const amountText = String(formData.get("amount") ?? "").trim();
    const displayPublicly =
      String(formData.get("displayPublicly") ?? "false") === "true";
    const receipt = formData.get("receipt");

    const amount = Number(amountText);

    if (
      !name ||
      !email ||
      !purpose ||
      !Number.isFinite(amount) ||
      amount < 1
    ) {
      return NextResponse.json(
        { error: "Please provide valid donor details and a donation amount." },
        { status: 400 }
      );
    }

    if (!(receipt instanceof File) || receipt.size === 0) {
      return NextResponse.json(
        { error: "Please upload your payment screenshot." },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(receipt.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WEBP, or PDF receipts are allowed." },
        { status: 400 }
      );
    }

    if (receipt.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Receipt file must be 5 MB or smaller." },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();
    const receiptBuffer = Buffer.from(await receipt.arrayBuffer());
    const receiptBase64 = receiptBuffer.toString("base64");
    const extension = receipt.name.split(".").pop()?.toLowerCase() || "jpg";
    uploadedReceiptPath = `donations/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("donation-receipts")
      .upload(uploadedReceiptPath, receiptBuffer, {
        contentType: receipt.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Receipt upload failed: ${uploadError.message}`);
    }

    const { data: savedDonation, error: insertError } = await supabaseAdmin
      .from("donations")
      .insert({
        donor_name: name,
        donor_email: email,
        donor_phone: phone || null,
        amount,
        purpose,
        payment_status: "pending",
        payment_reference: paymentReference || null,
        receipt_path: uploadedReceiptPath,
        display_publicly: displayPublicly,
      })
      .select("id")
      .single();

    if (insertError) {
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // Email failure should not undo a successfully saved donation.
    let emailSent = true;
    try {
      const recipients = [
        required("PRAYER_NOTIFICATION_EMAIL_1"),
        required("PRAYER_NOTIFICATION_EMAIL_2"),
      ];

      const html = `
        <h2>New Donation Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Amount:</strong> ₹${amount.toFixed(2)}</p>
        <p><strong>Purpose:</strong> ${purpose}</p>
        <p><strong>Payment Reference:</strong> ${
          paymentReference || "Not provided"
        }</p>
        <p><strong>Public Display Consent:</strong> ${
          displayPublicly ? "Yes" : "No"
        }</p>
        <p><strong>Payment Status:</strong> pending</p>
        <p><strong>Donation ID:</strong> ${savedDonation.id}</p>
        <p>The payment screenshot is attached to this email.</p>
      `;

      await sendDonationEmail({
        recipients,
        subject: `New Donation — ${name} — ₹${amount}`,
        html,
        filename: receipt.name,
        content: receiptBase64,
      });
    } catch (emailError) {
      emailSent = false;
      console.error("Donation saved, but notification email failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      donationId: savedDonation.id,
      emailSent,
      message: emailSent
        ? "Donation submitted successfully. It will be reviewed before verification."
        : "Donation saved successfully, but the notification email could not be sent.",
    });
  } catch (error) {
    console.error("Donation submission error:", error);

    if (uploadedReceiptPath) {
      try {
        const supabaseAdmin = getSupabaseAdmin();
        await supabaseAdmin.storage
          .from("donation-receipts")
          .remove([uploadedReceiptPath]);
      } catch (cleanupError) {
        console.error("Donation receipt cleanup error:", cleanupError);
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The donation could not be submitted.",
      },
      { status: 500 }
    );
  }
}
