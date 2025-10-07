import { useEffect, useState } from 'react';
import { Layout } from '@/components/shared/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransactions } from '@/lib/api';
import type { Transaction } from '@/lib/types';

export function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getTransactions();
        setTransactions(response.data.data);
      } catch (err) {
        setError('Failed to fetch transactions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <ul className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <li key={tx._id} className="flex justify-between items-center p-3 bg-white rounded-md shadow-sm">
                      <div>
                        <p className="font-semibold">{tx.category}</p>
                        <p className="text-sm text-gray-500">{tx.description}</p>
                      </div>
                      <div className={`font-bold ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount}
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No transactions found.</p>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}