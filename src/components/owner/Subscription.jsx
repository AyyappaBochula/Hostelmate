import { useEffect, useState } from "react";
import { Check, Clock3, CreditCard, Gift, ShieldCheck } from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { subscriptionApi } from "../../services/api";
import './Subscription.css'

function Subscription() {
  const [sub, setSub] = useState({
    plan_name: "30-Day Free Trial",
    trial_days_remaining: 24,
    trial_total_days: 30,
    monthly_price: 499,
  });
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    subscriptionApi.getSubscription().then((data) => {
      if (data) setSub(data);
    });
  }, []);

  const trialPercentage = (sub.trial_days_remaining / sub.trial_total_days) * 100;

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    const res = await subscriptionApi.applyCoupon(coupon);
    if (res.success) {
      setDiscount(res.discountPercent);
      setCouponMessage(`✓ Coupon applied! ${res.discountPercent}% discount activated.`);
    } else {
      setCouponMessage("✕ Invalid or expired coupon code.");
    }
  };

  const finalPrice = discount > 0 ? Math.round(sub.monthly_price * (1 - discount / 100)) : sub.monthly_price;

  return (
    <OwnerLayout title="Subscription">
      <div className="owner-page-heading">
        <div>
          <span>BILLING & SUBSCRIPTION</span>
          <h1>HostelHub Plans</h1>
          <p>Manage your 30-day free trial, subscribe to premium features, and apply partner coupons.</p>
        </div>
      </div>

      <div className="owner-subscription-page-grid">
        {/* CURRENT TRIAL STATUS */}
        <section className="owner-page-card">
          <div className="owner-plan-icon-wrap">
            <Clock3 size={26} className="text-blue-600" />
          </div>

          <span className="owner-card-eyebrow">CURRENT ACTIVE STATUS</span>
          <h2>30-Day Free Trial</h2>
          <p>Your HostelHub owner trial is active with unrestricted access to all properties.</p>

          <div className="owner-trial-large">
            <strong>{sub.trial_days_remaining}</strong>
            <span>days remaining</span>
          </div>

          <div className="owner-large-progress">
            <span style={{ width: `${trialPercentage}%` }} />
          </div>

          <small className="owner-trial-subtext">
            Trial automatically expires on {sub.expiry_date || "01 Nov 2026"}.
          </small>
        </section>

        {/* PRO PLAN */}
        <section className="owner-page-card owner-pricing-card">
          <span className="owner-popular-badge">RECOMMENDED</span>

          <div className="owner-plan-icon-wrap">
            <CreditCard size={26} className="text-indigo-600" />
          </div>

          <span className="owner-card-eyebrow">PREMIUM PLAN</span>
          <h2>
            ₹{finalPrice} <small>/ 30 days</small>
          </h2>

          <p>Complete multi-property hostel & PG management suite.</p>

          <div className="owner-plan-features">
            <PlanFeature text="Manage unlimited hostels & buildings" />
            <PlanFeature text="Live floor, room & bed matrix" />
            <PlanFeature text="Student admission & rent dues tracking" />
            <PlanFeature text="Supervisor access delegation" />
            <PlanFeature text="Worker & staff management" />
            <PlanFeature text="Instant payment receipts & reports" />
          </div>

          <button
            type="button"
            className="owner-primary-button owner-full-button"
            onClick={() => alert(`Subscribing for ₹${finalPrice}/month. Payment gateway integration ready.`)}
          >
            <CreditCard size={17} />
            Subscribe Now (₹{finalPrice})
          </button>
        </section>
      </div>

      {/* COUPON SECTION */}
      <section className="owner-page-card owner-coupon-section">
        <div className="owner-coupon-header">
          <Gift size={24} className="text-amber-500" />
          <div>
            <h3>Have a Discount Coupon?</h3>
            <p>Enter promo code (Try: <strong>HOSTEL50</strong> for 50% off).</p>
          </div>
        </div>

        <div className="owner-coupon-form">
          <input
            type="text"
            placeholder="Enter promo coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
          />
          <button type="button" className="owner-secondary-button" onClick={handleApplyCoupon}>
            Apply Coupon
          </button>
        </div>
        {couponMessage && <p className="owner-coupon-feedback">{couponMessage}</p>}
      </section>

      <div className="owner-subscription-security">
        <ShieldCheck size={18} />
        <span>All payments are securely verified and protected with 256-bit encryption.</span>
      </div>
    </OwnerLayout>
  );
}

function PlanFeature({ text }) {
  return (
    <div className="owner-plan-feature-item">
      <Check size={16} className="text-emerald-500" />
      <span>{text}</span>
    </div>
  );
}

export default Subscription;
