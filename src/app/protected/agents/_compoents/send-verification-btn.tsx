"use client";
import { useState } from "react";
import { createAgentVerificationToken } from "@/utils/db";
import { sendVerificationEmail } from "@/utils/nodemailer-send";
import Image from "next/image";
import { fetchAgent } from "@/utils/db";
import VerificationIcon from "@/assets/img-icons/verification-icon.png";
import Spinner from "@/assets/animation/loading-101.gif";

export const SendVerificationBtn = (props: { agentId: number }) => {
  const { agentId } = props;

  const [sendVerificationState, setSendVerificationState] = useState(false);

  const handleSendVerification = async () => {
    try {
      setSendVerificationState(true);
      const token = await createAgentVerificationToken(agentId);
      setSendVerificationState(false);
      const agent = await fetchAgent(agentId);
      await sendVerificationEmail(
        agent?.name ?? "",
        agent?.email ?? "",
        token?.token ?? "",
      );
    } catch (error) {
      console.error("Error sending verification email:", error);
      // Optionally, handle the error (e.g., show an error message)
    }
  };

  return (
    <>
      <button className="hover:text-primary" onClick={handleSendVerification}>
        <span className="sr-only">Verification Email</span>
        {!sendVerificationState && (
          <Image
            src={VerificationIcon}
            width={25}
            height={25}
            alt="email verification icon"
          />
        )}

        {sendVerificationState && (
          <Image
            src={Spinner}
            width={25}
            height={25}
            alt="email verification sending indicator"
          />
        )}
      </button>
    </>
  );
};
