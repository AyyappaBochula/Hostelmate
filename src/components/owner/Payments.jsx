import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  Search,
  WalletCards,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { hostelsApi, paymentsApi, studentsApi } from "../../services/api";
import "./Payments.css";

const initialPaymentForm = {
  hostel_id: "",
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
  const [form, setForm] = useState(initialPaymentForm);
  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [payData, hostData, studData] = await Promise.all([
        paymentsApi.getPayments(),
        hostelsApi.getHostels(),
        studentsApi.getStudents(),
      ]);
      setPayments(payData || []);
      setHostels(hostData || []);
      setStudents(studData || []);

      if (hostData && hostData.length > 0 && !form.hostel_id) {
        setForm((prev) => ({ ...prev, hostel_id: hostData[0].id }));
      }
    } catch (err) {
      console.error("Failed to load payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const availableStudents = students.filter(
    (student) => Number(student.hostel_id) === Number(form.hostel_id)
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddPayment = async (event) => {
    event.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const selectedStud = students.find((s) => s.id === Number(form.student_id));
    const selectedHost = hostels.find((h) => h.id === Number(form.hostel_id));

    try {
      const newPayment = await paymentsApi.recordPayment({
        ...form,
        student: selectedStud ? selectedStud.name : "Student",
        hostel: selectedHost ? selectedHost.name : "Hostel",
      });

      setPayments((prev) => [newPayment, ...prev]);
      setShowModal(false);
      setForm(initialPaymentForm);
    } catch (err) {
      console.error("Failed to record payment:", err);
      alert("Error recording payment.");
    }
  };

  const totalCollected = useMemo(
    () => payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  const upiCollected = useMemo(
    () =>
      payments
        .filter((p) => (p.payment_mode || p.mode || "").toUpperCase() === "UPI")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  const cashCollected = useMemo(
    () =>
      payments
        .filter((p) => (p.payment_mode || p.mode || "").toUpperCase() === "CASH")
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    [payments]
  );

  const filteredPayments = payments.filter((payment) =>
    `${payment.student || ""} ${payment.hostel || ""} ${payment.receipt_no || ""} ${
      payment.payment_mode || ""
    }`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <OwnerLayout title="Payments">
      <div className="owner-page-heading">
        <div>
          <span>COLLECTIONS & REVENUE</span>
          <h1>Payments & Receipts</h1>
          <p>
            Track student rent payments, generate transaction receipts, and
            monitor monthly revenue.
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
            Record Payment
          </button>
        </div>
      </div>

      {/* SUMMARY STAT CARDS */}
      <div className="owner-stat-grid">
        <div className="owner-stat-card variant-blue">
          <div className="owner-stat-icon">
            <WalletCards size={22} />
          </div>
          <div className="owner-stat-main">
            <span>Total Collection</span>
            <strong>₹{totalCollected.toLocaleString("en-IN")}</strong>
            <small>Across all hostels</small>
          </div>
        </div>

        <div className="owner-stat-card variant-emerald">
          <div className="owner-stat-icon">
            <ReceiptIndianRupee size={22} />
          </div>
          <div className="owner-stat-main">
            <span>UPI / Online</span>
            <strong>₹{upiCollected.toLocaleString("en-IN")}</strong>
            <small>Digital transfers</small>
          </div>
        </div>

        <div className="owner-stat-card variant-amber">
          <div className="owner-stat-icon">
            <CircleDollarSign size={22} />
          </div>
          <div className="owner-stat-main">
            <span>Cash Collection</span>
            <strong>₹{cashCollected.toLocaleString("en-IN")}</strong>
            <small>Collected by supervisors</small>
          </div>
        </div>

        <div className="owner-stat-card variant-indigo">
          <div className="owner-stat-icon">
            <CreditCard size={22} />
          </div>
          <div className="owner-stat-main">
            <span>Total Receipts</span>
            <strong>{payments.length}</strong>
            <small>Issued invoices</small>
          </div>
        </div>
      </div>

      <section className="owner-page-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search payment by student, receipt number, hostel or mode..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Student</th>
                <th>Hostel</th>
                <th>Payment Type</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>
                    <strong>{payment.receipt_no || `HST-2026-${payment.id}`}</strong>
                    <small>{payment.payment_month || "October 2026"}</small>
                  </td>

                  <td>
                    <strong>{payment.student}</strong>
                  </td>

                  <td>{payment.hostel}</td>

                  <td>{payment.type || "Rent"}</td>

                  <td>
                    <strong>₹{Number(payment.amount).toLocaleString("en-IN")}</strong>
                  </td>

                  <td>
                    <span className="owner-room-pill">
                      {payment.payment_mode || payment.mode || "UPI"}
                    </span>
                  </td>

                  <td>{payment.payment_date}</td>

                  <td>
                    <span
                      className={`owner-status-tag ${
                        payment.status === "Paid"
                          ? "status-paid"
                          : "status-partial"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* RECORD PAYMENT MODAL */}
      {showModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>PAYMENT RECEIPT</span>
                <h2>Record Payment</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddPayment}>
              <label className="owner-form-field">
                <span>Select Hostel *</span>
                <select
                  name="hostel_id"
                  value={form.hostel_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Hostel --</option>
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name || h.hostel_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="owner-form-field">
                <span>Select Student *</span>
                <select
                  name="student_id"
                  value={form.student_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose Student --</option>
                  {availableStudents.map((s) => (
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
                    <option value="Maintenance">Maintenance Charge</option>
                    <option value="Advance">Advance Rent</option>
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Amount Paid (₹) *</span>
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
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking / NEFT</option>
                    <option value="Debit Card">Debit / Credit Card</option>
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
                  placeholder="e.g. UPI/1239840294"
                  value={form.reference_no}
                  onChange={handleChange}
                />
              </label>

              <label className="owner-form-field">
                <span>Remarks / Notes</span>
                <input
                  type="text"
                  name="remarks"
                  placeholder="Optional transaction remarks"
                  value={form.remarks}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Generate Payment Receipt
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

export default Payments;
