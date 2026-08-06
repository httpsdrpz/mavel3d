"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

/** Shows a one-time success toast right after the first-admin setup flow redirects here. */
export function WelcomeToast() {
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (searchParams.get("created") !== "1") return;
    toast.success("Conta de administrador criada com sucesso");
    router.replace("/admin");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount for this query param
  }, []);

  return null;
}
