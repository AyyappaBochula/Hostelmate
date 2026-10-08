import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Wrench,
  X,
} from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { repairsApi } from "../../services/api";
import "./RepairRequests.css";

function RepairRequests() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    hostelId: 1,
    hostel: "Sunrise Boys Hostel",
    floor: "Ground Floor",
    room: "101",
    title: "",
    category: "Plumbing",
    description: "",
    priority: "High",
    reportedBy: "Ravi Kumar (Supervisor)",
  });

  const loadRepairs = async () => {
    try {
      setLoading(true);
      const data = await repairsApi.getRepairs(1);
      setRepairs(data || []);
    } catch (err) {
      console.error("Failed to load repairs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRepairs();
  }, []);

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter a title for the repair issue.");
      return;
    }

    try {
      const created = await repairsApi.createRepair(form);
      setRepairs((prev) => [created, ...prev]);
      setShowModal(false);
      setForm({
        hostelId: 1,
        hostel: "Sunrise Boys Hostel",
        floor: "Ground Floor",
        room: "101",
        title: "",
        category: "Plumbing",
        description: "",
        priority: "High",
        reportedBy: "Ravi Kumar (Supervisor)",
      });
    } catch (err) {
      console.error("Failed to log repair:", err);
    }
  };

  return (
    <SupervisorLayout title="Repair Requests">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">MAINTENANCE</span>
          <h1>Repair & Incident Requests</h1>
          <p>
            Log maintenance problems, track repair statuses, and alert the
            owner for quick resolution.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadRepairs}
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
            Report Issue
          </button>
        </div>
      </div>

      <div className="repair-grid">
        {repairs.map((repair) => (
          <article
            key={repair.id}
            className={`repair-card priority-${(repair.priority || "low").toLowerCase()}`}
          >
            <div className="repair-card-heading">
              <span
                className={`repair-priority-pill priority-${(
                  repair.priority || "low"
                ).toLowerCase()}`}
              >
                {repair.priority === "Critical" && <AlertTriangle size={13} />}
                {repair.priority} Priority
              </span>

              <span
                className={`repair-status-pill ${
                  repair.status === "Resolved" ? "resolved" : "pending"
                }`}
              >
                {repair.status === "Resolved" ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <Clock3 size={13} />
                )}
                {repair.status}
              </span>
            </div>

            <div className="repair-category-tag">
              <Wrench size={14} />
              <span>{repair.category}</span>
            </div>

            <h3>{repair.title}</h3>
            <p>{repair.description}</p>

            <div className="repair-location">
              <span>
                {repair.hostel} • {repair.floor} • Room {repair.room}
              </span>
            </div>

            <div className="repair-footer">
              <div>
                <small>Reported On</small>
                <strong>{repair.createdAt}</strong>
              </div>
              <div>
                <small>Estimated Cost</small>
                <strong>₹{repair.estimatedCost || 500}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* REPORT REPAIR MODAL */}
      {showModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>INCIDENT REPORT</span>
                <h2>Report Repair Ticket</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Floor</span>
                  <input
                    type="text"
                    value={form.floor}
                    onChange={(e) =>
                      setForm({ ...form, floor: e.target.value })
                    }
                    placeholder="e.g. Ground Floor"
                  />
                </label>

                <label className="owner-form-field">
                  <span>Room Number</span>
                  <input
                    type="text"
                    value={form.room}
                    onChange={(e) =>
                      setForm({ ...form, room: e.target.value })
                    }
                    placeholder="e.g. 101"
                  />
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Category</span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="AC / Geyser">AC / Geyser</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Priority</span>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </label>
              </div>

              <label className="owner-form-field">
                <span>Issue Summary *</span>
                <input
                  type="text"
                  placeholder="e.g. Ceiling fan not working"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  required
                />
              </label>

              <label className="owner-form-field">
                <span>Description</span>
                <textarea
                  rows="3"
                  placeholder="Additional details..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>

              <button
                type="submit"
                className="supervisor-primary-button owner-full-button"
              >
                Submit Maintenance Report
              </button>
            </form>
          </div>
        </div>
      )}
    </SupervisorLayout>
  );
}

export default RepairRequests;
