import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { profileApi } from "../../services/api";
import "./SupervisorProfile.css";

function SupervisorProfile() {
  const [form, setForm] = useState({
    name: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "9876543210",
    aadhaar_no: "XXXXXXXX5678",
    hostel_assigned: "Sunrise Boys Hostel",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    profileApi.getSupervisorProfile().then((data) => {
      if (data) setForm(data);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await profileApi.updateSupervisorProfile(form);
    setMessage("Profile saved successfully.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <SupervisorLayout title="Supervisor Profile">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">SETTINGS</span>
          <h1>Supervisor Profile</h1>
          <p>Manage your supervisor contact details and assigned hostel.</p>
        </div>
      </div>

      {message && (
        <div className="owner-success-banner">
          <ShieldCheck size={18} />
          <span>{message}</span>
        </div>
      )}

      <div className="supervisor-dashboard-grid">
        <section className="supervisor-card owner-profile-summary">
          <div className="owner-profile-avatar-container">
            <div className="owner-profile-large-avatar">
              <UserRound size={42} />
            </div>
          </div>

          <h2>{form.name}</h2>
          <span className="owner-profile-role-tag">Hostel Supervisor</span>

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
              <span>{form.hostel_assigned || "Sunrise Boys Hostel"}</span>
            </p>
          </div>
        </section>

        <section className="supervisor-card">
          <div className="supervisor-card-heading">
            <div>
              <span className="supervisor-card-eyebrow">EDIT INFORMATION</span>
              <h2>Personal Details</h2>
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
              <span>Email Address</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label className="owner-form-field">
              <span>Assigned Hostel</span>
              <input
                type="text"
                value={form.hostel_assigned || "Sunrise Boys Hostel"}
                disabled
              />
            </label>

            <button type="submit" className="supervisor-primary-button">
              <Save size={16} />
              Save Changes
            </button>
          </form>
        </section>
      </div>
    </SupervisorLayout>
  );
}

export default SupervisorProfile;
