import { Transaction } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TransactionsTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
}

export const TransactionsTable = ({ 
  transactions, 
  onEdit, 
  onDelete,
  currentPage,
  onPageChange,
  itemsPerPage = 10 
}: TransactionsTableProps) => {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-12 text-center">
        <p className="text-muted-foreground">No transactions yet. Add your first transaction to get started!</p>
      </div>
    );
  }
 // Calculate pagination
 const totalPages = Math.ceil(transactions.length / itemsPerPage);
 const startIndex = (currentPage - 1) * itemsPerPage;
 const endIndex = startIndex + itemsPerPage;
 const currentTransactions = transactions.slice(startIndex, endIndex);

 // Generate page numbers to show
 const getPageNumbers = () => {
   const pages = [];
   const maxVisible = 5;
   
   if (totalPages <= maxVisible) {
     for (let i = 1; i <= totalPages; i++) {
       pages.push(i);
     }
   } else {
     if (currentPage <= 3) {
       pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
     } else if (currentPage >= totalPages - 2) {
       pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
     } else {
       pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
     }
   }
   
   return pages;
 };

 return (
   <div className="space-y-4">
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
           {currentTransactions.map((transaction) => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};
