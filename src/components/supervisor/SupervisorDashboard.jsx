import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BedDouble,
  Building2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Plus,
  ReceiptIndianRupee,
  RefreshCw,
  TrendingUp,
  UserPlus,
  UserRound,
  UserRoundCog,
  Users,
  WalletCards,
  Wrench,
} from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { dashboardApi } from "../../services/api";
import "./SupervisorDashboard.css";

function SupervisorDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    assignedHostels: 1,
    hostelName: "Sunrise Boys Hostel",
    totalStudents: 7,
    activeStudents: 7,
    totalBeds: 12,
    occupiedBeds: 8,
    availableBeds: 3,
    workers: 3,
    todayCollection: 11000,
    monthlyCollection: 38500,
    pendingDues: 11000,
    recentStudents: [],
    recentPayments: [],
  });

  const loadSupervisorStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getSupervisorDashboardStats(1);
      if (res) {
        setData(res);
      }
    } catch (err) {
      console.error("Failed to load supervisor stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSupervisorStats();
  }, []);

  const occupancyPercentage = data.totalBeds
    ? Math.round((data.occupiedBeds / data.totalBeds) * 100)
    : 67;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <SupervisorLayout title="Dashboard">
      {/* WELCOME SECTION */}
      <section className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">
            <TrendingUp size={14} />
            HOSTEL SUPERVISOR PORTAL
          </span>

          <h1>
            Welcome back, <strong>Ravi!</strong>
          </h1>

          <p>
            Managing <strong>{data.hostelName || "Sunrise Boys Hostel"}</strong>{" "}
            • Real-time occupancy, student admissions, and collections.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadSupervisorStats}
            title="Refresh statistics"
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>

          <Link to="/supervisor/students" className="supervisor-primary-button">
            <UserPlus size={17} />
            Add Student
          </Link>
        </div>
      </section>

      {/* TOP 4 STAT CARDS */}
      <div className="supervisor-stat-grid">
        <StatCard
          icon={Building2}
          title="Assigned Hostel"
          value={data.assignedHostels}
          text={data.hostelName || "Sunrise Boys"}
          variant="blue"
        />

        <StatCard
          icon={Users}
          title="Hostel Students"
          value={data.totalStudents}
          text={`${data.activeStudents} active residents`}
          variant="emerald"
        />

        <StatCard
          icon={BedDouble}
          title="Available Beds"
          value={data.availableBeds}
          text={`${data.occupiedBeds} occupied / ${data.totalBeds} total`}
          variant="indigo"
        />

        <StatCard
          icon={UserRoundCog}
          title="Active Workers"
          value={data.workers}
          text="Staff on duty"
          variant="amber"
        />
      </div>

      {/* OCCUPANCY & PAYMENT SUMMARY */}
      <div className="supervisor-dashboard-grid">
        {/* BED OCCUPANCY */}
        <section className="supervisor-card">
          <div className="supervisor-card-heading">
            <div>
              <span className="supervisor-card-eyebrow">BED OCCUPANCY</span>
              <h2>Room & Bed Overview</h2>
            </div>
            <Link
              to="/supervisor/bed-availability"
              className="supervisor-card-action"
            >
              Bed Matrix
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="supervisor-occupancy">
            {/* RADIAL PROGRESS GAUGE */}
            <div className="supervisor-radial-gauge-container">
              <svg className="supervisor-radial-svg" viewBox="0 0 120 120">
                <circle
                  className="supervisor-radial-bg"
                  cx="60"
                  cy="60"
                  r="48"
                  strokeWidth="10"
                />
                <circle
                  className="supervisor-radial-progress"
                  cx="60"
                  cy="60"
                  r="48"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={
                    2 * Math.PI * 48 * (1 - occupancyPercentage / 100)
                  }
                />
              </svg>
              <div className="supervisor-radial-text">
                <strong>{occupancyPercentage}%</strong>
                <span>Occupied</span>
              </div>
            </div>

            <div className="supervisor-mini-stats">
              <MiniStat title="Total Beds" value={data.totalBeds} />
              <MiniStat title="Occupied Beds" value={data.occupiedBeds} />
              <MiniStat title="Available Beds" value={data.availableBeds} />
              <MiniStat title="Active Students" value={data.activeStudents} />
            </div>
          </div>
        </section>

        {/* PAYMENT & COLLECTION SUMMARY */}
        <section className="supervisor-card">
          <div className="supervisor-card-heading">
            <div>
              <span className="supervisor-card-eyebrow">FINANCES</span>
              <h2>Collection Summary</h2>
            </div>
            <Link to="/supervisor/payments" className="supervisor-card-action">
              Transactions
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="supervisor-finance-list">
            <FinanceItem
              icon={CircleDollarSign}
              title="Today's Collection"
              value={formatCurrency(data.todayCollection)}
              type="success"
            />

            <FinanceItem
              icon={WalletCards}
              title="This Month's Total"
              value={formatCurrency(data.monthlyCollection)}
              type="info"
            />

            <FinanceItem
              icon={Clock3}
              title="Pending Student Dues"
              value={formatCurrency(data.pendingDues)}
              type="warning"
            />
          </div>
        </section>
      </div>

      {/* RECENT STUDENTS & RECENT PAYMENTS */}
      <div className="supervisor-dashboard-grid">
        {/* RECENT STUDENTS */}
        <section className="supervisor-card">
          <div className="supervisor-card-heading">
            <div>
              <span className="supervisor-card-eyebrow">RESIDENTS</span>
              <h2>Recent Admissions</h2>
            </div>

            <Link to="/supervisor/students" className="supervisor-card-action">
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="supervisor-list">
            {data.recentStudents && data.recentStudents.length > 0 ? (
              data.recentStudents.map((student) => (
                <div className="supervisor-list-row" key={student.id}>
                  <span className="supervisor-list-avatar">
                    {student.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 2)}
                  </span>

                  <div className="supervisor-student-details">
                    <strong>{student.name}</strong>
                    <small>
                      Room {student.room} • Bed {student.bed}
                    </small>
                  </div>

                  <span className="supervisor-list-date">{student.date}</span>
                </div>
              ))
            ) : (
              <p className="supervisor-empty-text">No recent admissions.</p>
            )}
          </div>
        </section>

        {/* RECENT PAYMENTS */}
        <section className="supervisor-card">
          <div className="supervisor-card-heading">
            <div>
              <span className="supervisor-card-eyebrow">PAYMENTS</span>
              <h2>Recent Collections</h2>
            </div>

            <Link to="/supervisor/payments" className="supervisor-card-action">
              View All
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="supervisor-list">
            {data.recentPayments && data.recentPayments.length > 0 ? (
              data.recentPayments.map((payment) => (
                <div className="supervisor-list-row" key={payment.id}>
                  <span className="supervisor-payment-icon">
                    <ReceiptIndianRupee size={17} />
                  </span>

                  <div className="supervisor-student-details">
                    <strong>{payment.student}</strong>
                    <small>{payment.mode || "UPI Payment"}</small>
                  </div>

                  <strong className="supervisor-payment-amount">
                    {formatCurrency(payment.amount)}
                  </strong>
                </div>
              ))
            ) : (
              <p className="supervisor-empty-text">No recent payments.</p>
            )}
          </div>
        </section>
      </div>

      {/* QUICK ACTIONS */}
      <section className="supervisor-card">
        <div className="supervisor-card-heading">
          <div>
            <span className="supervisor-card-eyebrow">OPERATIONS</span>
            <h2>Quick Actions</h2>
          </div>
        </div>

        <div className="supervisor-quick-actions">
          <Link
            to="/supervisor/students"
            className="supervisor-quick-action-btn"
          >
            <span className="supervisor-action-icon accent-blue">
              <UserPlus size={19} />
            </span>
            <div>
              <strong>Add Student</strong>
              <small>Register new resident</small>
            </div>
          </Link>

          <Link to="/supervisor/workers" className="supervisor-quick-action-btn">
            <span className="supervisor-action-icon accent-amber">
              <UserRoundCog size={19} />
            </span>
            <div>
              <strong>Add Worker</strong>
              <small>Register hostel staff</small>
            </div>
          </Link>

          <Link
            to="/supervisor/payments"
            className="supervisor-quick-action-btn"
          >
            <span className="supervisor-action-icon accent-emerald">
              <CreditCard size={19} />
            </span>
            <div>
              <strong>Record Payment</strong>
              <small>Log student rent</small>
            </div>
          </Link>

          <Link
            to="/supervisor/due-tracker"
            className="supervisor-quick-action-btn"
          >
            <span className="supervisor-action-icon accent-rose">
              <Clock3 size={19} />
            </span>
            <div>
              <strong>Due Tracker</strong>
              <small>Follow up pending rent</small>
            </div>
          </Link>

          <Link to="/supervisor/repairs" className="supervisor-quick-action-btn">
            <span className="supervisor-action-icon accent-sky">
              <Wrench size={19} />
            </span>
            <div>
              <strong>Report Repair</strong>
              <small>Log maintenance issue</small>
            </div>
          </Link>
        </div>
      </section>
    </SupervisorLayout>
  );
}

function StatCard({ icon: Icon, title, value, text, variant = "blue" }) {
  return (
    <div className={`supervisor-stat-card variant-${variant}`}>
      <span className="supervisor-stat-icon">
        <Icon size={22} />
      </span>

      <div className="supervisor-stat-main">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{text}</small>
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="supervisor-mini-stat">
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

function FinanceItem({ icon: Icon, title, value, type = "info" }) {
  return (
    <div className={`supervisor-finance-item finance-${type}`}>
      <span className="supervisor-finance-icon">
        <Icon size={19} />
      </span>

      <div className="supervisor-finance-text">
        <small>{title}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default SupervisorDashboard;
