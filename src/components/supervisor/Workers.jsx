import { useEffect, useState } from "react";
import { Phone, Plus, RefreshCw, Search, UserRound, X } from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { workersApi } from "../../services/api";
import "./Workers.css";

const initialForm = {
  name: "",
  phone: "",
  aadhaar_no: "",
  worker_type: "Cook",
  hostelId: 1,
  hostel: "Sunrise Boys Hostel",
  address: "",
  joining_date: new Date().toISOString().split("T")[0],
  salary: "15000",
};

function Workers() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [workers, setWorkers] = useState([]);

  const loadWorkers = async () => {
    try {
      setLoading(true);
      const data = await workersApi.getWorkers(1);
      setWorkers(data || []);
    } catch (err) {
      console.error("Failed to load supervisor workers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Please fill in worker name and mobile number.");
      return;
    }

    try {
      const created = await workersApi.createWorker(form);
      setWorkers((prev) => [created, ...prev]);
      setShowModal(false);
      setForm(initialForm);
    } catch (err) {
      console.error("Failed to add worker:", err);
    }
  };

  const filtered = workers.filter((w) =>
    `${w.name} ${w.worker_type || ""} ${w.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <SupervisorLayout title="Workers">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">HOSTEL STAFF</span>
          <h1>Hostel Workers</h1>
          <p>
            Manage cooks, cleaners, security guards and maintenance personnel on
            duty at <strong>Sunrise Boys Hostel</strong>.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadWorkers}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="supervisor-primary-button"
            onClick={() => setShowModal(true)}
          >
            <Plus size={17} />
            Add Worker
          </button>
        </div>
      </div>

      <section className="supervisor-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search workers by name, role or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Role / Skill</th>
                <th>Mobile Number</th>
                <th>Monthly Pay</th>
                <th>Joining Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((w) => (
                <tr key={w.id}>
                  <td>
                    <strong>{w.name}</strong>
                    <small>{w.address || "Visakhapatnam"}</small>
                  </td>

                  <td>
                    <span className="owner-room-pill">
                      {w.worker_type || "Staff"}
                    </span>
                  </td>

                  <td>
                    <span className="owner-phone-text">
                      <Phone size={12} />
                      {w.phone}
                    </span>
                  </td>

                  <td>
                    <strong>₹{Number(w.salary || 15000).toLocaleString("en-IN")}</strong>
                  </td>

                  <td>{w.joining_date}</td>

                  <td>
                    <span
                      className={`owner-table-status ${
                        w.status === "active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {w.status || "active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ADD WORKER MODAL */}
      {showModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>ONBOARDING</span>
                <h2>Add Staff Worker</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddWorker}>
              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Full Name *</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Worker name"
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
                    placeholder="10-digit mobile"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Worker Role *</span>
                  <select
                    name="worker_type"
                    value={form.worker_type}
                    onChange={handleChange}
                  >
                    <option value="Cook">Cook</option>
                    <option value="Assistant Cook">Assistant Cook</option>
                    <option value="Sweeper">Sweeper</option>
                    <option value="Washroom Cleaner">Washroom Cleaner</option>
                    <option value="Security">Security Guard</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Maintenance">Maintenance Staff</option>
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Monthly Salary (₹)</span>
                  <input
                    type="number"
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="owner-form-field">
                <span>Aadhaar Number</span>
                <input
                  type="text"
                  name="aadhaar_no"
                  placeholder="12-digit Aadhaar ID"
                  value={form.aadhaar_no}
                  onChange={handleChange}
                />
              </label>

              <label className="owner-form-field">
                <span>Address</span>
                <input
                  type="text"
                  name="address"
                  placeholder="Residential address"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="supervisor-primary-button owner-full-button"
              >
                Register Worker
              </button>
            </form>
          </div>
        </div>
      )}
    </SupervisorLayout>
  );
}

export default Workers;
