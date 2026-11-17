"use client";

import Link from "next/link";
import { useState } from "react";
import { OptionGroup } from "@/components/ui/controls";
import { dayLabel, windowLabel } from "@/lib/format";
import type { PickupWindow } from "@/lib/types";

export function NextWindows({ zip, windows }: { zip: string; windows: PickupWindow[] }) {
  const [win, setWin] = useState(windows[0]?.id ?? null);
  return (
    <>
      <OptionGroup
        label="Next pickup windows"
        className="mt-[14px]"
        value={win}
        onChange={setWin}
        options={windows.map((w) => ({ value: w.id, label: dayLabel(w.date, { relative: true }), hint: windowLabel(w) }))}
      />
      <div className="row" style={{ marginTop: 26 }}>
        <Link className="btn p" href={`/book?zip=${zip}${win ? `&window=${encodeURIComponent(win)}` : ""}`}>
          Book a pickup →
        </Link>
        <Link className="btn g" href="/">
          Change address
        </Link>
      </div>
    </>
  );
}
