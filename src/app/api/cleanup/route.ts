import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Get all auth user IDs
  const { data: { users }, error: authErr } = await admin.auth.admin.listUsers({ perPage: 1000 });
  if (authErr) return NextResponse.json({ error: authErr.message }, { status: 500 });

  const validIds = users.map((u) => u.id);

  if (validIds.length === 0) {
    // No real users — delete everything except nothing
    return NextResponse.json({ deleted: 0, message: "No auth users found" });
  }

  // Delete profiles whose id is NOT in the valid auth user list
  const { data, error } = await admin
    .from("profiles")
    .delete()
    .not("id", "in", `(${validIds.join(",")})`)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: data?.length ?? 0, message: "Orphaned profiles removed" });
}
