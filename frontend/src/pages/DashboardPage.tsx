import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { transactionsApi } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/StatCard";
import { TransactionsTable } from "@/components/shared/TransactionsTable";
import { TransactionDialog } from "@/components/shared/TransactionDialog";
import { Charts } from "@/components/shared/Charts";
import { toast } from "@/hooks/use-toast";
import { Wallet, TrendingUp, TrendingDown, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const loadTransactions = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      const data = await transactionsApi.getAll(token);
      setTransactions(data);
    } catch (error) {
      toast({
        title: "Failed to load transactions",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token || !confirm("Are you sure you want to delete this transaction?")) return;

    try {
      await transactionsApi.delete(token, id);
      toast({ title: "Transaction deleted successfully" });
      loadTransactions();
    } catch (error) {
      toast({
        title: "Failed to delete transaction",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">FinAssist</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Balance"
            value={`$${balance.toFixed(2)}`}
            icon={Wallet}
            trend={balance >= 0 ? "Healthy balance" : "Needs attention"}
            variant={balance >= 0 ? "success" : "warning"}
          />
          <StatCard
            title="Total Income"
            value={`$${totalIncome.toFixed(2)}`}
            icon={TrendingUp}
            trend={`${transactions.filter((t) => t.type === "income").length} transactions`}
            variant="success"
          />
          <StatCard
            title="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            icon={TrendingDown}
            trend={`${transactions.filter((t) => t.type === "expense").length} transactions`}
          />
        </div>

        {/* Charts */}
        <div className="mb-8">
          <Charts transactions={transactions} />
        </div>

        {/* Transactions Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Transactions</h2>
            <Button onClick={() => setDialogOpen(true)} className="gap-2 gradient-primary">
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <TransactionsTable
              transactions={transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* Transaction Dialog */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        transaction={editingTransaction}
        onSuccess={loadTransactions}
      />
    </div>
  );
};

export default DashboardPage;
