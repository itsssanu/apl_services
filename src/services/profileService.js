import { supabase } from "../lib/supabase";

export async function uploadProfileImage(file, userId) {

  const ext = file.name.split(".").pop();

  const fileName = `${userId}.${ext}`;

  const { error } = await supabase.storage
    .from("profile-images")
    .upload(fileName, file, {
      upsert: true,
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("profile-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function createProfile(profile) {

  return await supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();

}

export async function updateProfile(userId, profile) {

  return await supabase
    .from("profiles")
    .update(profile)
    .eq("user_id", userId)
    .select()
    .single();

}
export async function getProfile(userId) {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
}

export async function saveProfile(profile) {

  const { data: existing } = await getProfile(profile.user_id);

  if (existing) {
    return await updateProfile(profile.user_id, profile);
  }

  return await createProfile(profile);

}