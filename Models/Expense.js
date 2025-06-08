import mongoose from 'mongoose';
const ExpenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: [true, 'Expense title must be unique'],
        trim: true,
        minLength: [3, 'Expense title must be at least 3 characters long'],
        maxLength: [100, 'Expense title must be less than 100 characters']
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    notes: { type: String, maxLength: [500, 'Notes cannot exceed 500 characters'] },
    isRecurring: {
        type: Boolean,
        default: false,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'],
        default: 'Other'
    },
    tags: {
        type: [String],
        default: []
    },
    currency: {
        type: String,
        required: true,
        default: 'USD',
        enum: ['USD', 'JPY', "EUR", "GBP", "AUD", "CHF", "CNY", "INR", "RUB", "BRL", "KWD", "BHD", "OMR", "JOD", "EGP", "TRY", "KRW", "QAR", "SAR", "AED", "MAD", "DZD", "TND", "LYD", "SYP", "IRR", "AFN"]
    }, // Default currency is USD
    userId: {
        required: [true, "the user id is required"],
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })


const Expense = mongoose.model("Expense", ExpenseSchema)
export default Expense;