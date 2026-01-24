import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Protected Route for authenticated users (both students and recruiters)
const ProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            toast.error("Please login to access this page");
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
};

export default ProtectedRoute;
