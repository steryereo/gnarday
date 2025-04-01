import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { adminOnly } from "@/src/lib/actions/userActions";

export default async function AdminPage() {
  await adminOnly();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/admin/zones">Zones</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
