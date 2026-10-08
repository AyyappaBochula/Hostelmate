import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  UserRound,
  UserRoundCog,
  X,
} from "lucide-react";

import "./SupervisorSignup.css";

// Later:
// import { acceptSupervisorInvite } from "../../services/authService";

function SupervisorSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Example invitation:
  // /signup/supervisor?token=abc123
  const inviteToken = searchParams.get("token") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhaar_no: "",
    password: "",
    confirm_password: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [aadhaarDocument, setAadhaarDocument] = useState(null);

  const [profilePreview, setProfilePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordRules = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
    symbol: /[^A-Za-z0-9]/.test(formData.password),
  };

  const passwordValid = Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedValue = value;

    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    if (name === "aadhaar_no") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
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

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        profile_image: "Only JPG, JPEG and PNG images are allowed.",
      }));

      return;
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));

    setErrors((prev) => ({
      ...prev,
      profile_image: "",
    }));
  };

  const handleAadhaarDocument = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        aadhaar_document: "Only JPG, JPEG, PNG and PDF documents are allowed.",
      }));

      return;
    }

    setAadhaarDocument(file);

    setErrors((prev) => ({
      ...prev,
      aadhaar_document: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    }

    if (formData.aadhaar_no && !/^\d{12}$/.test(formData.aadhaar_no)) {
      newErrors.aadhaar_no = "Aadhaar number must contain exactly 12 digits.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordValid) {
      newErrors.password = "Password must satisfy all security requirements.";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please re-enter your password.";
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
      const data = new FormData();

      data.append("invite_token", inviteToken);
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);

      if (formData.aadhaar_no) {
        data.append("aadhaar_no", formData.aadhaar_no);
      }

      data.append("password", formData.password);

      if (profileImage) {
        data.append("profile_image", profileImage);
      }

      if (aadhaarDocument) {
        data.append("aadhaar_document", aadhaarDocument);
      }

      /*
      ==========================================================
      API CALL - UNCOMMENT AFTER BACKEND IS READY
      ==========================================================

      await acceptSupervisorInvite(data);

      */

      // TEMPORARY DEMO
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit:
          error?.message ||
          "Unable to create supervisor account. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="supervisor-signup-page">
        <div className="supervisor-success-wrapper">
          <div className="supervisor-success-card">
            <span className="supervisor-success-icon">
              <CheckCircle2 size={38} />
            </span>

            <span className="supervisor-success-label">ACCOUNT CREATED</span>

            <h1>Welcome to HostelHub</h1>

            <p>
              Your supervisor account has been created successfully. You can now
              login using your mobile number and password.
            </p>

            <Link to="/login" className="supervisor-success-button">
              Go to Login
              <ArrowRight size={18} />
            </Link>

            <Link to="/" className="supervisor-success-home">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="supervisor-signup-page">
      <div className="supervisor-signup-background">
        <div className="supervisor-signup-grid"></div>
      </div>

      <header className="supervisor-signup-header">
        <div className="supervisor-signup-header-inner">
          <Link to="/" className="supervisor-signup-brand">
            <span>
              <BedDouble size={23} />
            </span>
            Hostel<strong>Hub</strong>
          </Link>

          <div className="supervisor-signup-header-right">
            <span>Already registered?</span>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </header>

      <main className="supervisor-signup-main">
        <div className="supervisor-signup-layout">
          {/* LEFT */}
          <section className="supervisor-signup-info">
            <Link to="/" className="supervisor-back">
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <span className="supervisor-badge">
              <ShieldCheck size={15} />
              SUPERVISOR INVITATION
            </span>

            <h1>
              Manage daily hostel operations <span>without the paperwork.</span>
            </h1>

            <p>
              Create your supervisor account and manage students, rooms, workers
              and payments for the hostels assigned to you by the owner.
            </p>

            <div className="supervisor-benefits">
              <div>
                <CheckCircle2 size={20} />
                <span>
                  <strong>Assigned Hostel Access</strong>
                  Work only with hostels assigned to your account.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />
                <span>
                  <strong>Student Management</strong>
                  Add, update and vacate hostel students.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />
                <span>
                  <strong>Payments & Dues</strong>
                  Record rent payments and monitor pending dues.
                </span>
              </div>

              <div>
                <CheckCircle2 size={20} />
                <span>
                  <strong>Secure Access</strong>
                  Your account is connected securely to the hostel owner.
                </span>
              </div>
            </div>
          </section>

          {/* FORM */}
          <section className="supervisor-signup-card">
            <div className="supervisor-card-header">
              <span>SUPERVISOR REGISTRATION</span>

              <h2>Create your account</h2>

              <p>Complete your details to accept the supervisor invitation.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* NAME */}

              <div className="supervisor-form-group">
                <label>
                  Full Name <span>*</span>
                </label>

                <div
                  className={`supervisor-input ${
                    errors.name ? "input-error" : ""
                  }`}
                >
                  <UserRound size={19} />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>

                {errors.name && (
                  <small className="supervisor-error">{errors.name}</small>
                )}
              </div>

              {/* EMAIL */}

              <div className="supervisor-form-group">
                <label>
                  Email Address <span>*</span>
                </label>

                <div
                  className={`supervisor-input ${
                    errors.email ? "input-error" : ""
                  }`}
                >
                  <Mail size={19} />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>

                {errors.email && (
                  <small className="supervisor-error">{errors.email}</small>
                )}
              </div>

              {/* PHONE */}

              <div className="supervisor-form-group">
                <label>
                  Mobile Number <span>*</span>
                </label>

                <div
                  className={`supervisor-input ${
                    errors.phone ? "input-error" : ""
                  }`}
                >
                  <Phone size={19} />

                  <strong className="supervisor-phone-prefix">+91</strong>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit mobile number"
                  />
                </div>

                {errors.phone && (
                  <small className="supervisor-error">{errors.phone}</small>
                )}
              </div>

              {/* AADHAAR */}

              <div className="supervisor-form-group">
                <div className="supervisor-label-row">
                  <label>Aadhaar Number</label>
                  <span>OPTIONAL</span>
                </div>

                <div
                  className={`supervisor-input ${
                    errors.aadhaar_no ? "input-error" : ""
                  }`}
                >
                  <ShieldCheck size={19} />

                  <input
                    type="text"
                    name="aadhaar_no"
                    value={formData.aadhaar_no}
                    onChange={handleChange}
                    placeholder="Enter 12-digit Aadhaar number"
                    inputMode="numeric"
                  />
                </div>

                {errors.aadhaar_no && (
                  <small className="supervisor-error">
                    {errors.aadhaar_no}
                  </small>
                )}
              </div>

              {/* PROFILE */}

              <div className="supervisor-form-group">
                <div className="supervisor-label-row">
                  <label>Profile Image</label>
                  <span>OPTIONAL</span>
                </div>

                {!profileImage ? (
                  <label className="supervisor-upload-box">
                    <span>
                      <ImagePlus size={22} />
                    </span>

                    <div>
                      <strong>Upload profile image</strong>
                      <small>JPG, JPEG or PNG</small>
                    </div>

                    <Upload size={18} />

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleProfileImage}
                      hidden
                    />
                  </label>
                ) : (
                  <div className="supervisor-uploaded-file">
                    <img src={profilePreview} alt="Profile preview" />

                    <div>
                      <strong>{profileImage.name}</strong>
                      <small>Profile image selected</small>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileImage(null);
                        setProfilePreview("");
                      }}
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}

                {errors.profile_image && (
                  <small className="supervisor-error">
                    {errors.profile_image}
                  </small>
                )}
              </div>

              {/* AADHAAR DOCUMENT */}

              <div className="supervisor-form-group">
                <div className="supervisor-label-row">
                  <label>Aadhaar Document</label>
                  <span>OPTIONAL</span>
                </div>

                {!aadhaarDocument ? (
                  <label className="supervisor-upload-box">
                    <span className="document-upload-icon">
                      <FileText size={22} />
                    </span>

                    <div>
                      <strong>Upload Aadhaar document</strong>
                      <small>JPG, JPEG, PNG or PDF</small>
                    </div>

                    <Upload size={18} />

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleAadhaarDocument}
                      hidden
                    />
                  </label>
                ) : (
                  <div className="supervisor-uploaded-file">
                    <span className="supervisor-document-preview">
                      <FileText size={22} />
                    </span>

                    <div>
                      <strong>{aadhaarDocument.name}</strong>
                      <small>Aadhaar document selected</small>
                    </div>

                    <button
                      type="button"
                      onClick={() => setAadhaarDocument(null)}
                    >
                      <X size={17} />
                    </button>
                  </div>
                )}

                {errors.aadhaar_document && (
                  <small className="supervisor-error">
                    {errors.aadhaar_document}
                  </small>
                )}
              </div>

              {/* PASSWORD */}

              <div className="supervisor-form-group">
                <label>
                  Password <span>*</span>
                </label>

                <div
                  className={`supervisor-input ${
                    errors.password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a secure password"
                  />

                  <button
                    type="button"
                    className="supervisor-password-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="supervisor-password-rules">
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
                  <small className="supervisor-error">{errors.password}</small>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div className="supervisor-form-group">
                <label>
                  Re-enter Password <span>*</span>
                </label>

                <div
                  className={`supervisor-input ${
                    errors.confirm_password ? "input-error" : ""
                  }`}
                >
                  <LockKeyhole size={19} />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                  />

                  <button
                    type="button"
                    className="supervisor-password-toggle"
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
                    <span className="supervisor-password-match">
                      <CheckCircle2 size={14} />
                      Passwords match
                    </span>
                  )}

                {errors.confirm_password && (
                  <small className="supervisor-error">
                    {errors.confirm_password}
                  </small>
                )}
              </div>

              {errors.submit && (
                <div className="supervisor-submit-error">{errors.submit}</div>
              )}

              <button
                type="submit"
                className="supervisor-create-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="supervisor-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Accept Invitation & Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="supervisor-secure-message">
                <LockKeyhole size={14} />
                Your account information is securely protected.
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default SupervisorSignup;
