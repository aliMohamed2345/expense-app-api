const checkIsAdmin = (req, res, next) => {
    try {
        if (req.user && req?.user?.isAdmin) {
            return next()// User is an admin, proceed to the next middleware or route handler
        }
        return res.status(403).json({ success: false, message: "Access denied. Admins only." }) // User is not an admin, deny access

    } catch (error) {
        return res.json(500).json({ success: false, message: `Internal server error: ${error.message}` })
    }
}