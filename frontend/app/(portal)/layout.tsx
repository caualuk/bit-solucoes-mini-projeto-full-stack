import type { ReactNode } from "react";

import PortalShell from "@/app/components/layout/PortalShell";

// Layout compartilhado por /dashboard e /solicitations
export default function PortalLayout({ children }: { children: ReactNode }) {
  return <PortalShell>{children}</PortalShell>;
}
