import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Protected Route specifically for students/job seekers
const StudentProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            toast.error("Please login to access this page");
            navigate("/login");
        } else if (user.role !== 'student') {
            toast.error("Access denied. This page is for job seekers only.");
            navigate("/");
        }
    }, [user, navigate]);

    if (!user || user.role !== 'student') {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
};

export default StudentProtectedRoute;
