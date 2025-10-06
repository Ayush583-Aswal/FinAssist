import Transaction from '../models/transactionModel.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { scanReceiptWithGemini } from '../utils/gemini.js';

// Create a new transaction
export const createTransaction = async (req, res) => {
    const { type, amount, category, description, date } = req.body;
    try {
        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            amount,
            category,
            description,
            date,
        });
        res.status(201).json(new ApiResponse(201, transaction, 'Transaction created successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Get all transactions for the logged-in user
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id });
        res.status(200).json(new ApiResponse(200, transactions));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Scan a receipt and return data
export const scanReceipt = async (req, res) => {
    if (!req.file) {
        return res.status(400).json(new ApiResponse(400, null, 'No file uploaded'));
    }

    try {
        const receiptData = await scanReceiptWithGemini(req.file);
        res.status(200).json(new ApiResponse(200, receiptData));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json(new ApiResponse(404, null, 'Transaction not found'));
        }

        // Ensure the user owns the transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json(new ApiResponse(401, null, 'User not authorized'));
        }

        transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the modified document
            runValidators: true, // Run model validators on update
        });

        res.status(200).json(new ApiResponse(200, transaction, 'Transaction updated successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json(new ApiResponse(404, null, 'Transaction not found'));
        }

        // Ensure the user owns the transaction
        if (transaction.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json(new ApiResponse(401, null, 'User not authorized'));
        }

        await transaction.deleteOne();

        res.status(200).json(new ApiResponse(200, null, 'Transaction deleted successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, error.message));
    }
};