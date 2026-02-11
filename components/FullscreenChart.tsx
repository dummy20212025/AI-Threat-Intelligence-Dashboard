"use client";

import { X } from "lucide-react";

export default function FullscreenChart({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-[80vw] h-[80vh]
          bg-[rgb(var(--card))]
          backdrop-blur-xl
          rounded-2xl
          p-6
          border border-[rgb(var(--border))]
          shadow-2xl
        "
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            p-2 rounded-full
            bg-black/20 hover:bg-black/40
            text-white
            transition
          "
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}
