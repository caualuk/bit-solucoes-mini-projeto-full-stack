"use client";

import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";

import { deleteSolicitation, type Solicitation } from "@/app/services/solicitation/solicitation";
import { shortCode } from "@/app/utils/format";

interface Props {
  item: Solicitation;
  onClose: () => void;
  onDeleted: () => void;
}

// Modal de confirmação antes de excluir
export default function ConfirmDelete({ item, onClose, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await deleteSolicitation(item.id);
      onDeleted();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir.");
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[420px] rounded-xl border border-[#414151] bg-[#222230] p-6 text-white">
        <h2 className="text-lg font-medium">Excluir solicitação?</h2>
        <p className="mt-2 text-sm text-[#A0A0C0]">
          {shortCode(item.id)} · {item.title}. Esta ação não pode ser desfeita.
        </p>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="h-9 rounded-lg border border-[#414151] px-4 text-sm text-[#A0A0C0] hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-9 items-center gap-2 rounded-lg bg-violet-500 px-4 text-sm text-white hover:bg-violet-400 disabled:opacity-60"
          >
            <FiTrash2 size={14} /> {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}
