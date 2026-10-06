"use client";

import { useState } from "react";
import { FiEdit2, FiLock, FiTrash2 } from "react-icons/fi";

import { usePortal } from "@/app/context/PortalContext";
import {
  updateSolicitationStatus,
  type Solicitation,
} from "@/app/services/solicitation/solicitation";
import { CATEGORY_LABELS, STATUSES, STATUS_LABELS, type Status } from "@/app/utils/constants";
import { formatDateTime } from "@/app/utils/format";

// Painel que abre embaixo da solicitação, com os detalhes e ações, etc
export default function SolicitationDetail({ item }: { item: Solicitation }) {
  const { openForm, askDelete, refresh, showToast } = usePortal();

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Só pode editar/excluir enquanto estiver Aberto (regra implementada no backend)
  const editable = item.status === "OPEN";

  // Altera o status direto na API e recarrega a lista
  async function changeStatus(status: Status) {
    if (status === item.status) return;

    setBusy(true);
    setError("");
    try {
      await updateSolicitationStatus(item.id, status);
      refresh();
      showToast("Status atualizado.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao alterar status.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-lg border border-[#30303d] bg-[#1b1b29] p-4 text-sm text-white">
      {/* Informações */}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Info label="Categoria" value={CATEGORY_LABELS[item.category]} />
        <Info label="Solicitante" value={item.requester} />
        <Info label="Abertura" value={formatDateTime(item.createdAt)} />
      </dl>

      {/* Descrição */}
      <div>
        <span className="text-[11px] uppercase tracking-wider text-[#A0A0C0]">Descrição</span>
        <p className="mt-1.5 whitespace-pre-wrap leading-relaxed text-gray-200">{item.description}</p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Troca de status */}
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#A0A0C0]">Alterar status</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                disabled={busy}
                onClick={() => changeStatus(s)}
                className={`rounded-lg border px-3 py-1.5 transition disabled:opacity-60 ${
                  item.status === s
                    ? "border-violet-400 bg-violet-400/20 text-white"
                    : "border-[#414151] text-[#A0A0C0] hover:text-white"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          {error && <p className="mt-2 text-red-400">{error}</p>}
        </div>

        {/* Editar/excluir só quando estiver Aberto */}
        {editable ? (
          <div className="flex gap-2">
            <button
              onClick={() => askDelete(item)}
              className="flex h-9 items-center gap-2 rounded-lg border border-[#414151] px-4 text-[#A0A0C0] hover:text-white"
            >
              <FiTrash2 size={14} /> Excluir
            </button>
            <button
              onClick={() => openForm(item)}
              className="flex h-9 items-center gap-2 rounded-lg bg-violet-500 px-4 text-white hover:bg-violet-400"
            >
              <FiEdit2 size={14} /> Editar
            </button>
          </div>
        ) : (
          <span className="flex items-center gap-1.5 text-xs text-[#A0A0C0]">
            <FiLock size={13} /> Apenas solicitações com status Aberto podem ser alteradas.
          </span>
        )}
      </div>
    </div>
  );
}

// Par rótulo/valor da lista de informações
function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-[#A0A0C0]">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
