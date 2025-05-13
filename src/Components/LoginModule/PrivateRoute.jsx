import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PrivateRoute() {
    const { user } = useAuth();
    console.log(user);
    
    return user ? <Outlet /> : <Navigate to="/login" />;
}
export default PrivateRoute;