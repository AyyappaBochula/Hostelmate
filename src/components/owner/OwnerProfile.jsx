import { useEffect, useState } from "react";
import {
  Building2,
  Camera,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { profileApi } from "../../services/api";
import "./OwnerProfile.css";

function OwnerProfile() {
  const [form, setForm] = useState({
    name: "Vinay Kumar",
    email: "vinay@example.com",
    phone: "9876543210",
    aadhaar_no: "XXXXXXXX1234",
    business_name: "Vinay Hospitality & PG Services",
    gst_number: "37AAAAA0000A1Z5",
    address: "4th Floor, Tech Park, MVP Colony, Visakhapatnam",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    profileApi.getOwnerProfile().then((data) => {
      if (data) setForm(data);
    });
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await profileApi.updateOwnerProfile(form);
    setMessage("Profile details saved successfully.");
    setTimeout(() => setMessage(""), 3500);
  };

  return (
    <OwnerLayout title="Owner Profile">
      <div className="owner-page-heading">
        <div>
          <span>ACCOUNT SETTINGS</span>
          <h1>Owner Profile</h1>
          <p>
            Manage your personal contact details, business credentials, and
            tax verification.
          </p>
        </div>
      </div>

      {message && (
        <div className="owner-success-banner">
          <ShieldCheck size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="owner-summary-grid">
        {/* PROFILE CARD */}
        <section className="owner-page-card owner-profile-summary">
          <div className="owner-profile-avatar-container">
            <div className="owner-profile-large-avatar">
              <UserRound size={42} />
            </div>
            <button
              type="button"
              className="owner-avatar-camera-btn"
              aria-label="Upload photo"
            >
              <Camera size={14} />
            </button>
          </div>

          <h2>{form.name}</h2>
          <span className="owner-profile-role-tag">Hostel Property Owner</span>

          <div className="owner-profile-contact-list">
            <p>
              <Mail size={15} />
              <span>{form.email}</span>
            </p>
            <p>
              <Phone size={15} />
              <span>+91 {form.phone}</span>
            </p>
            <p>
              <Building2 size={15} />
              <span>{form.business_name || "Hostel Business"}</span>
            </p>
          </div>

          <div className="owner-profile-verified-badge">
            <ShieldCheck size={18} className="text-emerald-500" />
            <div>
              <strong>Verified Business Account</strong>
              <small>All privileges active & verified</small>
            </div>
          </div>
        </section>

        {/* EDIT FORM */}
        <section className="owner-page-card">
          <div className="owner-card-header">
            <div>
              <span className="owner-card-eyebrow">EDIT CREDENTIALS</span>
              <h3>Personal & Business Information</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="owner-form-two">
              <label className="owner-form-field">
                <span>Full Name *</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="owner-form-field">
                <span>Mobile Number *</span>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="owner-form-field">
              <span>Email Address *</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <div className="owner-form-two">
              <label className="owner-form-field">
                <span>Business / Trade Name</span>
                <input
                  type="text"
                  name="business_name"
                  value={form.business_name || ""}
                  onChange={handleChange}
                />
              </label>

              <label className="owner-form-field">
                <span>GST / Registration Number</span>
                <input
                  type="text"
                  name="gst_number"
                  value={form.gst_number || ""}
                  onChange={handleChange}
                />
              </label>
            </div>

            <label className="owner-form-field">
              <span>Business Office Address</span>
              <textarea
                rows="2"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
              />
            </label>

            <button type="submit" className="owner-primary-button">
              <Save size={16} />
              Save Profile Changes
            </button>
          </form>
        </section>
      </div>
    </OwnerLayout>
  );
}

export default OwnerProfile;
