import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Public Route - Redirects authenticated AND verified users away from login/signup
const PublicRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // If user is not verified, redirect to OTP verification
            if (!user.isVerified) {
                navigate("/verify-otp");
            } else {
                // If verified, redirect based on role
                if (user.role === 'recruiter') {
                    navigate("/admin/companies");
                } else {
                    navigate("/");
                }
            }
        }
    }, [user, navigate]);

    // If user is authenticated, don't show the page
    if (user) {
        return null;
    }

    return <>{children}</>;
};

export default PublicRoute;
