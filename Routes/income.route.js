import express from 'express'
import { verifyToken } from '../Middlewares/verifyToken.js';
import {
    getAllUserIncomes,
    CreateNewIncome,
    deleteIncomeById,
    downloadIncomesSheet,
    getIncomeById,
    getRecurringIncomes,
    getUserBalance,
    searchIncomes,
    updateIncomeById
} from '../Controllers/income.controller.js';

const router = express.Router();


router.route('/').get(verifyToken, getAllUserIncomes).post(verifyToken, CreateNewIncome)

router.get('/recurring', verifyToken, getRecurringIncomes)

router.get('/download', verifyToken, downloadIncomesSheet);

router.get('/balance', verifyToken, getUserBalance)

router.get('/search', verifyToken, searchIncomes)

router.route('/:id')
    .get(verifyToken, getIncomeById)
    .put(verifyToken, updateIncomeById)
    .delete(verifyToken, deleteIncomeById);

export default router; 