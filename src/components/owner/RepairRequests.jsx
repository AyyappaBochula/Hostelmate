import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock3,
  Plus,
  RefreshCw,
  Wrench,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import HostelFilter from "../common/HostelFilter";
import { hostelsApi, repairsApi } from "../../services/api";
import "./RepairRequests.css";

function RepairRequests() {
  const [selectedHostel, setSelectedHostel] = useState("all");
  const [repairs, setRepairs] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    hostelId: "",
    floor: "Ground Floor",
    room: "101",
    title: "",
    category: "Plumbing",
    description: "",
    priority: "High",
    reportedBy: "Owner",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [repData, hostData] = await Promise.all([
        repairsApi.getRepairs(),
        hostelsApi.getHostels(),
      ]);
      setRepairs(repData || []);
      setHostels(hostData || []);
      if (hostData && hostData.length > 0 && !form.hostelId) {
        setForm((prev) => ({ ...prev, hostelId: hostData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load repairs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return [...repairs]
      .filter(
        (repair) =>
          selectedHostel === "all" ||
          repair.hostelId === Number(selectedHostel)
      )
      .sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority));
  }, [repairs, selectedHostel]);

  const changeStatus = async (id, status) => {
    await repairsApi.updateRepairStatus(id, status);
    setRepairs((prev) =>
      prev.map((repair) =>
        repair.id === id ? { ...repair, status } : repair
      )
    );
  };

  const handleCreateRepair = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Please enter a repair title.");
      return;
    }

    const host = hostels.find((h) => h.id === Number(form.hostelId));
    try {
      const created = await repairsApi.createRepair({
        ...form,
        hostel: host ? host.name : "Hostel",
      });
      setRepairs((prev) => [created, ...prev]);
      setShowAddModal(false);
      setForm({
        hostelId: hostels[0]?.id || "",
        floor: "Ground Floor",
        room: "101",
        title: "",
        category: "Plumbing",
        description: "",
        priority: "High",
        reportedBy: "Owner",
      });
    } catch (err) {
      console.error("Failed to add repair ticket:", err);
    }
  };

  return (
    <OwnerLayout title="Repair Requests">
      <div className="owner-page-heading">
        <div>
          <span>HOSTEL MAINTENANCE & TICKETING</span>
          <h1>Repair & Maintenance Requests</h1>
          <p>
            Track and resolve repair issues reported across your properties with
            priority sorting.
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
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>
      </div>

      <HostelFilter
        hostels={hostels}
        selectedHostel={selectedHostel}
        onChange={setSelectedHostel}
      />

      {loading ? (
        <p className="owner-empty-text">Loading maintenance tickets...</p>
      ) : filtered.length === 0 ? (
        <p className="owner-empty-text">No repair requests found.</p>
      ) : (
        <div className="repair-grid">
          {filtered.map((repair) => (
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
                  {repair.priority || "Medium"} Priority
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
                <span>{repair.category || "General"}</span>
              </div>

              <h3>{repair.title}</h3>
              <p>{repair.description}</p>

              <div className="repair-location">
                <Building2 size={14} />
                <span>
                  {repair.hostel} • {repair.floor} • Room {repair.room}
                </span>
              </div>

              <div className="repair-footer">
                <div>
                  <small>Reported By</small>
                  <strong>{repair.reportedBy}</strong>
                </div>

                <div>
                  <small>Date Logged</small>
                  <strong>{repair.createdAt}</strong>
                </div>
              </div>

              <label className="repair-status-select">
                <span>Update Ticket Status</span>
                <select
                  value={repair.status}
                  onChange={(event) =>
                    changeStatus(repair.id, event.target.value)
                  }
                >
                  <option value="Reported">Reported</option>
                  <option value="Acknowledged">Acknowledged</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </label>
            </article>
          ))}
        </div>
      )}

      {/* NEW TICKET MODAL */}
      {showAddModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>MAINTENANCE TICKET</span>
                <h2>Report Repair Issue</h2>
              </div>
              <button type="button" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateRepair}>
              <label className="owner-form-field">
                <span>Select Hostel *</span>
                <select
                  value={form.hostelId}
                  onChange={(e) =>
                    setForm({ ...form, hostelId: e.target.value })
                  }
                  required
                >
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name || h.hostel_name}
                    </option>
                  ))}
                </select>
              </label>

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
                  <span>Issue Category</span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Wi-Fi / Internet">Wi-Fi / Internet</option>
                    <option value="Cleaning">Cleaning & Hygiene</option>
                    <option value="Appliance / AC">Appliance / AC / Geyser</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Priority Level</span>
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
                <span>Issue Title *</span>
                <input
                  type="text"
                  placeholder="e.g. Tap leaking continuously in washroom"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </label>

              <label className="owner-form-field">
                <span>Detailed Description</span>
                <textarea
                  rows="3"
                  placeholder="Describe the issue in detail..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Create Maintenance Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

function priorityValue(priority) {
  const values = {
    Low: 1,
    Medium: 2,
    High: 3,
    Critical: 4,
  };
  return values[priority] || 0;
}

export default RepairRequests;
