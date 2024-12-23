import bcrypt from "bcryptjs";
import userModel from "../models/userModels.js"
import jwt from 'jsonwebtoken'
import transporter from "../config/nodemailer.js";

// Register a new user
export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' })
    }
    try {
        const existingUser = await userModel.findOne({ email })  // in the mongo database checking if the user already exist 
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)  // hashing the password using bcrypt hash
        const user = new userModel({ name, email, password: hashedPassword })  // creating a new user 
        await user.save();  // user saved in database

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // The token is sent to the user as a cookie using res.cookie()
        res.cookie('token', token, {
            httpOnly: true, // ensures that the cookie can't be accessed by JavaScript (helps with preventing XSS attacks).
            secure: process.env.NODE_ENV === 'production',// secure ensures the cookie is sent over HTTPS if the environment is production.
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 100 // 7 days
        })
        console.log("successfully created user")
        // Welcome Mail
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome To Our Website",
            text: `Welcome to Our Website. Your account has been created with email id: ${email}`
        }
        await transporter.sendMail(mailOptions)
        return res.json({ success: true })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Login the User and Generate JWT Token and Cookie
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and Password are Required' })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // The token is sent to the user as a cookie using res.cookie()
        res.cookie('token', token, {
            httpOnly: true, // ensures that the cookie can't be accessed by JavaScript (helps with preventing XSS attacks).
            secure: process.env.NODE_ENV === 'production',// secure ensures the cookie is sent over HTTPS if the environment is production.
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 100 // 7 days
        })
        return res.json({ success: true })


    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

// Logout the User and Clear the Cookie
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true, // ensures that the cookie can't be accessed by JavaScript (helps with preventing XSS attacks).
            secure: process.env.NODE_ENV === 'production',// secure ensures the cookie is sent over HTTPS if the environment is production.
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logged Out' })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body
        const user = await userModel.findById(userId)
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000 // 1DAY
        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP`
        }
        await transporter.sendMail(mailOption)

        res.json({ success: true, message: 'Verification OTP send on Email' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Verify the User's Email using OTP
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body
    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' })
    }
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' })
        }
        user.isAccountVerified = true;
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0;
        await user.save()
        return res.json({ success: true, message: 'Email verified successfully' })
    } catch (err) {
        res.json({ success: false, message: error.message })
    }
}

// Check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Send Password rest Otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000
        await user.save();
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}. Reset your password using this OTP`
        }
        await transporter.sendMail(mailOption)
        return res.json({ success: true, message: 'OTP sent to your email' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'All fields are required' })
    }
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }
        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.restOtp = ''
        user.resetOtpExpireAt = 0
        await user.save()
        return res.json({ success: true, message: 'Password reset successfully' })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}