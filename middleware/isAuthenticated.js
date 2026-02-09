import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "User Is Not Authenticated" });
        }

        // Token ko verify karein
        const decode = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ message: "Invalid Token" });
        }

        // Sabse important step: 
        // Token se mili userId ko 'req' object mein dalna taaki controllers isse use kar sakein
        req.id = decode.userId; 

        next(); // Agle function (controller) par jao
    } catch (error) {
        console.log("Auth Middleware Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default isAuthenticated;