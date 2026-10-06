"use client";

import { useState, type ReactNode } from "react";
import { FiEdit2, FiEye, FiMoreVertical, FiTrash2 } from "react-icons/fi";

interface Props {
  locked: boolean; // true = não pode editar/excluir
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// Botão de três pontinhos com o menu de ações da linha
export default function RowActions({ locked, onView, onEdit, onDelete }: Props) {
  // Posição do menu na tela (null = fechado)
  const [position, setPosition] = useState<{ top: number; right: number } | null>(null);

  // Abre o menu logo abaixo do botão
  // Usa posição fixa para o menu não ser cortado pela rolagem da tabela
  function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    if (position) {
      setPosition(null);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    setPosition({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
  }

  // Fecha o menu e executa a ação escolhida
  function run(action: () => void) {
    setPosition(null);
    action();
  }

  const lockedTitle = "Apenas solicitações com status Aberto podem ser alteradas";

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        title="Ações"
        aria-label="Ações"
        aria-expanded={!!position}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#A0A0C0] transition hover:bg-white/10 hover:text-white"
      >
        <FiMoreVertical size={16} />
      </button>

      {position && (
        <>
          {/* Fecha o menu ao clicar fora ou rolar a página */}
          <div className="fixed inset-0 z-30" onClick={() => setPosition(null)} onWheel={() => setPosition(null)} />

          <div
            role="menu"
            style={{ top: position.top, right: position.right }}
            className="fixed z-[31] w-40 rounded-lg border border-[#414151] bg-[#252532] p-1 text-left shadow-xl"
          >
            <MenuItem icon={<FiEye size={14} />} label="Visualizar" onClick={() => run(onView)} />
            <MenuItem icon={<FiEdit2 size={14} />} label="Editar" disabled={locked} title={locked ? lockedTitle : undefined} onClick={() => run(onEdit)} />
            <MenuItem icon={<FiTrash2 size={14} />} label="Excluir" disabled={locked} title={locked ? lockedTitle : undefined} danger onClick={() => run(onDelete)} />
          </div>
        </>
      )}
    </>
  );
}

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  title?: string;
}

// Item do menu de ações
function MenuItem({ icon, label, onClick, disabled, danger, title }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${
        danger ? "text-red-400" : "text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
