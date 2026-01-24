import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { sendVerificationOTP, sendWelcomeEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
    try {
        let { fullname, email, phoneNumber, password, role } = req.body;
        
        // Normalize email
        email = email?.trim().toLowerCase();
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };

                // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile photo upload (optional)
        let profilePhotoUrl = "";
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

                                        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        console.log('\n=== Registration OTP Debug ===');
        console.log('Generated OTP:', otp);
        console.log('OTP Type:', typeof otp);
        console.log('OTP Expiry:', new Date(otpExpiry));
        console.log('Email:', email);

        // Create new user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            verificationOTP: otp,
            verificationOTPExpiry: otpExpiry,
            isVerified: false,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        console.log('Saved OTP in DB:', newUser.verificationOTP);
        console.log('Saved OTP Type:', typeof newUser.verificationOTP);
        console.log('\n🔐 FINAL OTP (sending to email):', newUser.verificationOTP);
        console.log('📧 Email:', email);
        console.log('================================\n');

        // Send OTP email using the OTP from database to ensure consistency
        sendVerificationOTP(email, newUser.verificationOTP, fullname).catch(err => 
            console.error('Failed to send OTP email:', err)
        );

        // Generate token for auto-login after signup
        const tokenData = {
            userId: newUser._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

                // Prepare user data to send (exclude password)
        const user = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            phoneNumber: newUser.phoneNumber,
            role: newUser.role,
            isVerified: newUser.isVerified,
            profile: newUser.profile
        }

                return res.status(201)
            .cookie("token", token, { 
                maxAge: 1 * 24 * 60 * 60 * 1000, 
                httpOnly: true, 
                sameSite: 'strict' 
            })
            .json({
                message: "Account created successfully. Please verify your email with the OTP sent to your inbox.",
                user,
                success: true,
                requiresVerification: true
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error during registration",
            success: false
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
                const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            isVerified: user.isVerified,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const verifyOTP = async (req, res) => {
    try {
        let { email, otp } = req.body;

        // Trim whitespace and ensure string format
        email = email?.trim().toLowerCase();
        otp = String(otp).trim();

        console.log('\n=== OTP Verification Debug ===');
        console.log('Received email:', email);
        console.log('Received OTP:', otp);
        console.log('OTP type:', typeof otp);
        console.log('OTP length:', otp.length);

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required",
                success: false
            });
        }

        // First find the user
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('❌ User not found with email:', email);
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }

        console.log('✅ User found:', user.email);
        console.log('Stored OTP:', user.verificationOTP);
        console.log('Stored OTP type:', typeof user.verificationOTP);
        console.log('Stored OTP length:', user.verificationOTP?.length);
        console.log('OTP Expiry:', new Date(user.verificationOTPExpiry));
        console.log('Current Time:', new Date());
        console.log('Time remaining:', (user.verificationOTPExpiry - Date.now())/1000, 'seconds');
        console.log('\nComparison:');
        console.log('  Received:', `"${otp}"`);
        console.log('  Stored:', `"${user.verificationOTP}"`);
        console.log('  Match (===):', user.verificationOTP === otp);
        console.log('  Match (==):', user.verificationOTP == otp);
        console.log('  Expired:', user.verificationOTPExpiry < Date.now());
        console.log('================================\n');

        // Check if OTP exists
        if (!user.verificationOTP) {
            return res.status(400).json({
                message: "No OTP found. Please request a new one.",
                success: false
            });
        }

        // Check expiry first
        if (user.verificationOTPExpiry < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new one.",
                success: false
            });
        }

        // Check OTP match (convert both to strings and trim)
        const storedOTP = String(user.verificationOTP).trim();
        const receivedOTP = String(otp).trim();
        
        if (storedOTP !== receivedOTP) {
            console.log('❌ OTP Mismatch!');
            console.log('Expected:', storedOTP);
            console.log('Received:', receivedOTP);
            return res.status(400).json({
                message: "Invalid OTP. Please check and try again.",
                success: false
            });
        }

                console.log('✅ OTP Verified Successfully!');

        user.isVerified = true;
        user.verificationOTP = undefined;
        user.verificationOTPExpiry = undefined;
        await user.save();

        // Send welcome email
        sendWelcomeEmail(user.email, user.fullname).catch(err => 
            console.error('Failed to send welcome email:', err)
        );

        return res.status(200).json({
            message: "Email verified successfully!",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error during email verification",
            success: false
        });
    }
}

export const resendOTP = async (req, res) => {
    try {
        let { email } = req.body;
        email = email?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                success: false
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified",
                success: false
            });
        }

                // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        console.log('\n=== Resend OTP Debug ===');
        console.log('Generated new OTP:', otp);
        console.log('Email:', email);

        user.verificationOTP = otp;
        user.verificationOTPExpiry = otpExpiry;
        await user.save();

        console.log('Saved OTP in DB:', user.verificationOTP);
        console.log('\n🔐 FINAL OTP (sending to email):', user.verificationOTP);
        console.log('================================\n');

        // Send OTP email using saved OTP
        await sendVerificationOTP(email, user.verificationOTP, user.fullname);

                console.log('✅ OTP resent successfully to:', email);

        return res.status(200).json({
            message: "OTP sent successfully to your email",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error while resending OTP",
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        
        const file = req.file;
        let cloudResponse;
        
        // Only upload if file exists
        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }



        let skillsArray;
        if(skills){
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            })
        }
        // updating data
        if(fullname) user.fullname = fullname
        if(email) user.email = email
        if(phoneNumber)  user.phoneNumber = phoneNumber
        if(bio) user.profile.bio = bio
        if(skills) user.profile.skills = skillsArray
      
        // resume comes later here...
        if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message:"Profile updated successfully.",
            user,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}