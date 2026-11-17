import { listZones } from "@/lib/api";

// TODO(backend): stream real waitlist rows (email, zip, joined_at) from the backend.
export async function GET() {
  const zones = await listZones();
  const rows = [["zone", "zips", "waitlist"], ...zones.map((z) => [z.name, z.zips.join(" "), String(z.waitlist)])];
  return new Response(rows.map((r) => r.join(",")).join("\n"), {
    headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="waitlist.csv"' },
  });
}
