// origin private route
import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from './hook/EmailProvider';

const PrivateRoutes = ({ children }) => {
    const { authToken } = useAuth();

    // const isTokenValid = (token) => {
    //     try {
    //         const decodedToken = jwtDecode(token);
    //         const currentTime = Date.now() / 1000;
    //         return decodedToken.exp > currentTime;
    //     } catch (err) {
    //         return false;
    //     }
    // };

    // return isTokenValid(authToken) ? children : <Navigate to="/login" />;
    return authToken || localStorage.getItem('token') ? children : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
