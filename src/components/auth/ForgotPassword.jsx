import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  CheckCircle2,
  Phone,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import "./ForgotPassword.css";

// LATER:
// import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [role, setRole] = useState("owner");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);

    setPhone(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      setError("Mobile number is required.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);

    try {
      /*
      ======================================================
      API CALL - UNCOMMENT AFTER BACKEND IS READY
      ======================================================

      const response = await forgotPassword({
        role: role,
        phone: phone,
      });

      console.log("Forgot password response:", response);
      */

      // TEMPORARY DEMO
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Send role and phone to reset password page
      navigate("/reset-password", {
        state: {
          role,
          phone,
        },
      });
    } catch (err) {
      setError(
        err?.message || "Unable to send OTP. Please check your mobile number.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      {/* BACKGROUND */}
      <div className="forgot-background">
        <div className="forgot-grid"></div>
        <div className="forgot-orb forgot-orb-one"></div>
        <div className="forgot-orb forgot-orb-two"></div>
      </div>

      {/* HEADER */}
      <header className="forgot-header">
        <div className="forgot-header-inner">
          <Link to="/" className="forgot-brand">
            <span className="forgot-brand-logo">
              <BedDouble size={23} />
            </span>
            Hostel<strong>Hub</strong>
          </Link>

          <div className="forgot-header-right">
            <span>Remember your password?</span>

            <Link to="/login">Login</Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="forgot-main">
        <div className="forgot-layout">
          {/* LEFT */}
          <section className="forgot-info">
            <Link to="/login" className="forgot-back">
              <ArrowLeft size={16} />
              Back to Login
            </Link>

            <span className="forgot-badge">
              <ShieldCheck size={15} />
              SECURE ACCOUNT RECOVERY
            </span>

            <h1>
              Forgot your password? <span>We'll help you recover it.</span>
            </h1>

            <p className="forgot-description">
              Enter the mobile number registered with your HostelHub account.
              We'll verify your account before allowing you to create a new
              password.
            </p>

            <div className="forgot-benefits">
              <div>
                <CheckCircle2 size={20} />

                <span>
                  <strong>Secure Verification</strong>
                  Your registered mobile number is used to verify your account.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />

                <span>
                  <strong>Owner & Supervisor</strong>
                  Password recovery is available for both account types.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />

                <span>
                  <strong>Protected Account</strong>
                  Your existing hostel information remains completely safe.
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT */}
          <section className="forgot-card">
            <div className="forgot-card-icon">
              <ShieldCheck size={28} />
            </div>

            <div className="forgot-card-header">
              <span>PASSWORD RECOVERY</span>

              <h2>Forgot Password?</h2>

              <p>
                Select your account type and enter your registered mobile
                number.
              </p>
            </div>

            {/* ROLE */}
            <div className="forgot-role-selector">
              <button
                type="button"
                className={`forgot-role-button ${
                  role === "owner" ? "active" : ""
                }`}
                onClick={() => setRole("owner")}
              >
                <span>
                  <Building2 size={20} />
                </span>

                <div>
                  <strong>Owner</strong>
                  <small>Hostel owner account</small>
                </div>
              </button>

              <button
                type="button"
                className={`forgot-role-button ${
                  role === "supervisor" ? "active" : ""
                }`}
                onClick={() => setRole("supervisor")}
              >
                <span>
                  <UserRoundCog size={20} />
                </span>

                <div>
                  <strong>Supervisor</strong>
                  <small>Supervisor account</small>
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="forgot-form-group">
                <label>
                  Registered Mobile Number <span>*</span>
                </label>

                <div className={`forgot-input ${error ? "input-error" : ""}`}>
                  <Phone size={19} />

                  <strong>+91</strong>

                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="Enter 10-digit mobile number"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </div>

                {error && <small className="forgot-error">{error}</small>}
              </div>

              <button
                type="submit"
                className="forgot-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="forgot-spinner"></span>
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send Verification OTP
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="forgot-security">
              <ShieldCheck size={15} />
              Your account recovery is securely protected.
            </div>

            <p className="forgot-login-link">
              Remember your password? <Link to="/login">Login</Link>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
