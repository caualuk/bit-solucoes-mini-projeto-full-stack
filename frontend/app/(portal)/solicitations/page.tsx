import { Suspense } from "react";

import Solicitations from "@/app/components/solicitations/Solicitations";

// Rota /solicitations
// Suspense é necessário porque a tela lê filtros da URL (useSearchParams)
export default function SolicitationsPage() {
  return (
    <Suspense>
      <Solicitations />
    </Suspense>
  );
}
