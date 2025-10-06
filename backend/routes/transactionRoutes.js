import express from 'express';
import { createTransaction, getTransactions, scanReceipt, updateTransaction, deleteTransaction,} from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Routes for getting all and creating new transactions
router.route('/')
    .post(protect, createTransaction)
    .get(protect, getTransactions);

// Routes for updating and deleting a specific transaction by its ID
router.route('/:id')
    .patch(protect, updateTransaction) 
    .delete(protect, deleteTransaction); 

// Route for scanning a receipt
router.post('/scan-receipt', protect, upload.single('receipt'), scanReceipt);

export default router;