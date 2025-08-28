import { RowDataPacket } from "mysql2";
export interface Agent {
  id: number; // matches insertId from MariaDB (AUTO_INCREMENT bigint)
  agent_id: string; // your generated longId ("agent_0000x_...")
  name: string;
  email: string;
  phone: string;
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
