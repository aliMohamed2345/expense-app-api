import jwt from 'jsonwebtoken'
export const verifyToken = (req, res, next) => {


    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the user information to the request object
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ success: false, message: `Token verification failed:${error.message}` });
    }
}