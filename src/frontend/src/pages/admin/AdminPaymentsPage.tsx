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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAllPaymentTransactions } from "@/hooks/useAdminQueries";
import { CreditCard, IndianRupee } from "lucide-react";
import { TransactionStatus } from "../../backend.d";
import type { PaymentTransaction } from "../../backend.d";

function formatNanoDate(ns: bigint): string {
  return new Date(Number(ns) / 1_000_000).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: bigint): string {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  switch (status) {
    case TransactionStatus.completed:
      return (
        <Badge className="bg-green-500/15 text-green-400 border-green-500/30 text-xs">
          Completed
        </Badge>
      );
    case TransactionStatus.pending:
      return (
        <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-xs">
          Pending
        </Badge>
      );
    case TransactionStatus.failed:
      return (
        <Badge className="bg-red-500/15 text-red-400 border-red-500/30 text-xs">
          Failed
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
          Unknown
        </Badge>
      );
  }
}

function MethodBadge({ method }: { method: string }) {
  const labels: Record<string, string> = {
    upi: "UPI",
    credit: "Credit Card",
    debit: "Debit Card",
    netbanking: "Net Banking",
    wallet: "Wallet",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md">
      <CreditCard size={11} className="text-slate-500" />
      {labels[method] ?? method}
    </span>
  );
}

function TransactionsTable({
  transactions,
  isLoading,
}: {
  transactions: PaymentTransaction[] | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2 p-4" data-ocid="payments.table.loading_state">
        {["sk1", "sk2", "sk3", "sk4", "sk5"].map((k) => (
          <Skeleton key={k} className="h-12 w-full bg-slate-800/50" />
        ))}
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center"
        data-ocid="payments.table.empty_state"
      >
        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-4">
          <IndianRupee size={24} className="text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No transactions found</p>
        <p className="text-slate-600 text-sm mt-1">
          Payment records will appear here after bookings are completed.
        </p>
      </div>
    );
  }

  return (
    <Table data-ocid="payments.table">
      <TableHeader>
        <TableRow className="border-slate-800 hover:bg-transparent">
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Transaction ID
          </TableHead>
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Razorpay Payment ID
          </TableHead>
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Method
          </TableHead>
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Amount
          </TableHead>
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Booking ID
          </TableHead>
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Status
          </TableHead>
          <TableHead className="text-slate-400 text-xs uppercase tracking-wider font-medium">
            Timestamp
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx, index) => {
          const razorpayId =
            (tx as PaymentTransaction & { razorpayPaymentId?: string })
              .razorpayPaymentId ?? null;
          return (
            <TableRow
              key={String(tx.id)}
              className="border-slate-800 hover:bg-slate-800/40 transition-colors"
              data-ocid={`payments.table.row.${index + 1}`}
            >
              <TableCell>
                <span className="font-mono text-xs text-slate-300 bg-slate-800 px-2 py-1 rounded">
                  {tx.transactionId.length > 16
                    ? `${tx.transactionId.slice(0, 16)}...`
                    : tx.transactionId}
                </span>
              </TableCell>
              <TableCell>
                {razorpayId ? (
                  <span className="font-mono text-xs text-blue-300 bg-blue-900/30 border border-blue-700/30 px-2 py-0.5 rounded">
                    {razorpayId.length > 18
                      ? `${razorpayId.slice(0, 18)}...`
                      : razorpayId}
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs">—</span>
                )}
              </TableCell>
              <TableCell>
                <MethodBadge method={tx.paymentMethod} />
              </TableCell>
              <TableCell>
                <span className="text-white font-semibold text-sm">
                  {formatAmount(tx.amount)}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-slate-400 font-mono text-xs">
                  #{String(tx.bookingId)}
                </span>
              </TableCell>
              <TableCell>
                <StatusBadge status={tx.status} />
              </TableCell>
              <TableCell>
                <span className="text-slate-400 text-xs">
                  {formatNanoDate(tx.timestamp)}
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default function AdminPaymentsPage() {
  const { data: transactions, isLoading } = useAllPaymentTransactions();

  const completed = transactions?.filter(
    (tx) => tx.status === TransactionStatus.completed,
  );
  const pending = transactions?.filter(
    (tx) => tx.status === TransactionStatus.pending,
  );
  const failed = transactions?.filter(
    (tx) => tx.status === TransactionStatus.failed,
  );

  const totalRevenue =
    completed?.reduce((sum, tx) => sum + Number(tx.amount), 0) ?? 0;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-white font-display font-bold text-2xl">
            Payments
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            All transaction records
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/60 px-4 py-2.5 rounded-xl border border-slate-700/50">
          <IndianRupee size={16} className="text-[oklch(0.75_0.15_45)]" />
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">
              Total Revenue
            </p>
            <p className="text-white font-bold text-lg leading-tight">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {completed?.length ?? 0}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">Completed</p>
        </div>
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">
            {pending?.length ?? 0}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">Pending</p>
        </div>
        <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 text-center">
          <p className="text-2xl font-bold text-red-400">
            {failed?.length ?? 0}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">Failed</p>
        </div>
      </div>

      {/* Transactions Table with Tabs */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <Tabs defaultValue="all" data-ocid="payments.filter.tab">
          <div className="px-4 pt-4 border-b border-slate-800">
            <TabsList className="bg-slate-800/60 border-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400 text-xs"
                data-ocid="payments.all.tab"
              >
                All ({transactions?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-slate-400 text-xs"
                data-ocid="payments.completed.tab"
              >
                Completed ({completed?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-slate-400 text-xs"
                data-ocid="payments.pending.tab"
              >
                Pending ({pending?.length ?? 0})
              </TabsTrigger>
              <TabsTrigger
                value="failed"
                className="data-[state=active]:bg-red-700 data-[state=active]:text-white text-slate-400 text-xs"
                data-ocid="payments.failed.tab"
              >
                Failed ({failed?.length ?? 0})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-0">
            <TransactionsTable
              transactions={transactions}
              isLoading={isLoading}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-0">
            <TransactionsTable transactions={completed} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <TransactionsTable transactions={pending} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="failed" className="mt-0">
            <TransactionsTable transactions={failed} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
