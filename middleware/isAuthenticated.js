import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in cookies first, then Authorization header
        let token = req.cookies.token;
        
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7); // Remove 'Bearer ' prefix
            }
        }

        if (!token) {
            return res.status(401).json({ message: "User Is Not Authenticated" });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment');
            return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing' });
        }

        // Token ko verify karein
        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        // Token se mili userId ko 'req' object mein dalna taaki controllers isse use kar sakein
        req.id = decode.userId; 

        next(); // Agle function (controller) par jao
    } catch (error) {
        console.error('Auth Middleware Error:', error?.stack || error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default isAuthenticated;