import { adminOnly } from "@/src/lib/actions/userActions";

export default async function AdminPage() {
  await adminOnly();

  return <div>Admin</div>;
}
