import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// --- Register Logic ---
const register = async (req, res) => {
    console.log("Body Data:", req.body);
    try {
        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profilePhoto = "";
        if (req.file) {
            // Build URL based on the backend host (works for any PORT)
            profilePhoto = `${req.protocol}://${req.get("host")}/uploads/profiles/${req.file.filename}`;
        } else {
            const boyProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
            const girlProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
            profilePhoto = gender === "male" ? boyProfilePhoto : girlProfilePhoto;
        }

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto,
            gender
        });

        return res.status(201).json({ message: "Account created successfully.", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// --- Login Logic ---
const login = async (req, res) => {
    console.log("Body Data:", req.body);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }

        const tokenData = { userId: user._id };
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment');
            return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing' });
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200)
            .cookie("token", token, { 
                maxAge: 1 * 24 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: 'lax',
                secure: true
            })
            .json({
                _id: user._id,
                username: user.username,
                fullName: user.fullName,
                profilePhoto: user.profilePhoto,
                message: `Welcome back ${user.fullName}`
            });
    } catch (error) {
        console.error('Login error:', error?.stack || error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const logout = (req, res) => {
    try {
        // Cookie ko clear karne ke liye hum response bhejte waqt maxAge: 0 set karte hain
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getOtherUsers = async (req, res) => {
    try {
        // 1. Logged-in user ki ID nikalna (Middleware se aayegi)
        const loggedInUserId = req.id; 

        // 2. Database mein dhoondna (Lekin khud ko exclude karna)
        // $ne ka matlab hai "Not Equal"
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        return res.status(200).json(otherUsers);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
// --- Exporting as an object ---
export default { register, login, logout, getOtherUsers };