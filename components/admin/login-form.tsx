"use client";

import * as React from "react";
import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock, UserPlus } from "lucide-react";

import { loginAction } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

export function PasswordInput({
  id,
  name,
  autoComplete,
  placeholder,
}: {
  id: string;
  name: string;
  autoComplete: string;
  placeholder?: string;
}) {
  const [visible, setVisible] = React.useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
        placeholder={placeholder ?? "••••••••"}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}

export function Field({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
      <AlertCircle className="size-4 shrink-0" />
      {message}
    </div>
  );
}

function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-300">
      <CheckCircle2 className="size-4 shrink-0" />
      {message}
    </div>
  );
}

function LoginCard({
  showSetup,
  successMessage,
}: {
  showSetup: boolean;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-600/30">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-white">
          Acesso administrativo
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Entre com sua conta para gerenciar a loja MAVEL.
        </p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <Field id="email" label="Email">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            placeholder="voce@mavel.com"
          />
        </Field>

        <Field id="password" label="Senha">
          <PasswordInput id="password" name="password" autoComplete="current-password" />
        </Field>

        <FormSuccess message={!state?.error ? successMessage : undefined} />
        <FormError message={state?.error} />

        <button
          type="submit"
          disabled={pending}
          className={cn(
            "mt-2 flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-600 to-purple-500 text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all hover:shadow-xl hover:shadow-violet-600/40 disabled:opacity-60 disabled:shadow-none"
          )}
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          Entrar
        </button>
      </form>

      {showSetup && (
        <Link
          href="/admin/login/criar-conta"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:border-violet-500/40 hover:text-violet-300"
        >
          <UserPlus className="size-4" />
          Criar Conta de Administrador
        </Link>
      )}
    </>
  );
}

export function LoginForm({
  showSetup,
  successMessage,
}: {
  showSetup: boolean;
  successMessage?: string;
}) {
  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <LoginCard showSetup={showSetup} successMessage={successMessage} />
    </div>
  );
}
