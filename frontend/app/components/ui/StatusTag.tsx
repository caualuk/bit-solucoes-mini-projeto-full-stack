import { STATUS_LABELS, type Status } from "@/app/utils/constants";

// Cor dos status
const STYLES: Record<Status, string> = {
  OPEN: "border border-violet-400 text-violet-300",
  IN_PROGRESS: "bg-violet-500/25 text-violet-200",
  COMPLETED: "bg-[#30303d] text-[#A0A0C0]",
};

// Etiqueta colorida com o status da solicitação
export default function StatusTag({ status }: { status: Status }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
