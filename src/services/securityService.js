import { supabase } from "../lib/supabase";

export async function updateUserPassword(newPassword) {
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}