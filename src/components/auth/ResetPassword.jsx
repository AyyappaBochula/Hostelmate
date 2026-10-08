import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import "./ResetPassword.css";

// LATER:
// import { resetPassword } from "../../services/authService";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role;
  const phone = location.state?.phone;

  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /*
    Prevent direct access to /reset-password
    without completing forgot password step.
  */
  if (!role || !phone) {
    return <Navigate to="/forgot-password" replace />;
  }

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    symbol: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordValid = Object.values(passwordRules).every(Boolean);

  const maskedPhone = `******${phone.slice(-4)}`;

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "otp") {
      updatedValue = value.replace(/\D/g, "").slice(0, 6);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.otp) {
      newErrors.otp = "OTP is required.";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "Enter the 6-digit OTP.";
    }

    if (!formData.password) {
      newErrors.password = "New password is required.";
    } else if (!passwordValid) {
      newErrors.password = "Password must satisfy all security requirements.";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please re-enter your new password.";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      /*
      ======================================================
      API CALL - UNCOMMENT AFTER BACKEND IS READY
      ======================================================

      const response = await resetPassword({
        role: role,
        phone: phone,
        otp: formData.otp,
        password: formData.password,
      });

      console.log("Reset password response:", response);
      */

      // TEMPORARY DEMO
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        submit:
          err?.message || "Unable to reset password. Please check your OTP.",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="reset-page">
        <div className="reset-success-wrapper">
          <div className="reset-success-card">
            <span className="reset-success-icon">
              <CheckCircle2 size={40} />
            </span>

            <span className="reset-success-label">PASSWORD UPDATED</span>

            <h1>Password reset successfully</h1>

            <p>
              Your password has been changed successfully. You can now login
              using your mobile number and new password.
            </p>

            <button
              type="button"
              className="reset-login-button"
              onClick={() => navigate("/login")}
            >
              Continue to Login
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-page">
      <div className="reset-background">
        <div className="reset-grid"></div>
      </div>

      {/* HEADER */}
      <header className="reset-header">
        <div className="reset-header-inner">
          <Link to="/" className="reset-brand">
            <span>
              <BedDouble size={23} />
            </span>
            Hostel<strong>Hub</strong>
          </Link>

          <Link to="/login" className="reset-header-login">
            Login
          </Link>
        </div>
      </header>

      <main className="reset-main">
        <div className="reset-layout">
          {/* LEFT */}
          <section className="reset-info">
            <Link to="/forgot-password" className="reset-back">
              <ArrowLeft size={16} />
              Change Mobile Number
            </Link>

            <span className="reset-badge">
              <KeyRound size={15} />
              CREATE NEW PASSWORD
            </span>

            <h1>
              Secure your account with a <span>strong new password.</span>
            </h1>

            <p>
              We sent a verification OTP to your registered mobile number. Enter
              the OTP and create a new secure password for your HostelHub
              account.
            </p>

            <div className="reset-account-box">
              <ShieldCheck size={21} />

              <div>
                <span>Resetting password for</span>

                <strong>
                  {role === "owner" ? "Owner" : "Supervisor"} • +91{" "}
                  {maskedPhone}
                </strong>
              </div>
            </div>
          </section>

          {/* FORM */}
          <section className="reset-card">
            <div className="reset-card-icon">
              <LockKeyhole size={28} />
            </div>

            <div className="reset-card-header">
              <span>RESET PASSWORD</span>

              <h2>Create New Password</h2>

              <p>Enter your verification OTP and choose a strong password.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* OTP */}

              <div className="reset-form-group">
                <label>
                  Verification OTP <span>*</span>
                </label>

                <div
                  className={`reset-input ${errors.otp ? "input-error" : ""}`}
                >
                  <KeyRound size={19} />

                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>

                {errors.otp && (
                  <small className="reset-error">{errors.otp}</small>
                )}

                <div className="reset-otp-help">
                  OTP sent to +91 {maskedPhone}
                </div>
              </div>

              {/* PASSWORD */}

              <div className="reset-form-group">
                <label>
                  New Password <span>*</span>
                </label>

                <div
                  className={`reset-input ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="reset-password-rules">
                  {[
                    ["length", "8+ characters"],
                    ["uppercase", "Uppercase"],
                    ["lowercase", "Lowercase"],
                    ["number", "Number"],
                    ["symbol", "Symbol"],
                  ].map(([key, label]) => (
                    <span
                      key={key}
                      className={passwordRules[key] ? "valid" : ""}
                    >
                      <i>{passwordRules[key] && <Check size={9} />}</i>

                      {label}
                    </span>
                  ))}
                </div>

                {errors.password && (
                  <small className="reset-error">{errors.password}</small>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="reset-form-group">
                <label>
                  Re-enter New Password <span>*</span>
                </label>

                <div
                  className={`reset-input ${
                    errors.confirm_password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>

                {formData.confirm_password &&
                  formData.password === formData.confirm_password && (
                    <span className="reset-password-match">
                      <CheckCircle2 size={14} />
                      Passwords match
                    </span>
                  )}

                {errors.confirm_password && (
                  <small className="reset-error">
                    {errors.confirm_password}
                  </small>
                )}
              </div>

              {errors.submit && (
                <div className="reset-submit-error">{errors.submit}</div>
              )}

              <button type="submit" className="reset-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="reset-spinner"></span>
                    Resetting Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="reset-security">
                <ShieldCheck size={14} />
                Use a password you haven't used before.
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ResetPassword;
