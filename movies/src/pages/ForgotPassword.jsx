import { Link } from "react-router-dom";
import "./Auth.css";

export default function ForgotPassword() {
  return (
    <div className="auth-page">
      <div className="auth-glass">
        <h2 className="auth-form-title">Forgot Password</h2>
        <p className="auth-desc">
          Password reset is not yet implemented. Please contact support.
        </p>
        <Link to="/login" className="auth-btn auth-btn-primary auth-btn-full" style={{ display: "block", textAlign: "center" }}>
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
