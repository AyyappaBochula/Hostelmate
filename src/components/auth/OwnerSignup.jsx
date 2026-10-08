import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  ImagePlus,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

import "./OwnerSignup.css";

// ======================================================
// LATER: UNCOMMENT WHEN DJANGO API IS READY
// ======================================================
// import { registerOwner } from "../../services/authService";

function OwnerSignup() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

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
  const [signupSuccess, setSignupSuccess] = useState(false);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    let updatedValue = value;

    // Mobile number - numbers only
    if (name === "phone") {
      updatedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    // Aadhaar number - numbers only
    if (name === "aadhaar_no") {
      updatedValue = value.replace(/\D/g, "").slice(0, 12);
    }

    setFormData((previous) => ({
      ...previous,
      [name]: updatedValue,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }
  };

  // ======================================================
  // PROFILE IMAGE - OPTIONAL
  // JPG / JPEG / PNG
  // ======================================================

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        profile_image: "Only JPG, JPEG and PNG images are allowed.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        profile_image: "Profile image must be below 5 MB.",
      }));

      return;
    }

    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));

    setErrors((previous) => ({
      ...previous,
      profile_image: "",
    }));
  };

  // ======================================================
  // AADHAAR DOCUMENT - OPTIONAL
  // JPG / JPEG / PNG / PDF
  // ======================================================

  const handleAadhaarDocument = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((previous) => ({
        ...previous,
        aadhaar_document: "Only JPG, JPEG, PNG and PDF files are allowed.",
      }));

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((previous) => ({
        ...previous,
        aadhaar_document: "Aadhaar document must be below 5 MB.",
      }));

      return;
    }

    setAadhaarDocument(file);

    setErrors((previous) => ({
      ...previous,
      aadhaar_document: "",
    }));
  };

  // ======================================================
  // REMOVE PROFILE IMAGE
  // ======================================================

  const removeProfileImage = () => {
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    setProfileImage(null);
    setProfilePreview("");
  };

  // ======================================================
  // REMOVE AADHAAR DOCUMENT
  // ======================================================

  const removeAadhaarDocument = () => {
    setAadhaarDocument(null);
  };

  // ======================================================
  // STEP 1 VALIDATION
  // ======================================================

  const validateStepOne = () => {
    const newErrors = {};

    // NAME
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Full name must contain at least 3 characters.";
    }

    // EMAIL
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    // PHONE
    if (!formData.phone) {
      newErrors.phone = "Mobile number is required.";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    }

    // AADHAAR NUMBER IS OPTIONAL
    // But if entered, it must contain 12 digits.
    if (formData.aadhaar_no && !/^\d{12}$/.test(formData.aadhaar_no)) {
      newErrors.aadhaar_no = "Aadhaar number must contain exactly 12 digits.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ======================================================
  // STEP 2 VALIDATION
  // ======================================================

  const validateStepTwo = () => {
    const newErrors = {};

    /*
      IMPORTANT:

      Profile image is OPTIONAL.
      Aadhaar document is OPTIONAL.

      Therefore, we DO NOT check:

      if (!profileImage)
      if (!aadhaarDocument)
    */

    // PASSWORD REQUIRED
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    // MINIMUM 8 CHARACTERS
    else if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    // UPPERCASE
    else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter.";
    }

    // LOWERCASE
    else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter.";
    }

    // NUMBER
    else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number.";
    }

    // SPECIAL CHARACTER
    else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character.";
    }

    // CONFIRM PASSWORD
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please re-enter your password.";
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password =
        "Password and re-enter password must be the same.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ======================================================
  // NEXT STEP
  // ======================================================

  const handleNext = () => {
    if (validateStepOne()) {
      setCurrentStep(2);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // ======================================================
  // PREVIOUS STEP
  // ======================================================

  const handlePrevious = () => {
    setErrors({});
    setCurrentStep(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // SUBMIT OWNER SIGNUP
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateStepTwo()) {
      return;
    }

    setLoading(true);

    try {
      // ==================================================
      // TEMPORARY FRONTEND DATA
      // ==================================================
      //
      // This is only for testing the frontend.
      //
      // DO NOT store:
      // - actual password
      // - full Aadhaar number
      // - Aadhaar document contents
      //
      // in localStorage in the real application.
      // ==================================================

      const temporaryOwnerData = {
        id: null,

        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone,

        aadhaar_no: formData.aadhaar_no
          ? `XXXXXXXX${formData.aadhaar_no.slice(-4)}`
          : "",

        profile_image: profileImage ? profileImage.name : "",

        aadhaar_document: aadhaarDocument ? aadhaarDocument.name : "",

        approval_status: "pending",

        trial_start_date: null,
        trial_end_date: null,

        account_status: "inactive",

        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      localStorage.setItem(
        "temporary_owner_signup",
        JSON.stringify(temporaryOwnerData),
      );

      console.log("Temporary Owner Signup:", temporaryOwnerData);

      // Temporary delay to show loading animation.
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // ==================================================
      // DJANGO API CALL
      // ==================================================
      //
      // WHEN BACKEND IS READY:
      //
      // 1. Uncomment registerOwner import at top.
      // 2. Uncomment this API code.
      // 3. Remove temporary localStorage code above.
      //
      // ==================================================

      /*
      const apiFormData = new FormData();

      apiFormData.append(
        "name",
        formData.name.trim()
      );

      apiFormData.append(
        "email",
        formData.email.trim()
      );

      apiFormData.append(
        "phone",
        formData.phone
      );

      // Aadhaar number is optional
      if (formData.aadhaar_no) {
        apiFormData.append(
          "aadhaar_no",
          formData.aadhaar_no
        );
      }

      // Profile image is optional
      if (profileImage) {
        apiFormData.append(
          "profile_image",
          profileImage
        );
      }

      // Aadhaar document is optional
      if (aadhaarDocument) {
        apiFormData.append(
          "aadhaar_document",
          aadhaarDocument
        );
      }

      apiFormData.append(
        "password",
        formData.password
      );

      // confirm_password is NOT a database field.
      // We use it only for frontend validation.

      const response =
        await registerOwner(apiFormData);

      console.log(
        "Owner Registration Response:",
        response
      );
      */

      setSignupSuccess(true);
    } catch (error) {
      console.error("Owner signup error:", error);

      setErrors({
        submit: "Unable to create your account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SUCCESS PAGE
  // ======================================================

  if (signupSuccess) {
    return (
      <div className="owner-signup-page">
        <div className="signup-background">
          <div className="signup-grid"></div>
          <div className="signup-orb signup-orb-one"></div>
          <div className="signup-orb signup-orb-two"></div>
        </div>

        <div className="signup-success-wrapper">
          <div className="signup-success-card">
            <div className="success-icon">
              <CheckCircle2 size={36} />
            </div>

            <span className="success-label">REGISTRATION COMPLETED</span>

            <h1>Account submitted successfully!</h1>

            <p>
              Thank you, <strong>{formData.name}</strong>. Your HostelHub owner
              account has been submitted successfully.
            </p>

            <div className="approval-status-box">
              <div className="approval-status-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>Pending Admin Approval</strong>

                <span>
                  Your account is currently under verification. You can start
                  managing your hostel after approval.
                </span>
              </div>
            </div>

            <div className="trial-info">
              <div className="trial-small-icon">
                <Check size={18} />
              </div>

              <div>
                <strong>30-Day Free Trial After Approval</strong>

                <span>
                  Your trial period will begin automatically when the System
                  Admin approves your account.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="success-login-button"
              onClick={() => navigate("/login")}
            >
              Go to Login
              <ArrowRight size={17} />
            </button>

            <Link to="/" className="success-home-link">
              <ArrowLeft size={14} />
              Back to HostelHub
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ======================================================
  // MAIN SIGNUP PAGE
  // ======================================================

  return (
    <div className="owner-signup-page">
      {/* BACKGROUND */}

      <div className="signup-background">
        <div className="signup-grid"></div>
        <div className="signup-orb signup-orb-one"></div>
        <div className="signup-orb signup-orb-two"></div>
      </div>

      {/* HEADER */}

      <header className="signup-header">
        <div className="signup-header-inner">
          <Link to="/" className="signup-brand">
            <span className="signup-brand-logo">
              <Building2 size={22} />
            </span>

            <span>
              Hostel<strong>Hub</strong>
            </span>
          </Link>

          <div className="signup-header-right">
            <span>Already have an owner account?</span>

            <Link to="/login">Login</Link>
          </div>
        </div>
      </header>

      {/* MAIN */}

      <main className="signup-main">
        <div className="signup-layout">
          {/* ==================================================
              LEFT WEBSITE INFORMATION
          =================================================== */}

          <aside className="signup-info">
            <Link to="/" className="back-home">
              <ArrowLeft size={16} />
              Back to home
            </Link>

            <div className="signup-left-badge">
              <ShieldCheck size={15} />
              SMART HOSTEL MANAGEMENT
            </div>

            <h1>
              Everything your hostel needs.
              <span> One simple platform.</span>
            </h1>

            <p className="signup-description">
              HostelHub helps hostel owners simplify everyday management.
              Organize students, rooms, beds, supervisors, workers and rent
              payments from one secure dashboard.
            </p>

            {/* WEBSITE FEATURES */}

            <div className="website-feature-grid">
              <div className="website-feature-card">
                <div className="website-feature-icon">
                  <Building2 size={20} />
                </div>

                <div>
                  <strong>Multiple Hostels</strong>

                  <span>Manage all your hostels from one owner account.</span>
                </div>
              </div>

              <div className="website-feature-card">
                <div className="website-feature-icon">
                  <BedDouble size={20} />
                </div>

                <div>
                  <strong>Rooms & Beds</strong>

                  <span>Know which beds are available and occupied.</span>
                </div>
              </div>

              <div className="website-feature-card">
                <div className="website-feature-icon">
                  <Users size={20} />
                </div>

                <div>
                  <strong>Students & Staff</strong>

                  <span>
                    Maintain students, supervisors and workers easily.
                  </span>
                </div>
              </div>

              <div className="website-feature-card">
                <div className="website-feature-icon">
                  <CreditCard size={20} />
                </div>

                <div>
                  <strong>Payments & Dues</strong>

                  <span>
                    Track rent collections and pending balances clearly.
                  </span>
                </div>
              </div>
            </div>

            {/* TRIAL */}

            <div className="signup-trial-card">
              <div className="signup-trial-number">30</div>

              <div>
                <strong>Days Free After Approval</strong>

                <span>
                  Explore HostelHub before starting your paid subscription.
                </span>
              </div>
            </div>

            {/* TRUST */}

            <div className="signup-trust-row">
              <span>
                <CheckCircle2 size={15} />
                Simple setup
              </span>

              <span>
                <CheckCircle2 size={15} />
                Secure access
              </span>

              <span>
                <CheckCircle2 size={15} />
                Easy management
              </span>
            </div>
          </aside>

          {/* ==================================================
              RIGHT SIGNUP CARD
          =================================================== */}

          <section className="signup-card">
            <div className="signup-card-header">
              <span className="signup-form-label">OWNER REGISTRATION</span>

              <h2>Create your account</h2>

              <p>
                Start your journey with HostelHub. It only takes a few minutes.
              </p>
            </div>

            {/* STEPS */}

            <div className="signup-steps">
              <div
                className={`signup-step ${currentStep >= 1 ? "active" : ""}`}
              >
                <span>{currentStep > 1 ? <Check size={15} /> : "1"}</span>

                <div>
                  <strong>Personal Details</strong>

                  <small>Basic information</small>
                </div>
              </div>

              <div
                className={`step-line ${currentStep === 2 ? "active" : ""}`}
              ></div>

              <div
                className={`signup-step ${currentStep === 2 ? "active" : ""}`}
              >
                <span>2</span>

                <div>
                  <strong>Account Security</strong>

                  <small>Files & password</small>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* ==================================================
                  STEP 1
              =================================================== */}

              {currentStep === 1 && (
                <div className="signup-form-section form-animation">
                  <div className="form-section-title">
                    <h3>Personal Information</h3>

                    <p>Tell us a little about yourself.</p>
                  </div>

                  {/* NAME */}

                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name
                      <span>*</span>
                    </label>

                    <div
                      className={`input-wrapper ${
                        errors.name ? "input-error" : ""
                      }`}
                    >
                      <User size={17} />

                      <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.name && (
                      <small className="error-message">{errors.name}</small>
                    )}
                  </div>

                  {/* EMAIL */}

                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address
                      <span>*</span>
                    </label>

                    <div
                      className={`input-wrapper ${
                        errors.email ? "input-error" : ""
                      }`}
                    >
                      <Mail size={17} />

                      <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.email && (
                      <small className="error-message">{errors.email}</small>
                    )}
                  </div>

                  {/* PHONE */}

                  <div className="form-group">
                    <label htmlFor="phone">
                      Mobile Number
                      <span>*</span>
                    </label>

                    <div
                      className={`input-wrapper ${
                        errors.phone ? "input-error" : ""
                      }`}
                    >
                      <Phone size={17} />

                      <div className="phone-prefix">+91</div>

                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        placeholder="Enter 10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.phone && (
                      <small className="error-message">{errors.phone}</small>
                    )}
                  </div>

                  {/* AADHAAR NUMBER */}

                  <div className="form-group">
                    <div className="label-row">
                      <label htmlFor="aadhaar_no">Aadhaar Number</label>

                      <span className="optional-badge">OPTIONAL</span>
                    </div>

                    <div
                      className={`input-wrapper ${
                        errors.aadhaar_no ? "input-error" : ""
                      }`}
                    >
                      <ShieldCheck size={17} />

                      <input
                        id="aadhaar_no"
                        type="text"
                        name="aadhaar_no"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Enter 12-digit Aadhaar number"
                        value={formData.aadhaar_no}
                        onChange={handleChange}
                      />
                    </div>

                    {errors.aadhaar_no && (
                      <small className="error-message">
                        {errors.aadhaar_no}
                      </small>
                    )}

                    <small className="field-hint">
                      Optional for now. If entered, Aadhaar must contain exactly
                      12 digits.
                    </small>
                  </div>

                  <button
                    type="button"
                    className="next-button"
                    onClick={handleNext}
                  >
                    Continue to Security
                    <ArrowRight size={17} />
                  </button>
                </div>
              )}

              {/* ==================================================
                  STEP 2
              =================================================== */}

              {currentStep === 2 && (
                <div className="signup-form-section form-animation">
                  <div className="form-section-title">
                    <h3>Documents & Security</h3>

                    <p>
                      Documents are optional for now. Create a secure password
                      to finish.
                    </p>
                  </div>

                  {/* PROFILE IMAGE */}

                  <div className="form-group">
                    <div className="label-row">
                      <label>Profile Image</label>

                      <span className="optional-badge">OPTIONAL</span>
                    </div>

                    {!profileImage ? (
                      <label className="upload-box">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          onChange={handleProfileImage}
                          hidden
                        />

                        <span className="upload-icon">
                          <ImagePlus size={22} />
                        </span>

                        <div>
                          <strong>Upload Profile Image</strong>

                          <small>JPG, JPEG or PNG • Max 5 MB</small>
                        </div>

                        <span className="upload-action">
                          <Upload size={15} />
                          Browse
                        </span>
                      </label>
                    ) : (
                      <div className="uploaded-file">
                        <img
                          src={profilePreview}
                          alt="Profile preview"
                          className="profile-preview"
                        />

                        <div>
                          <strong>{profileImage.name}</strong>

                          <small>
                            {(profileImage.size / 1024 / 1024).toFixed(2)} MB
                          </small>
                        </div>

                        <button
                          type="button"
                          onClick={removeProfileImage}
                          title="Remove image"
                        >
                          <X size={17} />
                        </button>
                      </div>
                    )}

                    {errors.profile_image && (
                      <small className="error-message">
                        {errors.profile_image}
                      </small>
                    )}
                  </div>

                  {/* AADHAAR DOCUMENT */}

                  <div className="form-group">
                    <div className="label-row">
                      <label>Aadhaar Document</label>

                      <span className="optional-badge">OPTIONAL</span>
                    </div>

                    {!aadhaarDocument ? (
                      <label className="upload-box">
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf"
                          onChange={handleAadhaarDocument}
                          hidden
                        />

                        <span className="upload-icon document-icon">
                          <FileText size={22} />
                        </span>

                        <div>
                          <strong>Upload Aadhaar Document</strong>

                          <small>JPG, JPEG, PNG or PDF • Max 5 MB</small>
                        </div>

                        <span className="upload-action">
                          <Upload size={15} />
                          Browse
                        </span>
                      </label>
                    ) : (
                      <div className="uploaded-file">
                        <span className="uploaded-document">
                          <FileText size={21} />
                        </span>

                        <div>
                          <strong>{aadhaarDocument.name}</strong>

                          <small>
                            {(aadhaarDocument.size / 1024 / 1024).toFixed(2)} MB
                          </small>
                        </div>

                        <button
                          type="button"
                          onClick={removeAadhaarDocument}
                          title="Remove document"
                        >
                          <X size={17} />
                        </button>
                      </div>
                    )}

                    {errors.aadhaar_document && (
                      <small className="error-message">
                        {errors.aadhaar_document}
                      </small>
                    )}
                  </div>

                  {/* PASSWORD */}

                  <div className="form-group">
                    <label htmlFor="password">
                      Password
                      <span>*</span>
                    </label>

                    <div
                      className={`input-wrapper ${
                        errors.password ? "input-error" : ""
                      }`}
                    >
                      <LockKeyhole size={17} />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword((previous) => !previous)}
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <small className="error-message">{errors.password}</small>
                    )}

                    {/* PASSWORD REQUIREMENTS */}

                    <div className="password-rules">
                      <PasswordRule
                        valid={formData.password.length >= 8}
                        text="8+ characters"
                      />

                      <PasswordRule
                        valid={/[A-Z]/.test(formData.password)}
                        text="Uppercase"
                      />

                      <PasswordRule
                        valid={/[a-z]/.test(formData.password)}
                        text="Lowercase"
                      />

                      <PasswordRule
                        valid={/[0-9]/.test(formData.password)}
                        text="Number"
                      />

                      <PasswordRule
                        valid={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(
                          formData.password,
                        )}
                        text="Special symbol"
                      />
                    </div>
                  </div>

                  {/* RE-ENTER PASSWORD */}

                  <div className="form-group">
                    <label htmlFor="confirm_password">
                      Re-enter Password
                      <span>*</span>
                    </label>

                    <div
                      className={`input-wrapper ${
                        errors.confirm_password ? "input-error" : ""
                      }`}
                    >
                      <LockKeyhole size={17} />

                      <input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Enter the same password again"
                        value={formData.confirm_password}
                        onChange={handleChange}
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword((previous) => !previous)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>

                    {errors.confirm_password && (
                      <small className="error-message">
                        {errors.confirm_password}
                      </small>
                    )}

                    {formData.confirm_password &&
                      formData.password === formData.confirm_password && (
                        <small className="password-match">
                          <CheckCircle2 size={13} />
                          Passwords match
                        </small>
                      )}
                  </div>

                  {errors.submit && (
                    <div className="submit-error">{errors.submit}</div>
                  )}

                  {/* BUTTONS */}

                  <div className="form-buttons">
                    <button
                      type="button"
                      className="previous-button"
                      onClick={handlePrevious}
                      disabled={loading}
                    >
                      <ArrowLeft size={17} />
                      Back
                    </button>

                    <button
                      type="submit"
                      className="create-account-button"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="button-spinner"></span>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Owner Account
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </div>

                  <div className="signup-bottom-security">
                    <ShieldCheck size={14} />

                    <span>
                      Your password will be securely encrypted when connected to
                      the backend.
                    </span>
                  </div>
                </div>
              )}
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

// ======================================================
// PASSWORD RULE COMPONENT
// ======================================================

function PasswordRule({ valid, text }) {
  return (
    <span className={`password-rule ${valid ? "valid" : ""}`}>
      <span className="rule-circle">{valid && <Check size={10} />}</span>

      {text}
    </span>
  );
}

export default OwnerSignup;
