'use client';

import { auth } from "@/firebase";
import { ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { FormEvent, useEffect, useState, useTransition } from "react";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Spinner } from "./ui/spinner";

function OtpLogin() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [recaptchaVerifier, setRecaptchaVerifier] =
    useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    setRecaptchaVerifier(verifier);
    return () => verifier.clear();
  }, []);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");
      if (!confirmationResult) {
        return setError("Please request OTP first.");
      }

      try {
        await confirmationResult.confirm(otp);
        router.replace("/");
      } catch (err) {
        setError("Failed to verify OTP. Please check the code.");
      }
    });
  };

  useEffect(() => {
    if (otp.length === 6) verifyOtp();
  }, [otp]);

  const requestOtp = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    setResendCountdown(60);
    setError("");
    setSuccess("");

    if (!recaptchaVerifier) {
      return setError("Recaptcha is not ready. Please refresh the page.");
    }

    try {
      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        recaptchaVerifier
      );
      setConfirmationResult(confirmation);
      setSuccess("OTP sent successfully.");
    } catch (err: any) {
      console.error("OTP Error", err);
      setResendCountdown(0);

      if (err.code === "auth/invalid-phone-number") {
        setError("Invalid phone number. Please include country code (e.g., +91).");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too many requests. Try again later.");
      } else {
        setError("Failed to send OTP. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {!confirmationResult && (
        <form onSubmit={requestOtp} className="space-y-2">
          <Input
            className="text-black"
            type="tel"
            placeholder="+91XXXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Enter your phone number with country code.
          </p>
        </form>
      )}

      {confirmationResult && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Enter 6-digit OTP</p>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
            className="mx-auto"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      )}

      <Button
        disabled={!phoneNumber || isPending || resendCountdown > 0}
        onClick={() => requestOtp()}
        className="w-full"
      >
        {resendCountdown > 0
          ? `Resend OTP in ${resendCountdown}s`
          : isPending
            ? "Sending OTP..."
            : "Send OTP"}
      </Button>

      {isPending && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      <div className="text-center text-sm">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>

      <div id="recaptcha-container" />
    </div>
  );
}

export default OtpLogin;
