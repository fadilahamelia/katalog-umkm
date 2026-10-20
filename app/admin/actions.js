"use server";

import { redirect } from "next/navigation";
import { createAdminSessionClient } from "@/lib/supabase/session";

export async function masuk(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const email = data ? data.get("email") : null;
  const password = data ? data.get("password") : null;

  if (!email || !password) {
    return {
      error: "Email dan password wajib diisi.",
    };
  }

  let success = false;
  let errorMessage = null;

  try {
    const supabase = await createAdminSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      errorMessage = "Email atau password salah. Silakan coba lagi.";
    } else {
      success = true;
    }
  } catch (err) {
    errorMessage =
      err.message || "Terjadi kesalahan saat memproses login di server.";
  }

  if (!success) {
    return {
      error: errorMessage,
    };
  }

  redirect("/admin");
}

export async function keluar() {
  try {
    const supabase = await createAdminSessionClient();
    await supabase.auth.signOut();
  } catch {
    // Abaikan error saat logout
  }

  redirect("/admin/login");
}

export const login = masuk;
export const logout = keluar;

