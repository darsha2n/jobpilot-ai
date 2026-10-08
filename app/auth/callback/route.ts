
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");

  const supabase = await createClient();

  let verified = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    verified = !error;
  } else if (token_hash && type) {
    const allowedTypes = ["signup", "email", "recovery", "invite"];

    if (allowedTypes.includes(type)) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as EmailOtpType,
      });
      verified = !error;
    }
  }

  if (verified) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(
    new URL("/register?error=verification_failed", request.url)
  );
}
