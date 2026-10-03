import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    // 1. Read the authenticated user's access token
    const authorization = request.headers.get("authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Read Supabase server environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase server environment variables");

      return NextResponse.json(
        { error: "Server configuration is incomplete." },
        { status: 500 }
      );
    }

    // 3. Create an admin Supabase client
    const admin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 4. Verify the authenticated user
    const {
      data: userData,
      error: userError,
    } = await admin.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 5. Check whether the user is an admin
    const { data: adminRecord, error: adminError } = await admin
      .from("admin_users")
      .select("user_id")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (adminError) {
      console.error("Admin verification error:", adminError);

      return NextResponse.json(
        { error: "Unable to verify admin access." },
        { status: 500 }
      );
    }

    if (!adminRecord) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    // 6. Read the receipt path
    const body = await request.json();
    const rawPath = body?.path;

    if (typeof rawPath !== "string" || !rawPath.trim()) {
      return NextResponse.json(
        { error: "Invalid receipt path." },
        { status: 400 }
      );
    }

    const cleanPath = rawPath.trim();
    const bucket = cleanPath.startsWith("donations/")
      ? "donation-receipts"
      : "prayer-receipts";

    // 7. Create a temporary signed URL (valid for 15 minutes)
    const {
      data,
      error: signedUrlError,
    } = await admin.storage
      .from(bucket)
      .createSignedUrl(cleanPath, 900);

    if (signedUrlError || !data?.signedUrl) {
      console.error("Signed URL error:", signedUrlError);

      const errMessage = signedUrlError?.message || "";
      const isNotFound =
        errMessage.toLowerCase().includes("not found") ||
        (signedUrlError as { statusCode?: string; code?: string })?.statusCode === "404" ||
        (signedUrlError as { statusCode?: string; code?: string })?.code === "NoSuchKey";

      return NextResponse.json(
        {
          error: isNotFound
            ? "Receipt image file was not found in storage."
            : errMessage || "Unable to create receipt URL.",
          code: isNotFound ? "NOT_FOUND" : "STORAGE_ERROR",
        },
        { status: isNotFound ? 404 : 500 }
      );
    }

    // 8. Return the signed URL
    return NextResponse.json({
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("Receipt URL error:", error);

    return NextResponse.json(
      { error: "Unable to open receipt." },
      { status: 500 }
    );
  }
}