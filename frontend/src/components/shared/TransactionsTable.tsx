import { Transaction } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export const TransactionsTable = ({ transactions, onEdit, onDelete }: TransactionsTableProps) => {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              <TableCell className="font-medium">
                {format(new Date(transaction.date), "MMM dd, yyyy")}
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <Badge variant="outline">{transaction.category}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {transaction.type === "income" ? (
                    <TrendingUp className="h-4 w-4 text-success" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                  <span className={transaction.type === "income" ? "text-success" : "text-destructive"}>
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right font-semibold">
                <span className={transaction.type === "income" ? "text-success" : "text-destructive"}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(transaction)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(transaction._id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};