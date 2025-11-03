import { Edit } from "lucide-react";
import Link from "next/link";

import { adminOnly } from "@/src/lib/actions/userActions";
import { getAreas } from "@/src/lib/actions/areaActions";
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

export default async function AreaPage() {
  await adminOnly();

  const areas = await getAreas();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>All Areas</CardTitle>
          <Button asChild>
            <Link href="/admin/areas/new">New Area</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Squallywood Page</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No areas found
                </TableCell>
              </TableRow>
            ) : (
              areas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell className="font-medium">
                    {area.squallywoodPage}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild>
                      <Link href={`/admin/areas/${area.id}`}>
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

