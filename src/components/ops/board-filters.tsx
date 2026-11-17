"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function BoardFilters({ zones }: { zones: { id: string; name: string }[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  return (
    <div className="row">
      <label className="sr-only" htmlFor="zone-filter">
        Zone
      </label>
      <select
        id="zone-filter"
        className="sel"
        value={params.get("zone") ?? ""}
        onChange={(e) => {
          const p = new URLSearchParams(params);
          if (e.target.value) p.set("zone", e.target.value);
          else p.delete("zone");
          router.push(`${pathname}?${p}`);
        }}
      >
        <option value="">All zones</option>
        {zones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.name}
          </option>
        ))}
      </select>
    </div>
  );
}
