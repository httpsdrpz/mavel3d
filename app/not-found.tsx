import Link from "next/link";
import { Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="text-gradient bg-gradient-to-br from-primary via-purple-500 to-violet-700 bg-clip-text text-8xl font-bold">
        404
      </span>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Página não encontrada
        </h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          A página que você está procurando não existe ou foi movida.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/">
            <Home /> Voltar ao início
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/produtos">
            <Compass /> Explorar produtos
          </Link>
        </Button>
      </div>
    </div>
  );
}
