import { supabase } from "../lib/supabase";

export async function changePassword(
  email,
  currentPassword,
  newPassword
) {
  // Verify current password
  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

  if (signInError) {
    return { error: { message: "Current password is incorrect." } };
  }

  // Update password
  return await supabase.auth.updateUser({
    password: newPassword,
  });
}