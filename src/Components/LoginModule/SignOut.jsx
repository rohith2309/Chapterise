import { SignOutuser } from "../../lib/Auth";
import { useNavigate } from "react-router-dom";
export default function SignOut({ auth }) {
    const navigate = useNavigate();
    const handleSignOut = () => {
    SignOutuser(auth);
    navigate("/login");
  };

  return (
    <button onClick={handleSignOut} className="sign-out-button"  >
      Sign Out
    </button>
  );
}