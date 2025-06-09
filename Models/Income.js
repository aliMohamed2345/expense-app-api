import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
        },
        amount: {
            type: Number,
            required: true,
            min: [0, "Amount must be a positive number"],
        },
        source: {
            type: String,
            enum: ["Salary", "Business", "Investments", "Freelance", "Other"],
            required: true,
            default: `Salary`
        },
        notes: {
            type: String,
            trim: true,
        },
        currency: {
            type: String,
            required: true,
            default: 'USD',
            enum: ['USD', 'JPY', "EUR", "GBP", "AUD", "CHF", "CNY", "INR", "RUB", "BRL", "KWD", "BHD", "OMR", "JOD", "EGP", "TRY", "KRW", "QAR", "SAR", "AED", "MAD", "DZD", "TND", "LYD", "SYP", "IRR", "AFN"]

        },
        isRecurring: {
            type: Boolean,
            default: false,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    { timestamps: true }
);

const Income = mongoose.model("Income", incomeSchema);
export default Income;
