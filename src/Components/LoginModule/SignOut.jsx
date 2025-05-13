import { SignOutuser } from "../../lib/Auth";

export default function SignOut({ auth }) {
  const handleSignOut = () => {
    SignOutuser(auth);
  };

  return (
    <button onClick={handleSignOut} className="sign-out-button"  >
      Sign Out
    </button>
  );
}