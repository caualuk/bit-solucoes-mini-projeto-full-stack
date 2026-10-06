"use client";

import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import {
  FiArrowDown,
  FiArrowUp,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiSearch,
  FiX,
} from "react-icons/fi";

import RowActions from "@/app/components/solicitations/RowActions";
import SolicitationDetail from "@/app/components/solicitations/SolicitationDetail";
import StatusTag from "@/app/components/ui/StatusTag";
import { usePortal } from "@/app/context/PortalContext";
import {
  getSolicitations,
  type Page,
  type Solicitation,
} from "@/app/services/solicitation/solicitation";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  STATUSES,
  STATUS_LABELS,
  type Category,
  type Status,
} from "@/app/utils/constants";
import { formatDate, shortCode } from "@/app/utils/format";

// Classe padrão dos campos de filtro
const inputClass =
  "h-9 w-full rounded-lg border border-[#414151] bg-[#252532] px-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-violet-400 [color-scheme:dark]";

// Tela de listagem com filtros, ordenação e paginação
export default function Solicitations() {
  const searchParams = useSearchParams();
  const { refreshKey, openForm, askDelete } = usePortal();

  // Filtros (status/categoria podem vir da URL)
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category | "">((searchParams.get("category") as Category) ?? "");
  const [status, setStatus] = useState<Status | "">((searchParams.get("status") as Status) ?? "");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const [data, setData] = useState<Page<Solicitation> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Solicitação com os detalhes abertos (null = nenhuma)
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Abre os detalhes da linha clicada ou fecha se já estiver aberta
  function toggleExpanded(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  // Espera o usuário parar de digitar antes de buscar
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitle(search.trim());
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Busca na API sempre que filtros, página ou dados mudarem
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await getSolicitations({ title, category, status, startDate, endDate, sort, page });

        // Se a página ficar vazia após excluir o último item, volta uma página
        if (result.content.length === 0 && page > 0) {
          setPage(page - 1);
          return;
        }

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar as solicitações.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [title, category, status, startDate, endDate, sort, page, refreshKey]);

  // Altera um filtro e volta para a primeira página
  function changeFilter<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(0);
  }

  function clearFilters() {
    setSearch("");
    setTitle("");
    setCategory("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  }

  // Filtros ativos exibidos como cards/chips removíveis
  const chips = [
    title && { label: `"${title}"`, clear: () => setSearch("") },
    category && { label: CATEGORY_LABELS[category], clear: () => changeFilter(setCategory, "") },
    status && { label: STATUS_LABELS[status], clear: () => changeFilter(setStatus, "") },
    startDate && { label: `De ${formatDate(`${startDate}T00:00`)}`, clear: () => changeFilter(setStartDate, "") },
    endDate && { label: `Até ${formatDate(`${endDate}T00:00`)}`, clear: () => changeFilter(setEndDate, "") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const total = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="flex flex-col gap-5">
      {/* Cabeçalho */}
      <div>
        <h1 className="text-3xl font-medium">Solicitações</h1>
        <p className="mt-1 text-sm text-[#A0A0C0]">
          {total} {total === 1 ? "solicitação encontrada" : "solicitações encontradas"}
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <Field label="Buscar" htmlFor="f-q">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0C0]" size={14} />
            <input
              id="f-q"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Título"
              className={`${inputClass} pl-9`}
            />
          </div>
        </Field>

        <Field label="Categoria" htmlFor="f-cat">
          <select
            id="f-cat"
            value={category}
            onChange={(e) => changeFilter(setCategory, e.target.value as Category | "")}
            className={inputClass}
          >
            <option value="">Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" htmlFor="f-st">
          <select
            id="f-st"
            value={status}
            onChange={(e) => changeFilter(setStatus, e.target.value as Status | "")}
            className={inputClass}
          >
            <option value="">Todos</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="De" htmlFor="f-from">
          <input
            id="f-from"
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => changeFilter(setStartDate, e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Até" htmlFor="f-to">
          <input
            id="f-to"
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => changeFilter(setEndDate, e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Chips de filtros ativos */}
      {chips.length > 0 && (
        <div className="-mt-2 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.clear}
              className="flex items-center gap-1.5 rounded-full bg-violet-500/25 px-2.5 py-0.5 text-xs text-violet-200 hover:bg-violet-500/40"
            >
              {chip.label} <FiX size={12} />
            </button>
          ))}
          <button onClick={clearFilters} className="text-xs text-[#A0A0C0] hover:text-white">
            Limpar filtros
          </button>
        </div>
      )}

      {/* Tabela */}
      <section className="overflow-x-auto rounded-xl border border-[#414151] bg-[#222230] px-2 py-1">
        <table className="w-full min-w-[860px] table-fixed text-sm">
          <thead>
            <tr className="border-b border-[#30303d] text-left text-xs text-[#A0A0C0]">
              <th className="w-[130px] px-3 py-3 font-normal">Código</th>
              <th className="px-3 py-3 font-normal">Título</th>
              <th className="w-[120px] px-3 py-3 font-normal">Categoria</th>
              <th className="w-[150px] px-3 py-3 font-normal">Solicitante</th>
              <th className="w-[120px] px-3 py-3 font-normal">
                {/* Alterna ordenação por data */}
                <button
                  onClick={() => changeFilter(setSort, sort === "desc" ? "asc" : "desc")}
                  className="flex items-center gap-1 hover:text-white"
                >
                  Abertura {sort === "desc" ? <FiArrowDown size={12} /> : <FiArrowUp size={12} />}
                </button>
              </th>
              <th className="w-[140px] px-3 py-3 font-normal">Status</th>
              <th className="w-[80px] px-3 py-3 text-right font-normal">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Só mostra "carregando" na primeira busca, para não piscar ao recarregar */}
            {loading && !data && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-[#A0A0C0]">
                  Carregando solicitações...
                </td>
              </tr>
            )}

            {error && !loading && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-red-400">
                  {error}
                </td>
              </tr>
            )}

            {!error &&
              data?.content.map((r) => {
                const expanded = expandedId === r.id;

                return (
                  <Fragment key={r.id}>
                  {/* Linha da solicitação: clique abre/fecha os detalhes */}
                  <tr
                    onClick={() => toggleExpanded(r.id)}
                    className={`cursor-pointer border-b border-[#30303d] hover:bg-white/5 ${expanded ? "bg-white/5" : ""}`}
                  >
                    <td className="px-3 py-3 text-xs text-[#A0A0C0]">
                      <span className="flex items-center gap-1.5">
                        <FiChevronDown size={14} className={`transition ${expanded ? "rotate-180 text-violet-400" : ""}`} />
                        {shortCode(r.id)}
                      </span>
                    </td>
                    <td className="truncate px-3 py-3">{r.title}</td>
                    <td className="px-3 py-3">{CATEGORY_LABELS[r.category]}</td>
                    <td className="truncate px-3 py-3">{r.requester}</td>
                    <td className="px-3 py-3">{formatDate(r.createdAt)}</td>
                    <td className="px-3 py-3">
                      <StatusTag status={r.status} />
                    </td>
                    {/* stopPropagation evita abrir o detalhe ao clicar no menu */}
                    <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {/* Só pode editar/excluir enquanto estiver Aberto */}
                      <RowActions
                        locked={r.status !== "OPEN"}
                        onView={() => setExpandedId(r.id)}
                        onEdit={() => openForm(r)}
                        onDelete={() => askDelete(r)}
                      />
                    </td>
                  </tr>

                  {/* "Aba" de detalhes logo abaixo da linha */}
                  {expanded && (
                    <tr className="border-b border-[#30303d]">
                      <td colSpan={7} className="px-3 pb-4 pt-1">
                        <SolicitationDetail item={r} />
                      </td>
                    </tr>
                  )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>

        {/* Estado vazio */}
        {!loading && !error && data?.content.length === 0 && (
          <div className="flex flex-col items-start gap-2 px-3 py-7">
            <FiSearch size={22} className="text-violet-400" />
            <span>Nenhuma solicitação encontrada</span>
            <span className="text-sm text-[#A0A0C0]">Ajuste os filtros ou registre uma nova solicitação.</span>
            <div className="mt-1 flex gap-2">
              <button onClick={clearFilters} className="h-9 rounded-lg border border-[#414151] px-4 text-sm text-[#A0A0C0] hover:text-white">
                Limpar filtros
              </button>
              <button
                onClick={() => openForm()}
                className="flex h-9 items-center gap-2 rounded-lg bg-violet-500 px-4 text-sm text-white hover:bg-violet-400"
              >
                <FiPlus size={14} /> Nova solicitação
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-3 text-sm text-[#A0A0C0]">
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <IconButton title="Anterior" disabled={page === 0} onClick={() => setPage(page - 1)}>
            <FiChevronLeft size={16} />
          </IconButton>
          <IconButton title="Próxima" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>
            <FiChevronRight size={16} />
          </IconButton>
        </div>
      )}
    </div>
  );
}

// Rótulo + campo de filtro
function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-xs text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

// Botão pequeno só com ícone
function IconButton({
  title,
  disabled,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A0C0] transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
