import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Component to ensure user is verified before accessing certain routes
const VerificationRequired = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            // Not logged in - redirect to login
            toast.error("Please login to continue");
            navigate("/login");
        } else if (!user.isVerified) {
            // Logged in but not verified - redirect to OTP verification
            toast.error("Please verify your email to continue");
            navigate("/verify-otp");
        }
    }, [user, navigate]);

    // Don't render anything if not logged in or not verified
    if (!user || !user.isVerified) {
        return null;
    }

    return <>{children}</>;
};

export default VerificationRequired;
