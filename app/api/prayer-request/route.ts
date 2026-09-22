
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const required = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

function formatPrayerDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
}

async function sendEmail(params: {
  recipients: string[];
  subject: string;
  html: string;
  filename: string;
  content: string;
  contentType: string;
}) {
  const apiKey = required("RESEND_API_KEY");
  const from = required("PRAYER_EMAIL_FROM");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
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

    throw new Error(`Email delivery failed: ${errorText}`);
  }
}

export async function POST(request: Request) {
  let uploadedReceiptPath: string | null = null;

  try {
    // 1. Read form data
    const formData = await request.formData();

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const intentionType = String(
      formData.get("intentionType") ?? ""
    ).trim();
    const intention = String(formData.get("intention") ?? "").trim();
    const paymentRef = String(
      formData.get("paymentRef") ?? ""
    ).trim();
    const prayerDateTime = String(
      formData.get("prayerDateTime") ?? ""
    ).trim();
    const amount = String(formData.get("amount") ?? "200").trim();
    const receipt = formData.get("receipt");

    // 2. Validate required fields
    if (!name || !email || !intention || !prayerDateTime) {
      return NextResponse.json(
        {
          error: "Please complete all required fields.",
        },
        { status: 400 }
      );
    }

    if (!(receipt instanceof File)) {
      return NextResponse.json(
        {
          error: "Please upload a payment receipt.",
        },
        { status: 400 }
      );
    }

    // 3. Validate prayer date and time
    const selectedTime = new Date(prayerDateTime).getTime();

    if (
      Number.isNaN(selectedTime) ||
      selectedTime < Date.now() + 45 * 60 * 1000
    ) {
      return NextResponse.json(
        {
          error:
            "The request must be submitted at least 45 minutes before the prayer time.",
        },
        { status: 400 }
      );
    }

    // 4. Validate Supabase environment variables
    const supabaseUrl = required("NEXT_PUBLIC_SUPABASE_URL");
    const serviceRoleKey = required("SUPABASE_SERVICE_ROLE_KEY");

    // 5. Create Supabase admin client
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 6. Read receipt file
    const receiptBuffer = Buffer.from(
      await receipt.arrayBuffer()
    );

    const receiptBase64 = receiptBuffer.toString("base64");

    const prayerDate = formatPrayerDate(prayerDateTime);

    // 7. Generate a unique receipt path
    const fileExtension =
      receipt.name.split(".").pop()?.toLowerCase() || "jpg";

    uploadedReceiptPath = `prayer-requests/${crypto.randomUUID()}.${fileExtension}`;

    // 8. Upload receipt to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("prayer-receipts")
      .upload(uploadedReceiptPath, receiptBuffer, {
        contentType:
          receipt.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Receipt upload error:", uploadError);

      throw new Error(
        `Receipt upload failed: ${uploadError.message}`
      );
    }

    // 9. Insert prayer request into Supabase database
    const { data: savedRequest, error: insertError } =
      await supabaseAdmin
        .from("prayer_requests")
        .insert({
          name,
          email,
          phone: phone || null,
          intention_type: intentionType || null,
          intention,
          payment_ref: paymentRef || null,
          prayer_date_time: new Date(
            prayerDateTime
          ).toISOString(),
          amount: Number(amount) || 200,
          receipt_path: uploadedReceiptPath,
          status: "new",
        })
        .select()
        .single();

    if (insertError) {
      console.error(
        "Prayer request database insert error:",
        insertError
      );

      throw new Error(
        `Database insert failed: ${insertError.message}`
      );
    }

    // 10. Prepare email
    const subject = `New Prayer Request — ${name} — ₹${amount}`;

    const html = `
      <h2>New Prayer Request</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
      <p><strong>Prayer Date & Time:</strong> ${prayerDate}</p>
      <p><strong>Intention Type:</strong> ${
        intentionType || "Not provided"
      }</p>
      <p><strong>Amount:</strong> ₹${amount}</p>
      <p><strong>Payment Reference:</strong> ${
        paymentRef || "Not provided"
      }</p>

      <p><strong>Prayer Intention:</strong></p>
      <p>${intention.replace(/\n/g, "<br />")}</p>

      <p>
        The payment receipt is attached to this email.
      </p>

      <p>
        <strong>Database Request ID:</strong>
        ${savedRequest.id}
      </p>
    `;

    // 11. Email recipients
    const recipients = [
      required("PRAYER_NOTIFICATION_EMAIL_1"),
      required("PRAYER_NOTIFICATION_EMAIL_2"),
    ];

    // 12. Send email notification
    await sendEmail({
      recipients,
      subject,
      html,
      filename: receipt.name,
      content: receiptBase64,
      contentType:
        receipt.type || "application/octet-stream",
    });

    // 13. Return success
    return NextResponse.json({
      success: true,
      requestId: savedRequest.id,
    });
  } catch (error) {
    console.error(
      "Prayer request submission error:",
      error
    );

    // Remove uploaded receipt if a later operation fails
    if (uploadedReceiptPath) {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey =
          process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && serviceRoleKey) {
          const supabaseAdmin = createClient(
            supabaseUrl,
            serviceRoleKey,
            {
              auth: {
                autoRefreshToken: false,
                persistSession: false,
              },
            }
          );

          await supabaseAdmin.storage
            .from("prayer-receipts")
            .remove([uploadedReceiptPath]);
        }
      } catch (cleanupError) {
        console.error(
          "Receipt cleanup error:",
          cleanupError
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The request could not be delivered.",
      },
      { status: 500 }
    );
  }
}