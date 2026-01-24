import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Protected Route specifically for recruiters/admin
const RecruiterProtectedRoute = ({children}) => {
    const {user} = useSelector(store=>store.auth);
    const navigate = useNavigate();

    useEffect(()=>{
        if(user === null){
            toast.error("Please login as a recruiter to access this page");
            navigate("/login");
        } else if(user.role !== 'recruiter'){
            toast.error("Access denied. This page is for recruiters only.");
            navigate("/");
        }
    }, [user, navigate]);

    if (!user || user.role !== 'recruiter') {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
};

export default RecruiterProtectedRoute;