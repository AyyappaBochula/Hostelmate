import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  CreditCard,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  Search,
  WalletCards,
  X,
} from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { paymentsApi, studentsApi } from "../../services/api";
import "./Payments.css";

const initialForm = {
  student_id: "",
  payment_type: "Rent",
  payment_month: "October 2026",
  amount: "",
  payment_date: new Date().toISOString().split("T")[0],
  payment_mode: "UPI",
  reference_no: "",
  remarks: "",
};

function Payments() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [payData, studData] = await Promise.all([
        paymentsApi.getPayments(),
        studentsApi.getStudents(1),
      ]);
      setPayments(
        (payData || []).filter(
          (p) => p.hostelId === 1 || p.hostel === "Sunrise Boys Hostel"
        )
      );
      setStudents(studData || []);
    } catch (err) {
      console.error("Failed to load supervisor payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    const stud = students.find((s) => s.id === Number(form.student_id));
    try {
      const created = await paymentsApi.recordPayment({
        ...form,
        hostelId: 1,
        hostel: "Sunrise Boys Hostel",
        student: stud ? stud.name : "Student",
      });

      setPayments((prev) => [created, ...prev]);
      setShowModal(false);
      setForm(initialForm);
    } catch (err) {
      console.error("Failed to record payment:", err);
      alert("Error recording payment.");
    }
  };

  const totalCollected = payments.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0
  );

  const filtered = payments.filter((p) =>
    `${p.student} ${p.receipt_no || ""} ${p.payment_mode || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <SupervisorLayout title="Payments">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">COLLECTIONS</span>
          <h1>Rent Collections</h1>
          <p>
            Record student monthly rent, generate instant payment slips, and
            track collections.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadData}
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
            Record Payment
          </button>
        </div>
      </div>

      <div className="supervisor-stat-grid">
        <div className="supervisor-stat-card variant-blue">
          <span className="supervisor-stat-icon">
            <WalletCards size={22} />
          </span>
          <div className="supervisor-stat-main">
            <span>Total Collection</span>
            <strong>₹{totalCollected.toLocaleString("en-IN")}</strong>
            <small>This Month</small>
          </div>
        </div>

        <div className="supervisor-stat-card variant-emerald">
          <span className="supervisor-stat-icon">
            <ReceiptIndianRupee size={22} />
          </span>
          <div className="supervisor-stat-main">
            <span>UPI / Online</span>
            <strong>
              ₹
              {payments
                .filter((p) => (p.payment_mode || p.mode) === "UPI")
                .reduce((s, p) => s + (Number(p.amount) || 0), 0)
                .toLocaleString("en-IN")}
            </strong>
            <small>PhonePe / GPay</small>
          </div>
        </div>

        <div className="supervisor-stat-card variant-amber">
          <span className="supervisor-stat-icon">
            <CircleDollarSign size={22} />
          </span>
          <div className="supervisor-stat-main">
            <span>Cash Handover</span>
            <strong>
              ₹
              {payments
                .filter((p) => (p.payment_mode || p.mode) === "Cash")
                .reduce((s, p) => s + (Number(p.amount) || 0), 0)
                .toLocaleString("en-IN")}
            </strong>
            <small>Cash in hand</small>
          </div>
        </div>

        <div className="supervisor-stat-card variant-indigo">
          <span className="supervisor-stat-icon">
            <CreditCard size={22} />
          </span>
          <div className="supervisor-stat-main">
            <span>Receipts Issued</span>
            <strong>{payments.length}</strong>
            <small>Payment slips</small>
          </div>
        </div>
      </div>

      <section className="supervisor-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search payments by student name, receipt number or mode..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Receipt ID</th>
                <th>Student</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.receipt_no || `HST-2026-${p.id}`}</strong>
                    <small>{p.payment_month || "October 2026"}</small>
                  </td>

                  <td>
                    <strong>{p.student}</strong>
                  </td>

                  <td>{p.type || "Rent"}</td>

                  <td>
                    <strong>₹{Number(p.amount).toLocaleString("en-IN")}</strong>
                  </td>

                  <td>
                    <span className="owner-room-pill">
                      {p.payment_mode || p.mode || "UPI"}
                    </span>
                  </td>

                  <td>{p.payment_date}</td>

                  <td>
                    <span
                      className={`owner-status-tag ${
                        p.status === "Paid" ? "status-paid" : "status-partial"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RECORD MODAL */}
      {showModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>PAYMENT RECEIPT</span>
                <h2>Record Student Payment</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRecordPayment}>
              <label className="owner-form-field">
                <span>Select Student *</span>
                <select
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Room {s.room_number || "101"})
                    </option>
                  ))}
                </select>
              </label>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Payment Type</span>
                  <select
                    name="payment_type"
                    value={form.payment_type}
                    onChange={handleChange}
                  >
                    <option value="Rent">Monthly Rent</option>
                    <option value="Deposit">Security Deposit</option>
                    <option value="Advance">Advance</option>
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Amount (₹) *</span>
                  <input
                    type="number"
                    name="amount"
                    placeholder="e.g. 5500"
                    value={form.amount}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Payment Mode</span>
                  <select
                    name="payment_mode"
                    value={form.payment_mode}
                    onChange={handleChange}
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Payment Date</span>
                  <input
                    type="date"
                    name="payment_date"
                    value={form.payment_date}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="owner-form-field">
                <span>Reference / Transaction ID</span>
                <input
                  type="text"
                  name="reference_no"
                  placeholder="e.g. UPI/2390481029"
                  value={form.reference_no}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="supervisor-primary-button owner-full-button"
              >
                Save & Issue Receipt
              </button>
            </form>
          </div>
        </div>
      )}
    </SupervisorLayout>
  );
}

export default Payments;
