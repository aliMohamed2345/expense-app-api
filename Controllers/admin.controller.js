import User from "../Models/User.js"
import Expense from "../Models/Expense.js";
import { validateUpdateData } from "../utils/validateUserCredentials.js"
import { validateUsersQueryStr } from "../utils/validateExpense.js";

export const getAllUsers = async (req, res) => {
    try {
        const validSortOptions = ['asc', 'desc', 'ascending', 'descending', '1', '-1'];
        let { page = 1, limit, role, sort = 'desc' } = req.query;

        const { isValid, message } = validateUsersQueryStr(page, limit, sort, role);
        if (!isValid) return res.status(400).json({ success: isValid, message })

        const userPerPage = +limit ? +limit : 10;
        const sortOrder = validSortOptions.includes(sort.toLowerCase()) ? sort.toLowerCase() : "desc";

        const usersList = await User.find({ isAdmin: role === 'admin' })
            .skip((page - 1) * userPerPage)
            .limit(userPerPage)
            .select('-password -__v')
            .sort({ createdAt: sortOrder === "asc" || sortOrder === "ascending" || sortOrder === "1" ? 1 : -1 })
        const totalPages = Math.ceil(usersList.length / userPerPage);


        if (usersList.length === 0) return res.status(404).json({ success: false, message: "No users found" })

        if (page > totalPages) return res.status(404).json({ success: false, message: "No users found for this page" })

        return res.status(200).json({ success: true, message: "Users fetched successfully", totalPages, page: +page, numberOfUsers: usersList.length, users: usersList })

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        //check whether the id params exist or not  
        if (!id) return res.status(400).json({ success: false, message: `User ID is required` })

        const user = await User.findById(id).select('-password -__v')
        //check if the user exists 
        if (!user) return res.status(404).json({ success: false, message: "User not found" })

        return res.status(200).json({ success: true, message: "User retrieved successfully", user, });

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const deleteUserById = async (req, res) => {

    try {
        const { id } = req.params;
        //check whether the id params exist or not  
        if (!id) return res.status(400).json({ success: false, message: `User ID is required` })

        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" })
        return res.status(200).json({ success: true, message: `The user deleted successfully` })
    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }

}

export const updateUserById = async (req, res) => {
    try {

        const { id } = req.params;
        const { username, email } = req.body

        //validate the credentials
        const { isValid, message } = validateUpdateData(username, email)
        if (!isValid) return res.status(400).json({ success: isValid, message })

        //check whether the id params exist or not  
        if (!id) return res.status(400).json({ success: false, message: `User ID is required` })

        //update the user
        let updatedUser = await User.findByIdAndUpdate(id, { username, email }, { new: true })
        //check if the user exist or not
        if (!updatedUser) return res.status(404).json({ success: false, message: `The User don't exist ` })

        return res.status(200).json({ success: true, message: `User updated successfully`, user: updatedUser })

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalAdmins = await User.countDocuments({ isAdmin: true });

        const totalExpenses = await Expense.countDocuments();
        const allExpenses = await Expense.find({}, 'amount category');
        const totalAmountSpent = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

        // Calculate most used categories
        const categoryBreakdown = {};
        for (const exp of allExpenses) {
            categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + 1;
        }

        res.status(200).json({
            totalUsers,
            totalAdmins,
            totalExpenses,
            totalAmountSpent,
            mostUsedCategories: categoryBreakdown,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`,
        });
    }
};

export const toggleUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        //check whether the id params exist or not  
        if (!id) return res.status(400).json({ success: false, message: `User ID is required` })
        //check if the user exist or not
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: `The User don't exist ` })

        //update the user
        user.isAdmin = !user.isAdmin
        await user.save()

        return res.status(200).json({ success: true, message: `User updated successfully`, user })

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}

export const searchUsers = async (req, res) => {
    try {
        const { role, q } = req.query;

        //check if the role query string is belong to admin or user and if not return error
        if (role) {
            const validRoles = ['admin', 'user'];
            if (!validRoles.includes(role)) return res.status(400).json({ success: false, message: `the role must be one of the following ${validRoles.join(', ')}` })
        }
        const filter = {
            $or: [
                { email: { $regex: q, $options: 'i' } },
                { username: { $regex: q, $options: 'i' } },
            ],
        }
        if (role) filter.isAdmin = role === 'admin'

        //return the error if the query string q isn't exist 

        if (!q) return res.status(400).json({ success: false, message: `the query parameter is require for searching` })

        //return the searched users , it will check weather the query match the user name or the email and then return the relevant results 
        const searchedUsers = await User.find(filter).select('-password -__v');

        //handling if there's no results  
        if (searchedUsers.length === 0) return res.status(404).json({ success: false, message: `your search term ${q} doesn't exist in the users` })

        return res.status(200).json({ success: true, numberOfUsers: searchedUsers.length, users: searchedUsers })

    } catch (error) {
        return res.status(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}