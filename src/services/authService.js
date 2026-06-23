import { supabase } from "../lib/supabase";

export async function signUp(email, password) {
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

// NEW
export async function resetPassword(email) {
  const redirectUrl = `${import.meta.env.VITE_APP_URL}/reset-password`;

  console.log("Redirect URL:", redirectUrl);

  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });
}

// NEW
export async function updatePassword(password) {
  return await supabase.auth.updateUser({
    password,
  });
}