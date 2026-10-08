import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  IndianRupee,
  Phone,
  RefreshCw,
} from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { duesApi } from "../../services/api";
import { calculateDueStatus } from "../../data/hostelDemoData";
import "./DueTracker.css";

function DueTracker() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dues, setDues] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDues = async () => {
    try {
      setLoading(true);
      const data = await duesApi.getDues(1);
      setDues(data || []);
    } catch (err) {
      console.error("Failed to load supervisor dues:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDues();
  }, []);

  const filtered = dues.filter((due) => {
    const result = calculateDueStatus(due);
    return statusFilter === "all" || result.key === statusFilter;
  });

  const critical = dues.filter(
    (due) => calculateDueStatus(due).key === "critical"
  ).length;

  const pendingAmount = dues
    .filter((due) => due.status !== "paid")
    .reduce((total, due) => total + (Number(due.amount) || 0), 0);

  return (
    <SupervisorLayout title="Rent / Due Tracker">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">RENT DUE TRACKER</span>
          <h1>Rent Dues & Follow-up</h1>
          <p>
            Monitor pending rent payments, overdue student accounts, and collect
            outstanding rent.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadDues}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="due-summary-grid">
        <Summary icon={CalendarDays} title="Hostel Dues" value={dues.length} />
        <Summary
          icon={CheckCircle2}
          title="Paid Invoices"
          value={dues.filter((d) => d.status === "paid").length}
        />
        <Summary
          icon={AlertTriangle}
          title="3+ Days Overdue"
          value={critical}
          danger
        />
        <Summary
          icon={IndianRupee}
          title="Pending Collection"
          value={`₹${pendingAmount.toLocaleString("en-IN")}`}
        />
      </div>

      <section className="supervisor-card">
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
                <th>Room</th>
                <th>Due Date</th>
                <th>Due Amount</th>
                <th>Status</th>
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
                    </td>

                    <td>Room {due.room || "101"}</td>

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
                      {due.status !== "paid" ? (
                        <a
                          href={`tel:${due.supervisorPhone || "9876543210"}`}
                          className="owner-table-button"
                          title="Call student"
                        >
                          <Phone size={14} />
                        </a>
                      ) : (
                        <span className="owner-status-tag status-paid">
                          Paid
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
    </SupervisorLayout>
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
