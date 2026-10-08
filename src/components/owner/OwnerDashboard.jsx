import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  CreditCard,
  DoorOpen,
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

import OwnerLayout from "./OwnerLayout";
import { dashboardApi } from "../../services/api";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalHostels: 4,
      totalSupervisors: 4,
      totalStudents: 15,
      activeStudents: 15,
      totalWorkers: 6,
      totalRooms: 10,
      totalBeds: 29,
      occupiedBeds: 22,
      availableBeds: 5,
      monthlyCollection: 88500,
      pendingDues: 25000,
      overdueDues: 11250,
      trialDaysRemaining: 24,
      trialTotalDays: 30,
    },
    recentStudents: [],
    recentPayments: [],
  });

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardApi.getOwnerDashboardStats();
      if (res && res.stats) {
        setData(res);
      }
    } catch (err) {
      console.error("Failed to load owner dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const stats = data.stats;
  const occupancyPercentage = stats.totalBeds
    ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100)
    : 76;

  const trialPercentage = stats.trialTotalDays
    ? Math.round((stats.trialDaysRemaining / stats.trialTotalDays) * 100)
    : 80;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <OwnerLayout title="Owner Dashboard">
      {/* WELCOME BANNER */}
      <section className="owner-welcome-section">
        <div>
          <span className="owner-welcome-label">
            <TrendingUp size={14} />
            EXECUTIVE OVERVIEW
          </span>

          <h1>
            Welcome back, <span>Vinay</span>
          </h1>

          <p>
            Here's the real-time operational summary across all your hostel
            properties.
          </p>
        </div>

        <div className="owner-welcome-actions">
          <button
            type="button"
            className="owner-secondary-button"
            onClick={loadDashboardData}
            title="Refresh statistics"
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>

          <Link to="/owner/hostels" className="owner-add-hostel-button">
            <Plus size={18} />
            Add Hostel
          </Link>
        </div>
      </section>

      {/* TOP 4 STAT CARDS */}
      <section className="owner-stat-grid">
        <DashboardStatCard
          icon={Building2}
          title="Total Hostels"
          value={stats.totalHostels}
          helper="Active properties"
          link="/owner/hostels"
          variant="blue"
        />

        <DashboardStatCard
          icon={UserRoundCog}
          title="Supervisors"
          value={stats.totalSupervisors}
          helper="Managing teams"
          link="/owner/supervisors"
          variant="indigo"
        />

        <DashboardStatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          helper={`${stats.activeStudents} currently staying`}
          link="/owner/students"
          variant="emerald"
        />

        <DashboardStatCard
          icon={UserRound}
          title="Workers"
          value={stats.totalWorkers}
          helper="Staff across hostels"
          link="/owner/workers"
          variant="amber"
        />
      </section>

      {/* OCCUPANCY & FINANCIAL SUMMARY */}
      <section className="owner-summary-grid">
        {/* OCCUPANCY CARD */}
        <div className="owner-dashboard-card">
          <div className="owner-card-header">
            <div>
              <span className="owner-card-eyebrow">ROOMS & BEDS</span>
              <h3>Occupancy Overview</h3>
            </div>

            <Link to="/owner/bed-availability" className="owner-card-action">
              View Bed Matrix
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="owner-occupancy-content">
            {/* OCCUPANCY SVG RADIAL GAUGE */}
            <div className="owner-radial-gauge-container">
              <svg className="owner-radial-svg" viewBox="0 0 120 120">
                <circle
                  className="owner-radial-bg"
                  cx="60"
                  cy="60"
                  r="48"
                  strokeWidth="10"
                />
                <circle
                  className="owner-radial-progress"
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
              <div className="owner-radial-text">
                <strong>{occupancyPercentage}%</strong>
                <span>Occupied</span>
              </div>
            </div>

            {/* OCCUPANCY MINI STATS */}
            <div className="owner-bed-stats">
              <MiniStat
                icon={DoorOpen}
                title="Total Rooms"
                value={stats.totalRooms}
                accent="blue"
              />

              <MiniStat
                icon={BedDouble}
                title="Total Beds"
                value={stats.totalBeds}
                accent="purple"
              />

              <MiniStat
                icon={CheckCircle2}
                title="Occupied Beds"
                value={stats.occupiedBeds}
                accent="emerald"
              />

              <MiniStat
                icon={BedDouble}
                title="Available Beds"
                value={stats.availableBeds}
                accent="amber"
              />
            </div>
          </div>
        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="owner-dashboard-card">
          <div className="owner-card-header">
            <div>
              <span className="owner-card-eyebrow">COLLECTION & DUES</span>
              <h3>Payment Summary</h3>
            </div>

            <Link to="/owner/payments" className="owner-card-action">
              Transactions
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="owner-finance-list">
            <FinanceItem
              icon={WalletCards}
              label="Monthly Collection"
              value={formatCurrency(stats.monthlyCollection)}
              type="success"
              subtitle="Received for current billing cycle"
            />

            <FinanceItem
              icon={Clock3}
              label="Pending Dues"
              value={formatCurrency(stats.pendingDues)}
              type="warning"
              subtitle="Follow-up with students needed"
            />

            <FinanceItem
              icon={CircleDollarSign}
              label="Overdue (> 3 Days)"
              value={formatCurrency(stats.overdueDues)}
              type="danger"
              subtitle="Critical attention required"
            />
          </div>
        </div>
      </section>

      {/* RECENT STUDENTS & RECENT PAYMENTS */}
      <section className="owner-bottom-grid">
        {/* RECENT STUDENTS */}
        <div className="owner-dashboard-card">
          <div className="owner-card-header">
            <div>
              <span className="owner-card-eyebrow">RESIDENTS</span>
              <h3>Recent Student Admissions</h3>
            </div>

            <Link to="/owner/students" className="owner-card-action">
              View All
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="owner-student-list">
            {data.recentStudents && data.recentStudents.length > 0 ? (
              data.recentStudents.map((student) => (
                <div className="owner-student-row" key={student.id}>
                  <div className="owner-list-avatar">
                    {student.name
                      .split(" ")
                      .map((word) => word[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div className="owner-student-info">
                    <strong>{student.name}</strong>
                    <span>{student.hostel}</span>
                  </div>

                  <div className="owner-student-room">
                    <span className="owner-room-pill">{student.room}</span>
                    <small>{student.joined}</small>
                  </div>
                </div>
              ))
            ) : (
              <p className="owner-empty-text">No recent admissions found.</p>
            )}
          </div>
        </div>

        {/* RECENT TRANSACTIONS */}
        <div className="owner-dashboard-card">
          <div className="owner-card-header">
            <div>
              <span className="owner-card-eyebrow">TRANSACTIONS</span>
              <h3>Recent Collections</h3>
            </div>

            <Link to="/owner/payments" className="owner-card-action">
              View All
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="owner-payment-list">
            {data.recentPayments && data.recentPayments.length > 0 ? (
              data.recentPayments.map((payment) => (
                <div className="owner-payment-row" key={payment.id}>
                  <div className="owner-payment-icon">
                    <ReceiptIndianRupee size={17} />
                  </div>

                  <div className="owner-payment-info">
                    <strong>{payment.student}</strong>
                    <span>
                      {payment.type} • {payment.mode}
                    </span>
                  </div>

                  <div className="owner-payment-value">
                    <strong>{formatCurrency(payment.amount)}</strong>
                    <span
                      className={`owner-status-tag ${
                        payment.status === "Paid"
                          ? "status-paid"
                          : "status-partial"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="owner-empty-text">No recent payments recorded.</p>
            )}
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS & SUBSCRIPTION CARD */}
      <section className="owner-final-grid">
        <div className="owner-dashboard-card">
          <div className="owner-card-header">
            <div>
              <span className="owner-card-eyebrow">SHORTCUTS</span>
              <h3>Quick Actions</h3>
            </div>
          </div>

          <div className="owner-quick-actions">
            <QuickAction
              link="/owner/hostels"
              icon={Building2}
              title="Add Hostel"
              text="Create new property"
              accent="blue"
            />

            <QuickAction
              link="/owner/supervisors"
              icon={UserPlus}
              title="Invite Supervisor"
              text="Add management staff"
              accent="indigo"
            />

            <QuickAction
              link="/owner/students"
              icon={Users}
              title="Register Student"
              text="Admit resident & bed"
              accent="emerald"
            />

            <QuickAction
              link="/owner/payments"
              icon={ReceiptIndianRupee}
              title="Record Payment"
              text="Log rent / advance"
              accent="amber"
            />

            <QuickAction
              link="/owner/due-tracker"
              icon={Clock3}
              title="Due Tracker"
              text="Check pending rents"
              accent="rose"
            />

            <QuickAction
              link="/owner/repairs"
              icon={Wrench}
              title="Maintenance"
              text="Resolve repair tickets"
              accent="sky"
            />
          </div>
        </div>

        <div className="owner-subscription-card">
          <div className="owner-subscription-header">
            <div className="owner-subscription-icon">
              <CreditCard size={22} />
            </div>
            <span className="owner-subscription-badge">TRIAL ACTIVE</span>
          </div>

          <span className="owner-subscription-label">CURRENT PLAN</span>
          <h3>30-Day Free Trial</h3>

          <p>
            You have{" "}
            <strong>{stats.trialDaysRemaining || 24} days remaining</strong> on
            your premium trial. Enjoy unlimited hostel and supervisor
            management.
          </p>

          <div className="owner-subscription-progress">
            <span
              style={{
                width: `${trialPercentage}%`,
              }}
            />
          </div>

          <div className="owner-subscription-footer">
            <span>
              {stats.trialDaysRemaining || 24} of {stats.trialTotalDays || 30}{" "}
              days remaining
            </span>

            <Link to="/owner/subscription" className="owner-subscription-link">
              Upgrade Plan
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </OwnerLayout>
  );
}

function DashboardStatCard({
  icon: Icon,
  title,
  value,
  helper,
  link,
  variant = "blue",
}) {
  return (
    <Link to={link} className={`owner-stat-card variant-${variant}`}>
      <div className="owner-stat-icon">
        <Icon size={22} />
      </div>

      <div className="owner-stat-main">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{helper}</small>
      </div>

      <ArrowUpRight size={16} className="owner-stat-arrow" />
    </Link>
  );
}

function MiniStat({ icon: Icon, title, value, accent = "blue" }) {
  return (
    <div className={`owner-mini-stat accent-${accent}`}>
      <span className="owner-mini-stat-icon">
        <Icon size={16} />
      </span>

      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function FinanceItem({ icon: Icon, label, value, type, subtitle }) {
  return (
    <div className={`owner-finance-item finance-${type}`}>
      <span className="owner-finance-icon">
        <Icon size={19} />
      </span>

      <div className="owner-finance-details">
        <div className="owner-finance-row">
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
        {subtitle && <small>{subtitle}</small>}
      </div>
    </div>
  );
}

function QuickAction({ link, icon: Icon, title, text, accent = "blue" }) {
  return (
    <Link to={link} className={`owner-quick-action-btn accent-${accent}`}>
      <span className="owner-quick-action-icon">
        <Icon size={18} />
      </span>

      <div>
        <strong>{title}</strong>
        <small>{text}</small>
      </div>
    </Link>
  );
}

export default OwnerDashboard;
