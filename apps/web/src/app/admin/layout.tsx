import { authClient } from "@/lib/auth-client";
import AdminLayout from "@/modules/layouts/admin-layout";
import { headers } from "next/headers";

export default async function AccountPageLayout({
  dashboard,
  auth
}: {
  dashboard?: React.ReactNode;
  auth?: React.ReactNode;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers()
    }
  });

  return (
    <AdminLayout>
      {session.data && !session.error ? dashboard : auth}
    </AdminLayout>
  );
}
