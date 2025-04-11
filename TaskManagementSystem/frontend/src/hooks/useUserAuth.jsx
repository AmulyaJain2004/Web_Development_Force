import {useEffect, useContext, use} from 'react';
import {useNavigate} from 'react-router-dom';
import { UserContext } from '../context/userContext';

export const useUserAuth = () => {
    const { user, loading, clearUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect (() => {
        if (loading) return; // Wait until loading is done
        if (user) return; // User is already authenticated
        if (!user){
            clearUser(); // Clear user context if not authenticated
            navigate('/login'); // Redirect to login page
        }
    }, [user, loading, navigate, clearUser]);
}