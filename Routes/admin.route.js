import express from 'express'
import { verifyToken } from '../Middlewares/verifyToken.js';
import { checkIsAdmin } from '../Middlewares/checkIsAdmin.js';
import { getAllUsers, deleteUserById, getAdminStats, getUserById, updateUserById, toggleUserRole, searchUsers } from '../Controllers/admin.controller.js';
const router = express.Router();


router.get('/users', verifyToken, checkIsAdmin, getAllUsers);

router.get('/stats', verifyToken, checkIsAdmin, getAdminStats);

router.get('/users/search', verifyToken, checkIsAdmin, searchUsers)

router.route('/users/:id')
    .delete(verifyToken, checkIsAdmin, deleteUserById)
    .get(verifyToken, checkIsAdmin, getUserById)
    .put(verifyToken, checkIsAdmin, updateUserById);

router.put('/users/:id/role', verifyToken, checkIsAdmin, toggleUserRole);

export default router;