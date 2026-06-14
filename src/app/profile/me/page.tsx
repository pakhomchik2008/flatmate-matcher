import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import MyProfileClient from "./MyProfileClient";

export default async function MyProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!profile) redirect("/onboarding");

  return <MyProfileClient profile={profile} email={user.email ?? ""} />;
}
