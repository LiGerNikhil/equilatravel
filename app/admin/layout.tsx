import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Equila Travel Admin",
    default: "Admin | Equila Travel",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
