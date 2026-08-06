import type { AdminRole } from "@/lib/types";

declare module "next-auth" {
  interface User {
    name?: string | null;
    role?: AdminRole;
  }

  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      role?: AdminRole;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    uid?: string;
    role?: AdminRole;
  }
}
