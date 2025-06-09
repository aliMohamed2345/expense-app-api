export const validateExpense = (title, amount, isRecurring, category, currency, userId) => {

    const validCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];
    const validCurrencies = ['USD', 'JPY', "EUR", "GBP", "AUD", "CHF", "CNY", "INR", "RUB", "BRL", "KWD", "BHD", "OMR", "JOD", "EGP", "TRY", "KRW", "QAR", "SAR", "AED", "MAD", "DZD", "TND", "LYD", "SYP", "IRR", "AFN"];
    if (!title && !amount && !isRecurring && !category && !currency) return { isValid: false, message: "all fields are required , please input all fields" }

    //title
    if (!title) return { isValid: false, message: "the title is required , please input the title" }
    if (title.length < 3 || title.length > 100) return { isValid: false, message: "the title must be between 3 and 100 characters" }

    //amount
    if (!amount) return { isValid: false, message: "the amount is required , please input the amount" }
    if (amount < 0) return { isValid: false, message: "the amount must be greater than 0" }
    if (isNaN(amount) || amount == null) return { isValid: false, message: "the amount must be a number" }

    //isRecurring
    if (typeof isRecurring === 'undefined' || isRecurring === null) return { isValid: false, message: "the isRecurring is required , please input the isRecurring" }

    //category
    if (!category) return { isValid: false, message: "the category is required , please input the category" }
    if (!validCategories.includes(category)) return { isValid: false, message: `the category must be one of the following : ${validCategories.join(", ")}` }

    //currency
    if (!currency) return { isValid: false, message: "the currency is required , please input the currency" }
    if (currency.length !== 3) return { isValid: false, message: "the currency must be 3 characters" }
    if (currency.toUpperCase() !== currency) return { isValid: false, message: "the currency must be in uppercase" }
    if (!validCurrencies.includes(currency)) return { isValid: false, message: `the currency must be one of the following : ${validCurrencies.join(", ")}` }

    //userId
    if (!userId) return { isValid: false, message: "the userId is required , please input the userId" }
    return { isValid: true, message: '' }
}
export const validateExpenseQueryStr = (page, limit, currency, category, sort) => {
    const validSortOptions = ['asc', 'desc', 'ascending', 'descending', '1', '-1'];
    const validCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Other'];
    const validCurrencies = ["USD", "JPY", "EUR", "GBP", "AUD", "CHF", "CNY", "INR", "RUB", "BRL", "KWD", "BHD", "OMR", "JOD", "EGP", "TRY", "KRW", "QAR", "SAR", "AED", "MAD", "DZD", "TND", "LYD", "SYP", "IRR", "AFN"];
    //page
    if (page) {
        if (page < 0) return { isValid: false, message: "the page must be greater than or equal to 0" }
        if (isNaN(page)) return { isValid: false, message: "the page must be a number" }
    }

    //limit 
    if (limit) {
        if (limit < 1 || limit > 20) return { isValid: false, message: "the limit must be between 1 and 20 " }
        if (isNaN(limit)) return { isValid: false, message: "the limit must be a number" }
    }

    //sort 
    if (sort && !validSortOptions.includes(sort.toLowerCase())) {
        return { isValid: false, message: `the sort must be one of the following : ${validSortOptions.join(", ")}` }
    }

    //category 
    if (category && !validCategories.includes(category)) {
        return { isValid: false, message: `the category must be one of the following : ${validCategories.join(", ")}` }
    }

    //currency
    if (currency && !validCurrencies.includes(currency)) {
        return { isValid: false, message: `the currency must be one of the following : ${validCurrencies.join(", ")}` }
    }
    return { isValid: true, message: "" }
}
export const validateUsersQueryStr = (page, limit, sort, role) => {
    const validSortOptions = ['asc', 'desc', 'ascending', 'descending', '1', '-1'];
    const validRole = ['admin', 'user'];

    //page
    if (page) {
        if (page < 0) return { isValid: false, message: "the page must be greater than or equal to 0" }
        if (isNaN(page)) return { isValid: false, message: "the page must be a number" }
    }

    //limit 
    if (limit) {
        if (limit < 1 || limit > 20) return { isValid: false, message: "the limit must be between 1 and 20 " }
        if (isNaN(limit)) return { isValid: false, message: "the limit must be a number" }
    }

    //sort 
    if (sort && !validSortOptions.includes(sort.toLowerCase())) {
        return { isValid: false, message: `the sort must be one of the following : ${validSortOptions.join(", ")}` }
    }
    //role 
    if (role) {
        if (!validRole.includes(role)) return { isValid: false, message: `the role must be one of the following : ${validRole.join(", ")}` }
    }
    return { isValid: true, message: '' }
}