import type { ReactNode } from "react";

export const metadata = {
  title: "Vendor Portal | Equila Travel",
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-royal-900 text-white pt-28 md:pt-32">
      {children}
    </div>
  );
}
