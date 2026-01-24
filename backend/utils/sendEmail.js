import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationOTP = async (email, otp, fullname) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'CareerHub <onboarding@resend.dev>', // Use your verified domain in production
            to: email,
            subject: 'Verify Your Email - CareerHub',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px dashed #667eea; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center; }
                        .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #667eea; font-family: 'Courier New', monospace; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; border-radius: 4px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                        .highlight { color: #667eea; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Welcome to CareerHub!</h1>
                        </div>
                        <div class="content">
                            <h2>Hi ${fullname},</h2>
                            <p>Thank you for registering with CareerHub! We're excited to have you on board.</p>
                            <p>Please verify your email address using the OTP code below:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Your Verification Code</p>
                                <div class="otp-code">${otp}</div>
                                <p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Valid for 10 minutes</p>
                            </div>

                            <p>Enter this code on the verification page to complete your registration.</p>
                            
                            <div class="warning">
                                <strong>⚠️ Security Note:</strong> Never share this OTP with anyone. CareerHub will never ask for your OTP via phone or email.
                            </div>

                            <p>If you didn't create an account with CareerHub, please ignore this email.</p>
                            
                            <p style="margin-top: 30px; color: #666; font-size: 14px;">
                                Need help? Contact us at <a href="mailto:support@careerhub.com" style="color: #667eea;">support@careerhub.com</a>
                            </p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} CareerHub. All rights reserved.</p>
                            <p style="margin-top: 10px;">
                                <a href="${process.env.FRONTEND_URL}" style="color: #667eea; text-decoration: none;">Visit Website</a> | 
                                <a href="#" style="color: #667eea; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #667eea; text-decoration: none;">Terms of Service</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Error sending verification email:', error);
            return false;
        }

        console.log('Verification email sent successfully to:', email);
        console.log('Email ID:', data?.id);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

export const sendWelcomeEmail = async (email, fullname) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'CareerHub <onboarding@resend.dev>', // Use your verified domain in production
            to: email,
            subject: 'Welcome to CareerHub!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🎉 Welcome to CareerHub!</h1>
                        </div>
                        <div class="content">
                            <h2>Hi ${fullname},</h2>
                            <p>Your email has been verified successfully! You're all set to start your journey with CareerHub.</p>
                            <p>Here's what you can do next:</p>
                            <ul>
                                <li>Complete your profile</li>
                                <li>Browse thousands of job opportunities</li>
                                <li>Apply to your dream jobs</li>
                                <li>Connect with top employers</li>
                            </ul>
                            <center>
                                <a href="${process.env.FRONTEND_URL}" class="button">Start Exploring Jobs</a>
                            </center>
                            <p>If you have any questions, feel free to reach out to our support team.</p>
                            <p>Best regards,<br/>The CareerHub Team</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} CareerHub. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });

        if (error) {
            console.error('Error sending welcome email:', error);
            return false;
        }

        console.log('Welcome email sent successfully to:', email);
        console.log('Email ID:', data?.id);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
};
