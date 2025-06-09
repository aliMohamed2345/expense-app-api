import { validateIncome, validateIncomeQueryStr } from "../utils/validateIncome.js";
import Income from "../Models/Income.js";
import env from 'dotenv'
import Expense from "../Models/Expense.js";
import XLSX from 'xlsx'
import path from 'path'
env.config()

export const getAllUserIncomes = async (req, res) => {
    try {

        //getting the userId and the query data from the request 
        const { id: userId } = req.user;
        let { page = 1, limit, sort = "desc", tags, currency, source } = req.query
        const validSortOptions = ['asc', 'desc', 'ascending', 'descending', '1', '-1'];

        //convert the page and limit from string to number 
        page = +page;
        limit = +limit;

        const sortOrder = validSortOptions.includes(sort.toLowerCase()) ? sort.toLowerCase() : "desc";

        //validation inputs 
        const { isValid, message } = validateIncomeQueryStr(page, limit, currency, source, sort)
        if (!isValid) {
            return res.status(400).json({ success: isValid, message })
        }
        const incomePerPage = limit ? +limit : 10

        //setting the filter object to filter the incomes based on the userId and other query parameters
        let filter = { userId };
        if (currency) filter.currency = currency
        if (source) filter.source = source
        if (tags) filter.tags = tags

        //return the incomes based on the filter and pagination
        const incomeResult = await Income.find(filter)
            .skip((page - 1) * incomePerPage)
            .limit(incomePerPage)
            .sort({ createdAt: sortOrder === "asc" || sortOrder === "ascending" || sortOrder === "1" ? 1 : -1 }).select('-__v ');

        const totalAmountOfIncomes = incomeResult.reduce((total, income) => income.amount + total, 0);

        const numberOfIncomes = await Income.countDocuments(filter)

        const totalPages = Math.ceil(numberOfIncomes / incomePerPage);
        //handle if the page is greater than the total pages
        if (page > totalPages) return res.status(404).json({ success: false, message: "No incomes found for this page" })

        return res.status(200).json({
            numberOfIncomes,
            totalAmountOfIncomes,
            totalPages,
            currentPage: page,
            incomes: incomeResult,
        })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const CreateNewIncome = async (req, res) => {
    try {
        const { id: userId } = req.user
        const { title, amount, isRecurring, source, notes, currency, tags } = req.body;
        // Validate inputs
        const { isValid, message } = validateIncome(title, amount, isRecurring, source, currency, userId)
        if (!isValid) return res.status(400).json({ success: isValid, message })

        const income = await Income.create({ title, amount, isRecurring, source, notes, currency, tags, userId });
        return res.status(201).json({ success: true, message: "Income created successfully", income })

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const getIncomeById = async (req, res) => {
    try {
        const { id: incomeId } = req.params;

        //if the user didn't pass the incomeId in the params
        if (!incomeId) return res.status(400).json({ success: false, message: "Income ID is required" })

        const income = await Income.findById(incomeId).select("-__v")
        //check if the income exists 
        if (!income) return res.status(404).json({ success: false, message: "Income not found" })

        return res.status(200).json({ success: true, message: "Income retrieved successfully", income })

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const updateIncomeById = async (req, res) => {
    try {
        const { id: incomeId } = req.params;
        if (!incomeId) return res.status(404).json({ success: false, message: "Income not found" })

        const { id: userId } = req.user;
        const { title, amount, isRecurring, source, notes, currency, tags } = req.body;

        //Validate inputs 
        const { isValid, message } = validateIncome(title, amount, isRecurring, source, currency, userId);
        if (!isValid) return res.status(400).json({ success: isValid, message })

        //checking if he current income is exist 
        const currentIncome = Income.findById(incomeId);
        if (!currentIncome) return res.status(404).json({ success: false, message: "Income not found" })

        const updatedIncome = await Income.findByIdAndUpdate(incomeId, { title, amount, isRecurring, source, notes, currency, tags, userId }, { new: true });

        res.status(200).json({ success: true, message: "Income updated successfully", income: updatedIncome })
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
}

export const deleteIncomeById = async (req, res) => {
    try {
        const { id: incomeId } = req.params;
        //if the user didn't pass the incomeId in the params
        if (!incomeId) return res.status(400).json({ success: false, message: "Income ID is required" })

        const deletedIncome = await Income.findByIdAndDelete(incomeId);
        //check if the income exists 
        if (!deletedIncome) return res.status(404).json({ success: false, message: "Income not found" })

        return res.status(200).json({ success: true, message: "Income deleted successfully", deletedIncome })

    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const getRecurringIncomes = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const recurringIncomes = await Income.find({ userId, isRecurring: true })
        const totalRecurringIncomes = recurringIncomes.reduce((total, income) => total + income.amount, 0);

        return res.status(200).json({
            success: true,
            number: recurringIncomes.length,
            totalRecurringIncomes,
            recurringIncomes
        })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const downloadIncomesSheet = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const allUserIncomes = await Income.find({ userId });
        const sheetData = allUserIncomes.map(income => ({
            Title: income.title,
            Amount: income.amount,
            IsRecurring: income.isRecurring,
            Source: income.source,
            Notes: income.notes,
            Currency: income.currency,
            Tags: income.tags.join(', '),
            CreatedAt: income.createdAt.toISOString(),
        }))
        //create the table structure to the excel sheet
        XLSX.worksheet = XLSX.utils.json_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.worksheet, 'Incomes');

        // ✅ Save to /public/exports with a unique filename
        const filename = `incomes_${userId}_${Date.now()}.xlsx`;
        const filePath = path.join("public", "exports", filename);
        XLSX.writeFile(workbook, filePath);

        // ✅ Return a URL to the user
        const fileUrl = `${process.env.NODE_ENV === 'production' ? process.env.API_URL : `http://localhost:${process.env.PORT || 3000}`
            }/exports/${filename}`;

        return res.status(201).json({ success: true, message: 'Excel file generated successfully', fileUrl })
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` });
    }
}

export const searchIncomes = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { q } = req.query;
        if (!q) return res.status(400).json({ success: false, message: `the query parameter is require for searching` })

        const incomesResults = await Income.find(
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
        if (incomesResults.length === 0) return res.status(404).json({ success: false, message: `your search term "${q}" doesn't exist in the incomes` })
        return res.status(200).json({ success: true, numberOfResults: incomesResults.length, results: incomesResults })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const getUserBalance = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const userIncomes = await Income.find({ userId });
        const userExpenses = await Expense.find({ userId })

        //get the total expenses and total incomes 
        const totalAmountOfExpenses = +(userExpenses.reduce((sum, expense) => expense.amount + sum, 0)).toFixed(2)
        const totalAmountOfIncomes = +(userIncomes.reduce((sum, income) => income.amount + sum, 0)).toFixed(2);

        //calculate the total balance by this equation (total expense - total income)
        const totalBalance = +(totalAmountOfIncomes - totalAmountOfExpenses).toFixed(2);

        //handle the message that will come in the response 
        const message =
            totalBalance < 0
                ? `⚠️ Your balance is ${totalBalance} ${userIncomes[0].currency || 'USD'}. We recommend increasing your income or reducing your expenses.`
                : `✅ Your current balance is ${totalBalance} ${userIncomes[0].currency || 'USD'}. Keep tracking your finances!`;

        if (totalBalance < 0) return res.status(200).json({
            success: true,
            message,
            income: +totalAmountOfIncomes,
            expense: +totalAmountOfExpenses
        })

        return res.status(200).json({
            success: true,
            message,

            income: +totalAmountOfIncomes,
            expense: +totalAmountOfExpenses,
            balance: totalBalance
        })
    } catch (error) {
        res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}