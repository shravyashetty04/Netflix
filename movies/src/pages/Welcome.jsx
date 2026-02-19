import { Link } from "react-router-dom";
import "./Auth.css";

export default function Welcome() {
  return (
    <div className="auth-page">
      <div className="auth-glass">
        <h1 className="auth-title">Hello!</h1>
        <p className="auth-desc">
          Welcome to Movieflix. Sign in to continue watching or create an account to get started.
        </p>
        <div className="auth-actions">
          <Link to="/login" className="auth-btn auth-btn-primary">
            SIGN IN
          </Link>
          <Link to="/register" className="auth-btn auth-btn-outline">
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
}
