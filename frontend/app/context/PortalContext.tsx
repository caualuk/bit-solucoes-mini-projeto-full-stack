"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { FiCheckCircle } from "react-icons/fi";

import ConfirmDelete from "@/app/components/solicitations/ConfirmDelete";
import SolicitationForm from "@/app/components/solicitations/SolicitationForm";
import type { Solicitation } from "@/app/services/solicitation/solicitation";

// Ações compartilhadas entre as telas do portal
interface PortalContextValue {
  refreshKey: number; // muda sempre que os dados precisam ser recarregados
  refresh: () => void;
  openForm: (item?: Solicitation) => void; // sem item = nova solicitação
  askDelete: (item: Solicitation) => void;
  showToast: (text: string) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

// Hook para usar o contexto nos componentes
export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error("usePortal deve ser usado dentro de PortalProvider");
  return context;
}

// Guarda o estado dos modais e renderiza eles em um único lugar
export function PortalProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [formItem, setFormItem] = useState<Solicitation | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Solicitation | null>(null);
  const [toast, setToast] = useState("");

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  // Mostra uma mensagem rápida por 3 segundos
  const showToast = useCallback((text: string) => {
    setToast(text);
    setTimeout(() => setToast(""), 3000);
  }, []);

  function openForm(item?: Solicitation) {
    setFormItem(item ?? null);
    setFormOpen(true);
  }

  // Chamado depois de salvar ou excluir uma solicitação
  function handleSaved(message: string) {
    refresh();
    showToast(message);
  }

  return (
    <PortalContext.Provider value={{ refreshKey, refresh, openForm, askDelete: setDeleteItem, showToast }}>
      {children}

      {formOpen && (
        <SolicitationForm
          item={formItem}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            setFormOpen(false);
            handleSaved(formItem ? "Solicitação atualizada." : "Solicitação criada.");
          }}
        />
      )}

      {deleteItem && (
        <ConfirmDelete
          item={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDeleted={() => {
            setDeleteItem(null);
            handleSaved("Solicitação excluída.");
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-[#414151] bg-[#222230] px-4 py-2.5 text-sm text-white shadow-lg">
          <FiCheckCircle className="text-violet-400" size={16} />
          {toast}
        </div>
      )}
    </PortalContext.Provider>
  );
}
