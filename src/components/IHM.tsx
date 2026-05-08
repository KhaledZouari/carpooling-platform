import { useEffect, useRef } from "react";
import gsap from "gsap";
import { MaterialIcon } from "./MaterialIcon";

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  danger = false,
}: {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(
        modalRef.current,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim/60 backdrop-blur-sm p-4"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-md rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_32px_rgba(31,41,51,0.08)] border border-outline-variant/30"
      >
        <h3 id="confirm-modal-title" className="text-2xl font-headline font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant text-sm leading-relaxed">{message}</p>
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold text-on-primary transition-all hover:scale-105 active:scale-95 ${
              danger ? "bg-error text-on-error hover:bg-error/90" : "bg-primary hover:bg-primary-dim"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
}) {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      toastRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
    );

    const timer = setTimeout(() => {
      gsap.to(toastRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
        onComplete: onClose,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass =
    type === "success"
      ? "bg-primary text-on-primary"
      : type === "error"
        ? "bg-error text-on-error"
        : "bg-surface-container-high text-on-surface";

  const iconName =
    type === "success"
      ? "check_circle"
      : type === "error"
        ? "error"
        : "info";

  return (
    <div
      ref={toastRef}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3 shadow-[0_12px_32px_rgba(31,41,51,0.08)] border border-outline-variant/70 ${bgClass}`}
    >
      <MaterialIcon name={iconName} className="text-xl" />
      <span className="font-semibold text-sm">{message}</span>
      <button onClick={() => {
        gsap.to(toastRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: onClose,
        });
      }} className="ml-2 opacity-70 hover:opacity-100 transition-opacity">
        <MaterialIcon name="close" className="text-lg" />
      </button>
    </div>
  );
}
