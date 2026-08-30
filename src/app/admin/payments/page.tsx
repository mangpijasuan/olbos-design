"use client";

import { CreditCard } from "lucide-react";
import { useAdminPayments } from "@/hooks/use-admin";
import { titleCase } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  SUCCEEDED: "default",
  PENDING: "secondary",
  FAILED: "destructive",
  REFUNDED: "outline",
};

export default function AdminPaymentsPage() {
  const { data, isLoading } = useAdminPayments();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold">Payments</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border border-border/60">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : data && data.payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.event?.title ?? "—"}</TableCell>
                  <TableCell>
                    {(payment.amountCents / 100).toLocaleString("en-US", {
                      style: "currency",
                      currency: payment.currency.toUpperCase(),
                    })}
                  </TableCell>
                  <TableCell>{titleCase(payment.provider)}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[payment.status]}>
                      {titleCase(payment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CreditCard className="h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No payments recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
