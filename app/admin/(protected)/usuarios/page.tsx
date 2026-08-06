import { auth } from "@/auth";
import { listAdminUsers } from "@/services/users";
import { UsersTable } from "@/components/admin/users-table";

// Per-session admin data — never prerender/cache at build time.
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, session] = await Promise.all([listAdminUsers(), auth()]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Usuários</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie os administradores com acesso ao painel da MAVEL.
        </p>
      </div>

      <UsersTable users={users} currentUserId={session?.user.id ?? ""} />
    </div>
  );
}
