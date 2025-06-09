
import express from 'express';
import {
    getAllUserExpenses,
    CreateNewExpense,
    deleteExpenseById,
    downloadExpensesSheet,
    getExpenseById,
    getRecurringExpenses,
    updateExpenseById,
    searchExpenses
} from '../Controllers/expense.controller.js'
import { verifyToken } from '../Middlewares/verifyToken.js';
const router = express.Router();

router.route('/').get(verifyToken, getAllUserExpenses).post(verifyToken, CreateNewExpense)

router.get('/recurring', verifyToken, getRecurringExpenses)

router.get('/download', verifyToken, downloadExpensesSheet);

router.get('/search', verifyToken, searchExpenses)

router.route('/:id').get(verifyToken, getExpenseById).put(verifyToken, updateExpenseById).delete(verifyToken, deleteExpenseById);

export default router; 
