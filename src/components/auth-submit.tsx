"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

export function AuthSubmit({
  children,
  pendingText,
  disabled = false,
  className = "button button-primary",
}: {
  children: ReactNode;
  pendingText: string;
  disabled?: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending || disabled}
      aria-disabled={pending || disabled}
    >
      {pending ? pendingText : children}
    </button>
  );
}
