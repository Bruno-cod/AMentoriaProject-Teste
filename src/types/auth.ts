export type UserRole = "aluno" | "professor";

export interface UserData {
  name: string;
  email: string;
  role: UserRole;
  subject?: string;
}