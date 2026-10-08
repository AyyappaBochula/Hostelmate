import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  MessageSquare,
  Phone,
  RefreshCw,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import HostelFilter from "../common/HostelFilter";
import { duesApi, hostelsApi } from "../../services/api";
import { calculateDueStatus } from "../../data/hostelDemoData";
import "./DueTracker.css";

function DueTracker() {
  const [selectedHostel, setSelectedHostel] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [messageDue, setMessageDue] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [dues, setDues] = useState([]);
  const [hostels, setHostels] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [duesData, hostData] = await Promise.all([
        duesApi.getDues(),
        hostelsApi.getHostels(),
      ]);
      setDues(duesData || []);
      setHostels(hostData || []);
    } catch (err) {
      console.error("Failed to load dues data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const hostelDues = useMemo(
    () =>
      dues.filter(
        (due) =>
          selectedHostel === "all" || due.hostelId === Number(selectedHostel)
      ),
    [dues, selectedHostel]
  );

  const filtered = hostelDues.filter((due) => {
    const result = calculateDueStatus(due);
    return statusFilter === "all" || result.key === statusFilter;
  });

  const critical = hostelDues.filter(
    (due) => calculateDueStatus(due).key === "critical"
  ).length;

  const pendingAmount = hostelDues
    .filter((due) => due.status !== "paid")
    .reduce((total, due) => total + (Number(due.amount) || 0), 0);

  const openMessage = (due) => {
    setMessageDue(due);
    setMessage(
      `Hello ${due.supervisor}, please follow up with ${due.student} regarding the pending hostel rent of ₹${Number(
        due.amount
      ).toLocaleString("en-IN")} due on ${due.dueDate} for ${due.hostel}.`
    );
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      await duesApi.sendReminder(messageDue.id, message);
      alert(
        `Reminder dispatched to supervisor ${messageDue.supervisor} (${messageDue.supervisorPhone}):\n\n${message}`
      );
      setMessageDue(null);
      setMessage("");
    } catch (err) {
      console.error("Failed to send reminder:", err);
    }
  };

  return (
    <OwnerLayout title="Rent / Due Tracker">
      <div className="owner-page-heading">
        <div>
          <span>PAYMENT FOLLOW-UP</span>
          <h1>Rent / Due Tracker</h1>
          <p>
            Monitor pending student rent dues, overdue accounts, and initiate
            supervisor follow-ups.
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

      <HostelFilter
        hostels={hostels}
        selectedHostel={selectedHostel}
        onChange={setSelectedHostel}
      />

      <div className="due-summary-grid">
        <Summary
          icon={CalendarDays}
          title="Total Dues"
          value={hostelDues.length}
        />

        <Summary
          icon={CheckCircle2}
          title="Paid Invoices"
          value={hostelDues.filter((due) => due.status === "paid").length}
        />

        <Summary
          icon={AlertTriangle}
          title="3+ Days Overdue"
          value={critical}
          danger
        />

        <Summary
          icon={IndianRupee}
          title="Total Pending Amount"
          value={`₹${pendingAmount.toLocaleString("en-IN")}`}
        />
      </div>

      <section className="owner-page-card">
        <div className="due-filter-buttons">
          {[
            ["all", "All Records"],
            ["upcoming", "Upcoming"],
            ["today", "Due Today"],
            ["paid", "Paid"],
            ["warning", "1-2 Days Overdue"],
            ["critical", "3+ Days Overdue"],
          ].map(([key, label]) => (
            <button
              type="button"
              key={key}
              className={`due-filter-btn ${statusFilter === key ? "active" : ""}`}
              onClick={() => setStatusFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Hostel</th>
                <th>Due Date</th>
                <th>Due Amount</th>
                <th>Overdue Status</th>
                <th>Supervisor Contact</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((due) => {
                const result = calculateDueStatus(due);

                return (
                  <tr
                    key={due.id}
                    className={
                      result.key === "critical" ? "critical-due-row" : ""
                    }
                  >
                    <td>
                      <strong>{due.student}</strong>
                      <small>Room {due.room || "101"}</small>
                    </td>

                    <td>{due.hostel}</td>
                    <td>{due.dueDate}</td>

                    <td>
                      <strong>₹{Number(due.amount).toLocaleString("en-IN")}</strong>
                    </td>

                    <td>
                      <span className={`due-status-badge due-${result.key}`}>
                        {result.label}
                      </span>
                    </td>

                    <td>
                      <strong>{due.supervisor}</strong>
                      <small>
                        <Phone size={11} /> {due.supervisorPhone}
                      </small>
                    </td>

                    <td>
                      {due.status !== "paid" ? (
                        <button
                          type="button"
                          className="message-supervisor-button"
                          onClick={() => openMessage(due)}
                        >
                          <MessageSquare size={13} />
                          Message
                        </button>
                      ) : (
                        <span className="owner-status-tag status-paid">
                          Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* SUPERVISOR MESSAGE MODAL */}
      {messageDue && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>SUPERVISOR FOLLOW-UP</span>
                <h2>Message {messageDue.supervisor}</h2>
              </div>

              <button type="button" onClick={() => setMessageDue(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="message-supervisor-details">
              <strong>{messageDue.student}</strong>
              <span>
                {messageDue.hostel} • ₹
                {Number(messageDue.amount).toLocaleString("en-IN")} Due
              </span>
            </div>

            <label className="owner-form-field">
              <span>Follow-up Message</span>
              <textarea
                rows="4"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>

            <button
              type="button"
              className="owner-primary-button owner-full-button"
              onClick={sendMessage}
            >
              <MessageSquare size={16} />
              Dispatch Reminder to Supervisor
            </button>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

function Summary({ icon: Icon, title, value, danger = false }) {
  return (
    <div className={`due-summary-card ${danger ? "danger-card" : ""}`}>
      <span>
        <Icon size={20} />
      </span>
      <div>
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default DueTracker;
