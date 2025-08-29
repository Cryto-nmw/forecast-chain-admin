import { RowDataPacket } from "mysql2";
export interface Agent {
  id: number; // matches insertId from MariaDB (AUTO_INCREMENT bigint)
  agent_id: string; // your generated longId ("agent_0000x_...")
  name: string;
  email: string;
  phone: string;
}

export interface AgentVerificationTokenRow extends RowDataPacket {
  id: number; // token table primary key
  agent_id: number; // foreign key to agents.id
  token: string; // 128-char token
  created_at: string; // timestamp string
  expires_at: string; // timestamp string
  status: "PENDING" | "USED" | "REVOKED"; // enum
  is_used: 0 | 1; // tinyint
  used_at: string | null; // nullable timestamp
}

export interface AgentRowDataPacket extends RowDataPacket {
  id: number;
  agent_id: string;
  name: string;
  email: string;
  phone: string;
}

export type DeleteResponse = {
  success: boolean;
  message: string;
};
