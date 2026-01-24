import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Custom hook for authentication checks
export const useRequireAuth = (message = "Please login to continue") => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error(message);
            navigate('/login');
        }
    }, [user, navigate, message]);

    return user;
};

// Hook to require student role
export const useRequireStudent = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error("Please login to continue");
            navigate('/login');
        } else if (user.role !== 'student') {
            toast.error("Access denied. This feature is for job seekers only.");
            navigate('/');
        }
    }, [user, navigate]);

    return user;
};

// Hook to require recruiter role
export const useRequireRecruiter = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error("Please login as a recruiter to continue");
            navigate('/login');
        } else if (user.role !== 'recruiter') {
            toast.error("Access denied. This feature is for recruiters only.");
            navigate('/');
        }
    }, [user, navigate]);

    return user;
};

// Hook to check if user is authenticated (doesn't redirect)
export const useIsAuthenticated = () => {
    const { user } = useSelector(store => store.auth);
    return !!user;
};

// Hook to get user role
export const useUserRole = () => {
    const { user } = useSelector(store => store.auth);
    return user?.role || null;
};
