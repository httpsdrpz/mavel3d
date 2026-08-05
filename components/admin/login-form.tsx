"use client";

import * as React from "react";
import { useActionState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";

import { loginAction } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-900/60 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            required
            className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            placeholder="voce@mavel.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-zinc-300">
            Senha
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-white placeholder:text-zinc-500 outline-none transition-colors focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-300"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {state?.error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300">
            <AlertCircle className="size-4 shrink-0" />
            {state.error}
          </div>
        )}

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
    </div>
  );
}
