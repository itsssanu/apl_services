import { supabase } from "../lib/supabase";

export async function uploadCompanyLogo(file, userId) {

  const ext = file.name.split(".").pop();

  const fileName = `${userId}.${ext}`;

  const { error } = await supabase.storage
    .from("company-logos")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("company-logos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function createCompany(company) {

  return await supabase
    .from("companies")
    .insert(company);

}

export async function getCompany(userId) {
  return await supabase
    .from("companies")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
}

export async function updateCompany(userId, company) {
  return await supabase
    .from("companies")
    .update(company)
    .eq("user_id", userId);
}