import { useEffect, useState } from "react";
import {
  Building2,
  Phone,
  Plus,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { hostelsApi, workersApi } from "../../services/api";
import "./OwnerDashboard.css";

const initialWorkerForm = {
  name: "",
  phone: "",
  aadhaar_no: "",
  worker_type: "Cook",
  hostelId: "",
  address: "",
  joining_date: new Date().toISOString().split("T")[0],
  salary: "15000",
};

function Workers() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialWorkerForm);
  const [loading, setLoading] = useState(true);

  const [workers, setWorkers] = useState([]);
  const [hostels, setHostels] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [workData, hostData] = await Promise.all([
        workersApi.getWorkers(),
        hostelsApi.getHostels(),
      ]);
      setWorkers(workData || []);
      setHostels(hostData || []);

      if (hostData && hostData.length > 0 && !form.hostelId) {
        setForm((prev) => ({ ...prev, hostelId: hostData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load workers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const workerTypes = [
    "Cook",
    "Assistant Cook",
    "Sweeper",
    "Washroom Cleaner",
    "Security Guard",
    "Electrician",
    "Plumber",
    "Maintenance Staff",
    "Hostel Manager",
    "Other",
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddWorker = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) {
      alert("Please enter the worker's name and mobile number.");
      return;
    }

    const selectedHost = hostels.find((h) => h.id === Number(form.hostelId));

    try {
      const created = await workersApi.createWorker({
        ...form,
        hostel: selectedHost ? selectedHost.name : "Hostel",
      });

      setWorkers((prev) => [created, ...prev]);
      setForm(initialWorkerForm);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to add worker:", err);
      alert("Error adding worker.");
    }
  };

  const filteredWorkers = workers.filter((worker) =>
    `${worker.name} ${worker.worker_type || ""} ${worker.hostel || ""} ${
      worker.phone || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <OwnerLayout title="Workers">
      <div className="owner-page-heading">
        <div>
          <span>STAFF & WORKERS</span>
          <h1>Hostel Workers</h1>
          <p>
            Manage cooks, sweepers, security guards and maintenance workers
            across your hostels.
          </p>
        </div>

        <div className="owner-welcome-actions">
          <button
            type="button"
            className="owner-secondary-button"
            onClick={loadData}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="owner-primary-button"
            onClick={() => setShowModal(true)}
          >
            <Plus size={18} />
            Add Worker
          </button>
        </div>
      </div>

      <section className="owner-page-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search worker by name, role, hostel or mobile..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Role / Designation</th>
                <th>Assigned Hostel</th>
                <th>Mobile Number</th>
                <th>Monthly Salary</th>
                <th>Joining Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkers.map((worker) => (
                <tr key={worker.id}>
                  <td>
                    <strong>{worker.name}</strong>
                    <small>{worker.address || "Visakhapatnam"}</small>
                  </td>

                  <td>
                    <span className="owner-room-pill">
                      {worker.worker_type || "Staff"}
                    </span>
                  </td>

                  <td>
                    <span className="owner-table-hostel-tag">
                      <Building2 size={13} />
                      {worker.hostel || "Sunrise Boys Hostel"}
                    </span>
                  </td>

                  <td>
                    <span className="owner-phone-text">
                      <Phone size={12} />
                      {worker.phone}
                    </span>
                  </td>

                  <td>
                    <strong>₹{Number(worker.salary || 15000).toLocaleString("en-IN")}</strong>
                  </td>

                  <td>{worker.joining_date || "2026-02-01"}</td>

                  <td>
                    <span
                      className={`owner-table-status ${
                        worker.status === "active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {worker.status || "active"}
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
                <span>STAFF ONBOARDING</span>
                <h2>Add Hostel Worker</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddWorker}>
              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Worker Full Name *</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Ramesh Appa Rao"
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
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Role / Worker Type *</span>
                  <select
                    name="worker_type"
                    value={form.worker_type}
                    onChange={handleChange}
                  >
                    {workerTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Assigned Hostel *</span>
                  <select
                    name="hostelId"
                    value={form.hostelId}
                    onChange={handleChange}
                    required
                  >
                    {hostels.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name || h.hostel_name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Monthly Salary (₹)</span>
                  <input
                    type="number"
                    name="salary"
                    placeholder="e.g. 15000"
                    value={form.salary}
                    onChange={handleChange}
                  />
                </label>

                <label className="owner-form-field">
                  <span>Joining Date</span>
                  <input
                    type="date"
                    name="joining_date"
                    value={form.joining_date}
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
                <span>Residential Address</span>
                <input
                  type="text"
                  name="address"
                  placeholder="Local residential address"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Register Worker
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

export default Workers;
