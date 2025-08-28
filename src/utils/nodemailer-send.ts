"use server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDB } from "@/utils/db";
import { OUTLOOK_ADDRESS, OUTLOOK_PASS } from "@/utils/config";

const transporter = nodemailer.createTransport({
  service: "Outlook365", // or "hotmail"
  auth: {
    user: OUTLOOK_ADDRESS,
    pass: OUTLOOK_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

// src/app/actions/createAgentVerificationToken.ts

export async function createAgentVerificationToken(agent_id: string) {
  try {
    const token = crypto.randomBytes(64).toString("hex");
    const dbc = await connectToDB();
    const [result] = await dbc.execute(
      `
      INSERT INTO agent_verification_tokens 
        (agent_id, token, created_at, expires_at, is_used, used_at)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 24 HOUR), 0, NULL)
      `,
      [agent_id, token],
    );

    return {
      success: true,
      token,
      insertId: (result as any).insertId,
    };
  } catch (error) {
    console.error("Error creating verification token:", error);
    return {
      success: false,
      error: "Failed to create verification token",
    };
  }
}

export async function sendEmail({ to, subject, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: OUTLOOK_ADDRESS,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message };
  }
}
