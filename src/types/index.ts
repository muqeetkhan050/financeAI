export interface Insights {
  summary: string;
  metrics: string;
  risks: string;
  recommendations: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}


declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name?: string | null };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}