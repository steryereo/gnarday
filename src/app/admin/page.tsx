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
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/admin/zones">Zones</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/areas">Areas</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
