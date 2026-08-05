"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState | undefined,
  formData: FormData
): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email ou senha inválidos." };
    }
    throw error; // rethrow the redirect signal (and genuine unexpected errors)
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
