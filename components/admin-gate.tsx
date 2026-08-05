"use client";
import { useState } from "react";
import { AdminDashboard } from "./admin-dashboard";
import { AdminLogin } from "./admin-login";

export function AdminGate() {
  const [token, setToken] = useState<string | null>(null);
  return token ? <AdminDashboard token={token} onLogout={() => setToken(null)} /> : <AdminLogin onSuccess={setToken} />;
}
