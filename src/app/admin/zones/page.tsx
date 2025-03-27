import { Edit } from "lucide-react";
import Link from "next/link";

import { adminOnly } from "@/src/lib/actions/userActions";
import { getZones } from "@/src/lib/actions/zoneActions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";

export default async function ZonePage() {
  await adminOnly();

  const zones = await getZones();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>All Zones</CardTitle>
          <Button asChild>
            <Link href="/admin/zones/new">New Zone</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {zones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No zones found
                </TableCell>
              </TableRow>
            ) : (
              zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell className="font-medium">{zone.name}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild>
                      <Link href={`/admin/zones/${zone.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
