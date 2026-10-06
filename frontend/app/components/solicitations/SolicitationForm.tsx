"use client";

import { useState, type FormEvent } from "react";
import { FiInfo } from "react-icons/fi";

import {
  createSolicitation,
  updateSolicitation,
  type Solicitation,
} from "@/app/services/solicitation/solicitation";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@/app/utils/constants";

interface Props {
  item: Solicitation | null; // null = criar, preenchido = editar
  onClose: () => void;
  onSaved: () => void;
}

// Modal para criar ou editar uma solicitação
export default function SolicitationForm({ item, onClose, onSaved }: Props) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [category, setCategory] = useState<Category | "">(item?.category ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Validações simples antes de enviar
  function validate(): string {
    if (title.trim().length < 5) return "Informe um título com pelo menos 5 caracteres.";
    if (!category) return "Selecione uma categoria.";
    if (description.trim().length < 10) return "Descreva a demanda com pelo menos 10 caracteres.";
    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = { title: title.trim(), description: description.trim(), category: category as Category };

      // Edita se recebeu item, senão cria
      if (item) {
        await updateSolicitation(item.id, data);
      } else {
        await createSolicitation(data);
      }

      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-32px)] w-full max-w-[580px] flex-col gap-4 overflow-y-auto rounded-xl border border-[#414151] bg-[#222230] p-6 text-white"
      >
        <div>
          <span className="text-xs uppercase tracking-wide text-violet-400">
            {item ? "Editar" : "Nova solicitação"}
          </span>
          <h2 className="text-xl font-medium">{item ? item.title : "Registrar demanda"}</h2>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="fm-title" className="mb-2 flex justify-between text-xs text-gray-300">
            <span>Título</span>
            <span>{title.length}/120</span>
          </label>
          <input
            id="fm-title"
            maxLength={120}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resumo curto da demanda"
            className="h-9 w-full rounded-lg border border-[#414151] bg-[#252532] px-3 text-sm outline-none placeholder:text-gray-500 focus:border-violet-400"
          />
        </div>

        {/* Categoria */}
        <div>
          <span className="mb-2 block text-xs text-gray-300">Categoria</span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`flex-1 rounded-lg border px-3 py-1.5 text-sm transition ${
                  category === c
                    ? "border-violet-400 bg-violet-400/20 text-white"
                    : "border-[#414151] text-[#A0A0C0] hover:text-white"
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="fm-desc" className="mb-2 flex justify-between text-xs text-gray-300">
            <span>Descrição</span>
            <span>{description.length}/2000</span>
          </label>
          <textarea
            id="fm-desc"
            rows={6}
            maxLength={2000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explique o contexto, o impacto e o que você precisa."
            className="w-full rounded-lg border border-[#414151] bg-[#252532] px-3 py-2 text-sm outline-none placeholder:text-gray-500 focus:border-violet-400"
          />
        </div>

        {error && <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-400">{error}</div>}

        {/* Ações */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-auto flex items-center gap-1.5 text-xs text-[#A0A0C0]">
            <FiInfo size={13} />
            {item ? "Só é possível editar enquanto estiver Aberto." : "A solicitação inicia como Aberto."}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-lg border border-[#414151] px-4 text-sm text-[#A0A0C0] hover:text-white"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="h-9 rounded-lg bg-violet-500 px-4 text-sm font-medium text-white transition hover:bg-violet-400 disabled:opacity-60"
          >
            {saving ? "Salvando..." : item ? "Salvar alterações" : "Criar solicitação"}
          </button>
        </div>
      </form>
    </div>
  );
}
