import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Phone,
  ShieldCheck,
  UserRoundCog,
  Users,
  WalletCards,
} from "lucide-react";

import "./Login.css";

// Later:
// import { loginOwner, loginSupervisor } from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("owner");

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
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

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
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
      ==========================================================
      API CALL - UNCOMMENT AFTER BACKEND IS READY
      ==========================================================

      let response;

      if (role === "owner") {
        response = await loginOwner({
          phone: formData.phone,
          password: formData.password,
        });
      } else {
        response = await loginSupervisor({
          phone: formData.phone,
          password: formData.password,
        });
      }

      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      localStorage.setItem("userRole", role);

      if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/supervisor/dashboard");
      }
      */

      // ========================================================
      // TEMPORARY DEMO LOGIN
      // Remove this section after connecting API
      // ========================================================

      await new Promise((resolve) => setTimeout(resolve, 900));

      if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        navigate("/supervisor/dashboard");
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.message ||
          "Unable to login. Please check your mobile number and password.",
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-grid"></div>
        <div className="login-orb login-orb-one"></div>
        <div className="login-orb login-orb-two"></div>
      </div>

      {/* HEADER */}
      <header className="login-header">
        <div className="login-header-inner">
          <Link to="/" className="login-brand">
            <span className="login-brand-logo">
              <BedDouble size={23} />
            </span>
            Hostel<strong>Hub</strong>
          </Link>

          <div className="login-header-right">
            <span>New hostel owner?</span>

            <Link to="/signup/owner">Start Free</Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="login-main">
        <div className="login-layout">
          {/* LEFT SIDE */}
          <section className="login-info">
            <Link to="/" className="login-back">
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <span className="login-badge">
              <ShieldCheck size={15} />
              SECURE HOSTEL MANAGEMENT
            </span>

            <h1>
              Everything you need to manage your{" "}
              <span>hostel in one place.</span>
            </h1>

            <p className="login-description">
              Access your hostel operations securely. Owners can monitor their
              complete hostel business, while supervisors can manage the daily
              activities of their assigned hostels.
            </p>

            <div className="login-feature-grid">
              <div className="login-feature-card">
                <span>
                  <Building2 size={21} />
                </span>

                <div>
                  <strong>Multiple Hostels</strong>
                  <p>Manage hostel locations, floors, rooms and beds.</p>
                </div>
              </div>

              <div className="login-feature-card">
                <span>
                  <Users size={21} />
                </span>

                <div>
                  <strong>Student Records</strong>
                  <p>Keep student joining and accommodation data organized.</p>
                </div>
              </div>

              <div className="login-feature-card">
                <span>
                  <UserRoundCog size={21} />
                </span>

                <div>
                  <strong>Team Management</strong>
                  <p>Manage supervisors and hostel workers efficiently.</p>
                </div>
              </div>

              <div className="login-feature-card">
                <span>
                  <WalletCards size={21} />
                </span>

                <div>
                  <strong>Payments & Dues</strong>
                  <p>Track rent collections, pending balances and payments.</p>
                </div>
              </div>
            </div>

            <div className="login-security-message">
              <CheckCircle2 size={19} />

              <div>
                <strong>Your hostel data stays protected</strong>
                <span>
                  Secure role-based access for owners and supervisors.
                </span>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE */}
          <section className="login-card">
            <div className="login-card-header">
              <span className="login-form-label">WELCOME BACK</span>

              <h2>Sign in to HostelHub</h2>

              <p>Select your role and enter your registered mobile number.</p>
            </div>

            {/* ROLE SELECTOR */}
            <div className="login-role-selector">
              <button
                type="button"
                className={`login-role-button ${
                  role === "owner" ? "active" : ""
                }`}
                onClick={() => setRole("owner")}
              >
                <span className="role-icon">
                  <Building2 size={20} />
                </span>

                <span>
                  <strong>Owner</strong>
                  <small>Hostel owner account</small>
                </span>
              </button>

              <button
                type="button"
                className={`login-role-button ${
                  role === "supervisor" ? "active" : ""
                }`}
                onClick={() => setRole("supervisor")}
              >
                <span className="role-icon">
                  <UserRoundCog size={20} />
                </span>

                <span>
                  <strong>Supervisor</strong>
                  <small>Assigned hostel access</small>
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* MOBILE */}
              <div className="login-form-group">
                <label>
                  Mobile Number <span>*</span>
                </label>

                <div
                  className={`login-input-wrapper ${
                    errors.phone ? "input-error" : ""
                  }`}
                >
                  <Phone size={19} />

                  <span className="login-phone-prefix">+91</span>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                    inputMode="numeric"
                    autoComplete="tel"
                  />
                </div>

                {errors.phone && (
                  <span className="login-error">{errors.phone}</span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="login-form-group">
                <div className="login-label-row">
                  <label>
                    Password <span>*</span>
                  </label>

                  <Link to="/forgot-password">Forgot Password?</Link>
                </div>

                <div
                  className={`login-input-wrapper ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="login-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {errors.password && (
                  <span className="login-error">{errors.password}</span>
                )}
              </div>

              {errors.submit && (
                <div className="login-submit-error">{errors.submit}</div>
              )}

              <button
                type="submit"
                className="login-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    Login as {role === "owner" ? "Owner" : "Supervisor"}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {role === "owner" ? (
              <p className="login-bottom-text">
                Don't have an owner account?{" "}
                <Link to="/signup/owner">Create Account</Link>
              </p>
            ) : (
              <div className="supervisor-login-note">
                <ShieldCheck size={17} />

                <p>
                  Supervisor accounts are created through an invitation from a
                  hostel owner.
                </p>
              </div>
            )}

            <div className="login-secure">
              <LockKeyhole size={14} />
              Secure authentication • Role-based access
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;
