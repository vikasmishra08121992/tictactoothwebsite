import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * The consult-room doorway arch — a true semicircular top on straight sides,
 * not a soft-cornered blob. Reused as the shape language for the
 * trust/clinical register: credential cards and Special Needs.
 * Grid = play register. Arch = trust register.
 */
export function ArchMask({
  children,
  className,
  soft = false,
}: {
  children: ReactNode;
  className?: string;
  /** Rounds the bottom corners a little more — for cards rather than images. */
  soft?: boolean;
}) {
  return (
    <div className={cn("overflow-hidden", soft ? "arch-soft" : "arch", className)}>
      {children}
    </div>
  );
}
