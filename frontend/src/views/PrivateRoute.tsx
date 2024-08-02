import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContextType';
import LoadingWheel from '../components/LoadingWheel';


const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return <LoadingWheel/>;
    }

    return user ? <>{element}</> : <Navigate to="/home" />;
  };
  
  export default PrivateRoute;
