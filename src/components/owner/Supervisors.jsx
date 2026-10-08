import { useEffect, useState } from "react";
import {
  Building2,
  Mail,
  Plus,
  Power,
  RefreshCw,
  Search,
  Send,
  UserRoundCog,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { hostelsApi, supervisorsApi } from "../../services/api";
import "./Supervisors.css";

function Supervisors() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [hostelId, setHostelId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [supervisors, setSupervisors] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [supData, hostData] = await Promise.all([
        supervisorsApi.getSupervisors(),
        hostelsApi.getHostels(),
      ]);
      setSupervisors(supData || []);
      setHostels(hostData || []);
      if (hostData && hostData.length > 0) {
        setHostelId(hostData[0].id);
      }
    } catch (err) {
      console.error("Failed to load supervisors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendInvitation = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    try {
      const newSup = await supervisorsApi.inviteSupervisor({
        email,
        name: name || "Invited Supervisor",
        hostelId,
      });
      setSupervisors((prev) => [newSup, ...prev]);
      setEmail("");
      setName("");
      setMessage("Invitation sent successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Failed to send invite:", err);
      alert("Error sending invitation.");
    }
  };

  const toggleStatus = async (id) => {
    const updated = await supervisorsApi.toggleStatus(id);
    if (updated) {
      setSupervisors((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: updated.status } : s))
      );
    }
  };

  const filteredSupervisors = supervisors.filter((supervisor) =>
    `${supervisor.name} ${supervisor.email} ${supervisor.hostel || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <OwnerLayout title="Supervisors">
      <div className="owner-page-heading">
        <div>
          <span>TEAM MANAGEMENT</span>
          <h1>Supervisors</h1>
          <p>
            Invite supervisors and assign them to manage your hostels, students,
            and collections.
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
        </div>
      </div>

      {message && (
        <div className="owner-success-banner">
          <span>✓ {message}</span>
        </div>
      )}

      <div className="owner-supervisor-layout">
        {/* INVITE SUPERVISOR CARD */}
        <section className="owner-page-card">
          <div className="owner-section-heading">
            <div>
              <span>INVITATION</span>
              <h2>Invite Supervisor</h2>
            </div>
            <UserRoundCog size={25} className="owner-icon-accent" />
          </div>

          <form className="owner-invite-form" onSubmit={sendInvitation}>
            <label className="owner-form-field">
              <span>Supervisor Full Name</span>
              <input
                type="text"
                placeholder="e.g. Ramesh Naidu"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <label className="owner-form-field">
              <span>Email Address</span>
              <div className="owner-icon-input">
                <input
                  type="email"
                  placeholder="supervisor@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </label>

            <label className="owner-form-field">
              <span>Assign Hostel</span>
              <select
                value={hostelId}
                onChange={(e) => setHostelId(e.target.value)}
              >
                {hostels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name || h.hostel_name} ({h.city})
                  </option>
                ))}
              </select>
            </label>

            <button type="submit" className="owner-primary-button">
              <Send size={16} />
              Send Invitation Link
            </button>
          </form>

          <p className="owner-helper">
            The supervisor will receive an invitation link to set their password
            and access their assigned hostel portal.
          </p>
        </section>

        {/* SUPERVISORS TABLE CARD */}
        <section className="owner-page-card">
          <div className="owner-search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search supervisor by name, email or hostel..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="owner-table-wrapper">
            <table className="owner-table">
              <thead>
                <tr>
                  <th>Supervisor</th>
                  <th>Mobile</th>
                  <th>Assigned Hostel</th>
                  <th>Invitation</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor.id}>
                    <td>
                      <strong>{supervisor.name}</strong>
                      <small>{supervisor.email}</small>
                    </td>

                    <td>{supervisor.phone || "-"}</td>

                    <td>
                      <span className="owner-table-hostel-tag">
                        <Building2 size={13} />
                        {supervisor.hostel || "Not assigned"}
                      </span>
                    </td>

                    <td>
                      <StatusBadge value={supervisor.invite_status} />
                    </td>

                    <td>
                      <StatusBadge value={supervisor.status} />
                    </td>

                    <td>
                      <button
                        type="button"
                        className="owner-table-button"
                        title={
                          supervisor.status === "active"
                            ? "Deactivate supervisor"
                            : "Activate supervisor"
                        }
                        onClick={() => toggleStatus(supervisor.id)}
                      >
                        <Power size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </OwnerLayout>
  );
}

function StatusBadge({ value }) {
  const isOk = value === "active" || value === "accepted";
  return (
    <span
      className={`owner-table-status ${
        isOk ? "status-active" : "status-inactive"
      }`}
    >
      {value}
    </span>
  );
}

export default Supervisors;
