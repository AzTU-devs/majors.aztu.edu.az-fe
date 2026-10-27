"use client";

import { IconPrint } from "@/components/ui/icons";
import { buttonClass } from "@/components/ui/primitives";

export default function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClass("ghost", "sm", "no-print")}>
      <IconPrint />
      {label}
    </button>
  );
}
