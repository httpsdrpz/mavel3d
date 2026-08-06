"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";

import { createFirstAdminAction } from "@/app/admin/login/setup-actions";
import { Field, FormError, PasswordInput } from "@/components/admin/login-form";

export function SetupForm() {
  const [state, formAction, pending] = useActionState(createFirstAdminAction, undefined);

  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-600/30">
          <UserPlus className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
          Criar conta de administrador
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Nenhum administrador foi encontrado. Crie a primeira conta para gerenciar a loja.
        </p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <Field id="name" label="Nome">
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            placeholder="Seu nome"
          />
        </Field>

        <Field id="setup-email" label="Email">
          <input
            id="setup-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            placeholder="voce@mavel.com"
          />
        </Field>

        <Field id="setup-password" label="Senha">
          <PasswordInput id="setup-password" name="password" autoComplete="new-password" />
        </Field>

        <Field id="confirmPassword" label="Confirmar senha">
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
          />
        </Field>

        <FormError message={state?.error} />

        <button
          type="submit"
          disabled={pending}
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-xl hover:shadow-violet-600/40 disabled:opacity-60 disabled:shadow-none"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Criar conta
        </button>

        <Link
          href="/admin/login"
          className="text-center text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Voltar para o login
        </Link>
      </form>
    </div>
  );
}
