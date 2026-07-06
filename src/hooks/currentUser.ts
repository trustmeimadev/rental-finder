// src/hooks/useCurrentUser.ts
import { useState } from "react";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  role: "tenant" | "landlord";
} | null;

export function currentUser() {
  const [user] = useState<MockUser>(null); // null = not logged in
  return { user, loading: false, refresh: async () => {} };
}