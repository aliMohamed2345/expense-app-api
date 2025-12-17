export const checkApiKey = (req, res, next) => {
    const { key } = req.query
    if (!key) return res.status(401).json({ success: false, message: "API key is required" })
    if (key !== process.env.API_KEY) return res.status(401).json({ success: false, message: "Invalid API key" })
    next()
}