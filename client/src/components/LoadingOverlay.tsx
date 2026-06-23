import { Loader2 } from "lucide-react";

type LoadingOverlayProps = {
  open: boolean;
  text?: string;
};

export const LoadingOverlay = ({
  open,
  text = "Loading..."
}: LoadingOverlayProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="rounded-xl bg-background p-6 shadow-xl">
        <Loader2 className="mx-auto h-8 w-8 animate-spin" />
        <p className="mt-2 text-sm">{text}</p>
      </div>
    </div>
  );
};
