"use server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectToDB } from "@/utils/db";
import { OUTLOOK_ADDRESS, OUTLOOK_PASS, DOMAIN_NAME } from "@/utils/config";
import { generateVerificationEmail } from "@/utils/agent-verification-email-template";
import { RowDataPacket } from "mysql2";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: OUTLOOK_ADDRESS,
    pass: OUTLOOK_PASS,
  },
});

// const transporter = nodemailer.createTransport({
//   host: "smtp.office365.com", // Outlook SMTP
//   port: 587,
//   secure: false,
//   auth: {
//     user: OUTLOOK_ADDRESS,
//     pass: OUTLOOK_PASS,
//   },
// });

interface EmailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

interface AgentVerificationToken extends RowDataPacket {
  id: number;
  agent_id: number;
  token: string;
  created_at: Date;
  expires_at: Date;
  status: "PENDING" | "USED" | "REVOKED";
}

// export async function getLatestUsableAgentToken(agentId: number) {
//   const connection = await connectToDB();

//   const sql = `
//     SELECT id, agent_id, token, created_at, expires_at, status
//     FROM agent_verification_tokens
//     WHERE agent_id = ?
//       AND status = 'PENDING'
//       AND is_used = 0
//       AND expires_at > NOW()
//     ORDER BY created_at DESC
//     LIMIT 1
//   `;

//   const [rows] = await connection.execute<AgentVerificationToken[]>(sql, [
//     agentId,
//   ]);
//   await connection.end();

//   return rows.length > 0 ? rows[0] : null;
// }

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

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: OUTLOOK_ADDRESS,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function sendVerificationEmail(
  agentName: string,
  agentEmail: string,
  token: string,
) {
  const verificationLink = `${DOMAIN_NAME}/agent/${token}`;

  const { subject, text, html } = generateVerificationEmail({
    agentName,
    verificationLink,
  });

  return await sendEmail({
    to: agentEmail,
    subject,
    // text,
    // Nodemailer supports both text and html
    // If you only pass `text`, HTML will be ignored
    html,
  } as any);
}
