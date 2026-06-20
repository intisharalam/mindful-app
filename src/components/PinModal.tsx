"use client";

import { useState } from "react";

export default function PinModal({
  onSuccess,
  onCancel,
  title = "Enter parent PIN",
  subtitle = "Switching to parent mode needs your 4-digit PIN.",
}: {
  onSuccess: (pin: string) => boolean | Promise<boolean>;
  onCancel: () => void;
  title?: string;
  subtitle?: string;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleSubmit = async () => {
    setChecking(true);
    const ok = await onSuccess(value);
    setChecking(false);
    if (!ok) {
      setError(true);
      setValue("");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface rounded-2xl w-full max-w-[320px] p-7 text-center border border-border-soft"
      >
        <h2 className="text-[16px] font-semibold text-ink mb-1.5">{title}</h2>
        <p className="text-[12px] text-ink-tertiary mb-5">{subtitle}</p>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={value}
          onChange={(e) => {
            setError(false);
            setValue(e.target.value.replace(/\D/g, ""));
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          autoFocus
          className={`w-full text-center text-[20px] tracking-[0.5em] font-medium border rounded-lg py-2.5 mb-1.5 outline-none ${
            error
              ? "border-friction text-friction"
              : "border-border text-ink focus:border-deep"
          }`}
          placeholder="••••"
        />
        {error && (
          <p className="text-[11px] text-friction mb-3">Incorrect PIN. Try again.</p>
        )}
        {!error && <div className="mb-3" />}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 text-[13px] font-medium rounded-full py-2.5 border border-border text-ink-secondary hover:bg-app-bg"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={value.length !== 4 || checking}
            className={`flex-1 text-[13px] font-medium rounded-full py-2.5 ${
              value.length === 4 && !checking
                ? "bg-deep text-white hover:opacity-90"
                : "bg-app-bg text-ink-tertiary cursor-not-allowed"
            }`}
          >
            {checking ? "Checking…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
