"use server";

import { connectToDB } from "@/utils/db";
import { RowDataPacket } from "mysql2";

export async function verifyAgentToken(token: string) {
  const conn = await connectToDB();

  try {
    // 1. Fetch token details
    const [rows] = await conn.query<RowDataPacket[]>(
      `
      SELECT avt.id, avt.agent_id, avt.token, avt.expires_at, avt.status, avt.is_used
      FROM agent_verification_tokens avt
      WHERE avt.token = ?
      LIMIT 1
      `,
      [token],
    );

    if (rows.length === 0) {
      return { success: false, message: "Invalid token" };
    }

    const tokenData = rows[0];

    // 2. Check status
    if (tokenData.status !== "PENDING" || tokenData.is_used) {
      return { success: false, message: "Token already used or revoked" };
    }

    // 3. Check expiry
    const now = new Date();
    if (new Date(tokenData.expires_at) < now) {
      return { success: false, message: "Token expired" };
    }

    // 4. Mark token as used
    await conn.query(
      `
      UPDATE agent_verification_tokens
      SET status = 'USED', is_used = 1, used_at = NOW()
      WHERE id = ?
      `,
      [tokenData.id],
    );

    return { success: true, message: "Email verified successfully" };
  } catch (error) {
    console.error("Error verifying token:", error);
    return { success: false, message: "Server error" };
  } finally {
    conn.end();
  }
}
