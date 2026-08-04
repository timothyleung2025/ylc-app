import { AccessBoundary } from "@/components/access-boundary";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AccessBoundary>{children}</AccessBoundary>;
}
