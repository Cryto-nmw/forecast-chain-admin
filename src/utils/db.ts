"use server";

import mysql, { Connection, ConnectionOptions } from "mysql2/promise";
import { RowDataPacket } from "mysql2";
import { DBHST, DBUSR, DBPS, DB } from "@/utils/config";
import { DbUser } from "@/utils/types";
// import { cloudinaryConfig as cloudnry } from "@/utils/cloudinary";
// @ts-ignore
import streamifier from "streamifier";
import { randomUUID } from "crypto";
import { auth } from "@/auth";

import { AgentRowDataPacket } from "@/types/agent"; // the type we defined earlier

export const connectToDB = async (): Promise<Connection> => {
  const dbConfig: ConnectionOptions = {
    host: DBHST,
    user: DBUSR,
    password: DBPS,
    database: DB,
    port: parseInt(process.env.DB_PORT ?? "3306", 10),
  };

  const connection = await mysql.createConnection(dbConfig);
  return connection;
};

/**
 * Retrieves a user record by username from MariaDB.
 * @param username - The username to look up.
 * @returns The user object if found, otherwise null.
 */
// type DbUser = Record<string, string | number | null>;

export async function getUserFromDb(
  username: string | unknown,
): Promise<DbUser | null> {
  const db = await connectToDB();

  const query = "SELECT * FROM admins WHERE username = ? LIMIT 1";
  const [rows] = await db.execute<RowDataPacket[]>(query, [username]);

  return rows.length > 0 ? (rows[0] as DbUser) : null;
}
// export async function uploadImages(formData: FormData) {
//   const files = formData.getAll("files") as File[];
//   if (files.length === 0) throw new Error("No files provided");

//   const uploadOne = async (file: File) => {
//     const buffer = Buffer.from(await file.arrayBuffer());
//     return new Promise<any>((resolve, reject) => {
//       const stream = cloudnry.uploader.upload_stream(
//         { resource_type: "auto" },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         },
//       );
//       streamifier.createReadStream(buffer).pipe(stream);
//     });
//   };

//   const results = await Promise.all(files.map((file) => uploadOne(file)));
//   return results;
// }

export const fetchAgent = async (
  agentID: number,
): Promise<AgentRowDataPacket | null> => {
  const connection = await connectToDB();

  const [rows] = await connection.execute<AgentRowDataPacket[]>(
    "SELECT id, agent_id, name, email, phone FROM agents WHERE id = ?",
    [agentID],
  );

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const createAgent = async (
  name: string,
  email: string,
  phone: string,
) => {
  const conn = await connectToDB();
  const session = await auth();

  try {
    await conn.beginTransaction();
    const adminID = session?.user?.id || 1;

    // Step 1: Insert placeholder agent_id
    const [result] = await conn.execute(
      `INSERT INTO agents (agent_id, admin_id, name, email, phone)
       VALUES (?, ?, ?, ?, ?)`,
      ["TEMP", adminID, name, email, phone],
    );

    const insertId = (result as any).insertId; // auto primary key (bigint unsigned)

    // Step 2: Generate long unique agent_id with padding
    const paddedId = insertId.toString().padStart(4, "0");
    const longId = `agent_${paddedId}x_${randomUUID()}${randomUUID()}`;

    // Step 3: Update the agent_id for that row
    await conn.execute(`UPDATE agents SET agent_id = ? WHERE id = ?`, [
      longId,
      insertId,
    ]);

    await conn.commit();

    return {
      id: insertId,
      agent_id: longId,
      name,
      email,
      phone,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    await conn.end();
  }
};
