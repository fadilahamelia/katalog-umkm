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

export async function gantiPassword(prevState, formData) {
  const data =
    formData instanceof FormData
      ? formData
      : prevState instanceof FormData
        ? prevState
        : null;

  const passwordBaru = data ? data.get("password_baru") : null;
  const konfirmasiPassword = data ? data.get("konfirmasi_password") : null;

  if (!passwordBaru || !konfirmasiPassword) {
    return {
      error: "Password baru dan konfirmasi password wajib diisi.",
    };
  }

  if (passwordBaru.length < 8) {
    return {
      error: "Password baru minimal 8 karakter.",
    };
  }

  if (passwordBaru !== konfirmasiPassword) {
    return {
      error: "Konfirmasi password tidak sama dengan password baru.",
    };
  }

  try {
    const supabase = await createAdminSessionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        error: "Anda belum login atau sesi telah berakhir. Silakan login kembali.",
      };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      return {
        error: error.message || "Gagal mengganti password di server.",
      };
    }

    return {
      success: true,
      message: "Password berhasil diganti.",
    };
  } catch (err) {
    return {
      error: err.message || "Terjadi kesalahan saat mengganti password.",
    };
  }
}

export const login = masuk;
export const logout = keluar;
export const ubahPassword = gantiPassword;
export const updatePassword = gantiPassword;
