import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Transaction } from "@/lib/types";
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { transactionsApi } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSuccess: () => void;
}

const CATEGORIES = {
  expense: ["Groceries", "Food", "Transport", "Shopping", "Bills", "Entertainment", "Healthcare", "Other"],
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
};

export const TransactionDialog = ({ open, onOpenChange, transaction, onSuccess }: TransactionDialogProps) => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isScanningReceipt, setIsScanningReceipt] = useState(false);
  const [formData, setFormData] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        date: new Date(transaction.date).toISOString().split("T")[0],
      });
    } else {
      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [transaction, open]);

  const handleReceiptScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setIsScanningReceipt(true);
    try {
      const scannedData = await transactionsApi.scanReceipt(token, file);
      setFormData({
        type: "expense",
        amount: scannedData.amount.toString(),
        category: scannedData.category,
        description: scannedData.description,
        date: new Date(scannedData.date).toISOString().split("T")[0],
      });
      toast({
        title: "Receipt scanned!",
        description: "Transaction details auto-filled from receipt",
      });
    } catch (error) {
      toast({
        title: "Failed to scan receipt",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsScanningReceipt(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setIsLoading(true);
    try {
      const data = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      };

      if (transaction) {
        await transactionsApi.update(token, transaction._id, data);
        toast({ title: "Transaction updated successfully" });
      } else {
        await transactionsApi.create(token, data);
        toast({ title: "Transaction created successfully" });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: transaction ? "Failed to update transaction" : "Failed to create transaction",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {transaction ? "Update the transaction details" : "Create a new income or expense entry"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!transaction && (
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-4">
              <Label htmlFor="receipt-upload" className="flex cursor-pointer flex-col items-center gap-2 text-sm">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="font-medium">Scan Receipt (Optional)</span>
                <span className="text-xs text-muted-foreground">Upload a receipt to auto-fill details</span>
              </Label>
              <Input
                id="receipt-upload"
                type="file"
                accept="image/*"
                onChange={handleReceiptScan}
                disabled={isScanningReceipt}
                className="hidden"
              />
              {isScanningReceipt && <p className="mt-2 text-center text-sm text-muted-foreground">Scanning receipt...</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value: "income" | "expense") => setFormData({ ...formData, type: value, category: "" })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES[formData.type].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a note..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : transaction ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};