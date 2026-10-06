"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { FiArrowRight, FiCheckCircle, FiChevronDown, FiCircle, FiLayers, FiLoader } from "react-icons/fi";

import SolicitationDetail from "@/app/components/solicitations/SolicitationDetail";
import StatusTag from "@/app/components/ui/StatusTag";
import { usePortal } from "@/app/context/PortalContext";
import { getDashboard, type DashboardResponse } from "@/app/services/dashboard/dashboard";
import { getSolicitations, type Solicitation } from "@/app/services/solicitation/solicitation";
import { getUsername } from "@/app/utils/auth";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/app/utils/constants";
import { formatDate, shortCode, todayLabel } from "@/app/utils/format";

// Tela inicial com resumo das solicitações
export default function Dashboard() {
  const { refreshKey } = usePortal();

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [recent, setRecent] = useState<Solicitation[]>([]);
  const [byCategory, setByCategory] = useState<Record<Category, number> | null>(null);
  const [error, setError] = useState("");

  // Item da atividade recente com detalhes abertos (null = nenhum)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Carrega tudo em paralelo (e recarrega quando algo muda)
  useEffect(() => {
    async function load() {
      try {
        const [totals, latest, ...counts] = await Promise.all([
          getDashboard(),
          getSolicitations({ size: 5 }),
          // Total por categoria: usa o totalElements da página
          ...CATEGORIES.map((category) => getSolicitations({ category, size: 1 })),
        ]);

        setDashboard(totals);
        setRecent(latest.content);
        setByCategory(
          Object.fromEntries(CATEGORIES.map((c, i) => [c, counts[i].totalElements])) as Record<Category, number>,
        );
      } catch {
        setError("Não foi possível carregar o dashboard.");
      }
    }

    load();
  }, [refreshKey]);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!dashboard || !byCategory) return <p className="text-[#A0A0C0]">Carregando...</p>;

  const total = dashboard.totalRequests;

  // Percentual em relação ao total
  const percent = (value: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

  // Maior categoria, para escalar as barras
  const maxCategory = Math.max(1, ...Object.values(byCategory));

  return (
    <div className="flex flex-col gap-6">
      {/* Saudação */}
      <div>
        <p className="text-sm capitalize text-[#A0A0C0]">{todayLabel()}</p>
        <h1 className="mt-1 text-3xl font-medium">Olá, {getUsername()}</h1>
      </div>

      {/* Cards de totais (clicar leva para a lista filtrada) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard href="/solicitations" title="Total de solicitações" value={total} percentage={100} label="todas" icon={<FiLayers size={17} />} />
        <DashboardCard href="/solicitations?status=OPEN" title="Abertas" value={dashboard.openRequests} percentage={percent(dashboard.openRequests)} icon={<FiCircle size={17} />} />
        <DashboardCard href="/solicitations?status=IN_PROGRESS" title="Em atendimento" value={dashboard.requestsInProgress} percentage={percent(dashboard.requestsInProgress)} icon={<FiLoader size={17} />} />
        <DashboardCard href="/solicitations?status=COMPLETED" title="Concluídas" value={dashboard.completedRequests} percentage={percent(dashboard.completedRequests)} icon={<FiCheckCircle size={17} />} />
      </div>

      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-3">
        {/* Atividade recente */}
        <section className="rounded-xl border border-[#414151] bg-[#222230] p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Atividade recente</h2>
            <Link href="/solicitations" className="flex items-center gap-1 text-sm text-[#A0A0C0] hover:text-white">
              Ver todas <FiArrowRight size={14} />
            </Link>
          </div>

          {recent.length === 0 && <p className="mt-3 text-sm text-[#A0A0C0]">Nenhuma solicitação registrada ainda.</p>}

          <div className="mt-2">
            {recent.map((r) => {
              const expanded = expandedId === r.id;

              return (
                <div key={r.id}>
                  {/* Clique abre/fecha os detalhes embaixo do item */}
                  <button
                    onClick={() => setExpandedId(expanded ? null : r.id)}
                    className={`-mx-2 grid w-[calc(100%+16px)] grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 rounded-lg px-2 py-2.5 text-left hover:bg-white/5 ${expanded ? "bg-white/5" : ""}`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <FiChevronDown size={14} className={`flex-none text-[#A0A0C0] transition ${expanded ? "rotate-180 text-violet-400" : ""}`} />
                      <span className="text-xs text-[#A0A0C0]">{shortCode(r.id)}</span>
                      <span className="truncate">{r.title}</span>
                    </span>
                    <StatusTag status={r.status} />
                    <span className="pl-[22px] text-xs text-[#A0A0C0]">
                      {CATEGORY_LABELS[r.category]} · {r.requester} · {formatDate(r.createdAt)}
                    </span>
                  </button>

                  {/* "Aba" de detalhes */}
                  {expanded && (
                    <div className="pb-3 pt-1">
                      <SolicitationDetail item={r} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Total por categoria */}
        <section className="rounded-xl border border-[#414151] bg-[#222230] p-4">
          <h2 className="font-medium">Por categoria</h2>
          <div className="mt-4 flex flex-col gap-3">
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/solicitations?category=${c}`} className="flex flex-col gap-1.5 hover:text-violet-300">
                <span className="flex justify-between text-sm">
                  <span>{CATEGORY_LABELS[c]}</span>
                  <span className="text-[#A0A0C0]">{byCategory[c]}</span>
                </span>
                <span className="h-1 overflow-hidden rounded-full bg-[#30303d]">
                  <span className="block h-full bg-violet-400" style={{ width: `${(byCategory[c] / maxCategory) * 100}%` }} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  href: string;
  title: string;
  value: number;
  percentage: number;
  icon: ReactNode;
  label?: string;
}

// Card com valor e barra de percentual
function DashboardCard({ href, title, value, percentage, icon, label }: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-[#414151] bg-[#222230] p-4 transition hover:-translate-y-px hover:border-violet-500"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#A0A0C0]">{title}</span>
        <span className="text-violet-400">{icon}</span>
      </div>

      <div className="mt-3 text-4xl font-medium">{value}</div>

      <div className="mt-4 flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#30303d]">
          <div className="h-full rounded-full bg-violet-400" style={{ width: `${percentage}%` }} />
        </div>
        <span className="text-xs text-[#A0A0C0]">{label ?? `${percentage}%`}</span>
      </div>
    </Link>
  );
}
