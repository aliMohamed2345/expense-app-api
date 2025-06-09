import { validateExpense, validateExpenseQueryStr } from "../utils/validateExpense.js";
import XLSX from 'xlsx'
import path from 'path'
import Expense from "../Models/Expense.js";
import env from 'dotenv'

env.config()

export const getAllUserExpenses = async (req, res) => {
    try {

        //getting the userId and the query data from the request 
        const { id: userId } = req.user;
        let { page = 1, limit, sort = "desc", tags, currency, category } = req.query
        const validSortOptions = ['asc', 'desc', 'ascending', 'descending', '1', '-1'];

        //convert the page and limit from string to number 
        page = +page;
        limit = +limit;

        const sortOrder = validSortOptions.includes(sort.toLowerCase()) ? sort.toLowerCase() : "desc";

        //validation inputs 
        const { isValid, message } = validateExpenseQueryStr(page, limit, currency, category, sort)
        if (!isValid) {
            return res.status(400).json({ success: isValid, message })
        }
        const expensePerPage = limit ? +limit : 10

        //setting the filter object to filter the expenses based on the userId and other query parameters
        let filter = { userId };
        if (currency) filter.currency = currency
        if (category) filter.category = category
        if (tags) filter.tags = tags

        //return the expenses based on the filter and pagination
        const expenseResult = await Expense.find(filter)
            .skip((page - 1) * expensePerPage)
            .limit(expensePerPage)
            .sort({ createdAt: sortOrder === "asc" || sortOrder === "ascending" || sortOrder === "1" ? 1 : -1 }).select('-__v ');

        const totalAmountOfExpenses = expenseResult.reduce((total, expense) => expense.amount + total, 0);

        const numberOfExpenses = expenseResult.length

        const totalPages = Math.ceil(numberOfExpenses / expensePerPage);
        //handle if the page is greater than the total pages
        if (page > totalPages) return res.status(404).json({ success: false, message: "No expenses found for this page" })

        return res.status(200).json({
            numberOfExpenses,
            totalAmountOfExpenses,
            totalPages,
            currentPage: page,
            expenses: expenseResult,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }

}

export const CreateNewExpense = async (req, res) => {
    try {
        const { id: userId } = req.user
        const { title, amount, isRecurring, category, notes, currency, tags } = req.body;
        // Validate inputs
        const { isValid, message } = validateExpense(title, amount, isRecurring, category, currency, userId)
        if (!isValid) return res.status(400).json({ success: isValid, message })

        const expense = await Expense.create({ title, amount, isRecurring, category, notes, currency, tags, userId });
        return res.status(201).json({ success: true, message: "Expense created successfully", expense })

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }

}

export const getExpenseById = async (req, res) => {
    try {
        const { id: expenseId } = req.params;

        //if the user didn't pass the expenseId in the params
        if (!expenseId) return res.status(400).json({ success: false, message: "Expense ID is required" })

        const expense = await Expense.findById(expenseId).select("-__v")
        //check if the expense exists 
        if (!expense) return res.status(404).json({ success: false, message: "Expense not found" })

        return res.status(200).json({ success: true, message: "Expense retrieved successfully", expense })

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const updateExpenseById = async (req, res) => {
    try {
        const { id: expenseId } = req.params;
        if (!expense) return res.status(404).json({ success: false, message: "Expense not found" })

        const { id: userId } = req.user;
        const { title, amount, isRecurring, category, notes, currency, tags } = req.body;
        //Validate inputs 
        const { isValid, message } = validateExpense(title, amount, isRecurring, category, currency, userId);
        if (!isValid) return res.status(400).json({ success: isValid, message })

        //checking if he current expense is exist 
        const currentExpense = Expense.findById(expenseId);
        if (!currentExpense) return res.status(404).json({ success: false, message: "Expense not found" })

        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, { title, amount, isRecurring, category, notes, currency, tags, userId }, { new: true });

        res.status(200).json({ success: true, message: "Expense updated successfully", expense: updatedExpense })
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }


}

export const deleteExpenseById = async (req, res) => {
    try {
        const { id: expenseId } = req.params;
        //if the user didn't pass the expenseId in the params
        if (!expenseId) return res.status(400).json({ success: false, message: "Expense ID is required" })

        const deletedExpense = await Expense.findByIdAndDelete(expenseId);
        //check if the expense exists 
        if (!deletedExpense) return res.status(404).json({ success: false, message: "Expense not found" })

        return res.status(200).json({ success: true, message: "Expense deleted successfully", deletedExpense })

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }

}

export const getRecurringExpenses = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const recurringExpenses = await Expense.find({ userId, isRecurring: true })
        const totalRecurringExpenses = recurringExpenses.reduce((total, expense) => total + expense.amount, 0);
        console.log({ userId })
        return res.status(200).json({
            success: true,
            number: recurringExpenses.length,
            totalRecurringExpenses,
            recurringExpenses
        })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const downloadExpensesSheet = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const allUserExpenses = await Expense.find({ userId });
        const sheetData = allUserExpenses.map(expense => ({
            Title: expense.title,
            Amount: expense.amount,
            IsRecurring: expense.isRecurring,
            Category: expense.category,
            Notes: expense.notes,
            Currency: expense.currency,
            Tags: expense.tags.join(', '),
            CreatedAt: expense.createdAt.toISOString(),
        }))
        //create the table structure to the excel sheet
        XLSX.worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.worksheet, 'Expenses');

        // ✅ Save to /public/exports with a unique filename
        const filename = `expenses_${userId}_${Date.now()}.xlsx`;
        const filePath = path.join("public", "exports", filename);
        XLSX.writeFile(workbook, filePath);

        // ✅ Return a URL to the user
        const fileUrl = `${process.env.CLIENT_URL || `http://localhost:${process.env.PORT || 3000}`}/exports/${filename}`;

        return res.status(201).json({ success: true, message: 'Excel file generated successfully', fileUrl })
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }

}

export const searchExpenses = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { q } = req.query;
        if (!q) return res.status(400).json({ success: false, message: `the query parameter is require for searching` })

        const expensesResults = await Expense.find(
            {
                userId,
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { notes: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } },
                    { tags: { $regex: q, $options: 'i' } },
                ],
            }

        )
        if (expensesResults.length === 0) return res.status(404).json({ success: false, message: `your search term "${q}" doesn't exist in the expenses` })
        return res.status(200).json({ success: true, numberOfResults: expensesResults.length, results: expensesResults })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }


}
