import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  BedDouble,
  Building2,
  Check,
  ChevronRight,
  CircleCheck,
  CreditCard,
  HardHat,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Users,
  UserRoundCog,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

import "./LandingPage.css";

const features = [
  {
    icon: Building2,
    title: "Hostel Management",
    description:
      "Manage multiple hostels, floors, rooms and hostel information from one simple dashboard.",
  },
  {
    icon: Users,
    title: "Student Management",
    description:
      "Maintain student profiles, joining information, room allocation and vacating history.",
  },
  {
    icon: BedDouble,
    title: "Rooms & Beds",
    description:
      "Track room capacity, available beds and occupied beds without manual registers.",
  },
  {
    icon: UserRoundCog,
    title: "Supervisor Management",
    description:
      "Invite supervisors and assign them securely to the hostels they are responsible for.",
  },
  {
    icon: HardHat,
    title: "Worker Management",
    description:
      "Maintain cooks, cleaners, security staff, maintenance workers and other employees.",
  },
  {
    icon: CreditCard,
    title: "Payments & Dues",
    description:
      "Record rent payments, partial payments, pending balances and complete payment history.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Register as a hostel owner and provide the required account information.",
  },
  {
    number: "02",
    title: "Account verification",
    description: "After approval, your 30-day free trial begins automatically.",
  },
  {
    number: "03",
    title: "Create your hostel",
    description:
      "Add your hostel, floors, rooms, bed capacity and basic information.",
  },
  {
    number: "04",
    title: "Build your team",
    description: "Invite supervisors and maintain workers for each hostel.",
  },
  {
    number: "05",
    title: "Add students",
    description:
      "Register students and assign them directly to available rooms and beds.",
  },
  {
    number: "06",
    title: "Track everything",
    description:
      "Monitor occupancy, rent collection, pending dues and daily hostel activity.",
  },
];

const platformFeatures = [
  "Multiple hostel support",
  "Floor, room and bed management",
  "Real-time bed availability",
  "Student joining and vacating",
  "Supervisor assignments",
  "Worker records",
  "Monthly rent tracking",
  "Pending and overdue dues",
];

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuOpen(false);
  };

  return (
    <div className="landing-page">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        <div className="page-container navbar-container">
          <button
            className="brand"
            onClick={() => scrollToSection("home")}
            type="button"
          >
            <span className="brand-logo">
              <Building2 size={23} strokeWidth={2.2} />
            </span>

            <span className="brand-name">
              Hostel<span>Hub</span>
            </span>
          </button>

          <nav className="desktop-nav">
            <button onClick={() => scrollToSection("home")} type="button">
              Home
            </button>

            <button onClick={() => scrollToSection("about")} type="button">
              About
            </button>

            <button onClick={() => scrollToSection("features")} type="button">
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              type="button"
            >
              How It Works
            </button>

            <button onClick={() => scrollToSection("pricing")} type="button">
              Pricing
            </button>
          </nav>

          <div className="navbar-actions">
            <Link to="/login" className="navbar-login">
              Login
            </Link>

            <Link to="/signup/owner" className="navbar-start">
              Start Free
              <ArrowRight size={16} />
            </Link>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen((previous) => !previous)}
            type="button"
            aria-label="Open navigation"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <button onClick={() => scrollToSection("home")} type="button">
              Home
            </button>

            <button onClick={() => scrollToSection("about")} type="button">
              About
            </button>

            <button onClick={() => scrollToSection("features")} type="button">
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              type="button"
            >
              How It Works
            </button>

            <button onClick={() => scrollToSection("pricing")} type="button">
              Pricing
            </button>

            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>

            <Link
              to="/signup/owner"
              className="mobile-start"
              onClick={() => setMenuOpen(false)}
            >
              Start 30-Day Free Trial
            </Link>
          </div>
        )}
      </header>

      <main>
        {/* =====================================================
            HERO
        ====================================================== */}

        <section id="home" className="hero-section">
          <div className="hero-grid-background"></div>
          <div className="hero-blue-glow hero-glow-one"></div>
          <div className="hero-blue-glow hero-glow-two"></div>

          <div className="page-container hero-container">
            <div className="hero-content">
              <div className="hero-label">
                <Sparkles size={15} />
                <span>Simple. Secure. Smart Hostel Management.</span>
              </div>

              <h1>
                Run your hostel
                <br />
                <span>without the daily chaos.</span>
              </h1>

              <p className="hero-description">
                HostelHub brings your students, rooms, beds, supervisors,
                workers, rent payments and pending dues together in one
                organized platform.
              </p>

              <div className="hero-actions">
                <Link to="/signup/owner" className="main-button">
                  Start 30-Day Free Trial
                  <ArrowRight size={18} />
                </Link>

                <button
                  className="outline-button"
                  onClick={() => scrollToSection("features")}
                  type="button"
                >
                  Explore Features
                  <ChevronRight size={17} />
                </button>
              </div>

              <div className="hero-points">
                <span>
                  <CircleCheck size={16} />
                  No payment for 30 days
                </span>

                <span>
                  <CircleCheck size={16} />
                  Quick setup
                </span>

                <span>
                  <CircleCheck size={16} />
                  Secure access
                </span>
              </div>
            </div>

            {/* Dashboard preview */}

            <div className="hero-visual">
              <div className="hero-visual-decoration decoration-one"></div>
              <div className="hero-visual-decoration decoration-two"></div>

              <div className="floating-info floating-bed">
                <span className="floating-info-icon">
                  <BedDouble size={18} />
                </span>

                <div>
                  <strong>12 Beds</strong>
                  <small>Available now</small>
                </div>
              </div>

              <div className="floating-info floating-payment">
                <span className="floating-info-icon payment-icon">
                  <WalletCards size={18} />
                </span>

                <div>
                  <strong>₹85,000</strong>
                  <small>Collected this month</small>
                </div>
              </div>

              <div className="dashboard-preview">
                <div className="dashboard-preview-header">
                  <div>
                    <span className="dashboard-caption">OVERVIEW</span>
                    <h3>Owner Dashboard</h3>
                  </div>

                  <div className="dashboard-user">O</div>
                </div>

                <div className="dashboard-cards">
                  <div className="dashboard-mini-card">
                    <span className="mini-icon blue">
                      <Users size={19} />
                    </span>

                    <div>
                      <small>Students</small>
                      <strong>120</strong>
                    </div>
                  </div>

                  <div className="dashboard-mini-card">
                    <span className="mini-icon violet">
                      <Building2 size={19} />
                    </span>

                    <div>
                      <small>Rooms</small>
                      <strong>35</strong>
                    </div>
                  </div>

                  <div className="dashboard-mini-card">
                    <span className="mini-icon green">
                      <BedDouble size={19} />
                    </span>

                    <div>
                      <small>Available Beds</small>
                      <strong>12</strong>
                    </div>
                  </div>

                  <div className="dashboard-mini-card">
                    <span className="mini-icon orange">
                      <CreditCard size={19} />
                    </span>

                    <div>
                      <small>Pending Dues</small>
                      <strong>₹18K</strong>
                    </div>
                  </div>
                </div>

                <div className="dashboard-main-row">
                  <div className="collection-card">
                    <div className="collection-header">
                      <div>
                        <small>Monthly Collection</small>
                        <strong>₹85,000</strong>
                      </div>

                      <span>+12.5%</span>
                    </div>

                    <div className="chart">
                      <div style={{ height: "35%" }}></div>
                      <div style={{ height: "48%" }}></div>
                      <div style={{ height: "43%" }}></div>
                      <div style={{ height: "64%" }}></div>
                      <div style={{ height: "58%" }}></div>
                      <div style={{ height: "78%" }}></div>
                      <div style={{ height: "91%" }}></div>
                    </div>

                    <div className="chart-months">
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                      <span>Sep</span>
                      <span>Oct</span>
                    </div>
                  </div>

                  <div className="occupancy-card">
                    <small>Occupancy</small>

                    <div className="occupancy-circle">
                      <div>
                        <strong>86%</strong>
                        <span>Occupied</span>
                      </div>
                    </div>

                    <p>
                      <span></span>
                      108 occupied
                    </p>

                    <p>
                      <span className="available-dot"></span>
                      12 available
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            QUICK VALUE STRIP
        ====================================================== */}

        <section className="value-strip">
          <div className="page-container value-strip-grid">
            <div>
              <ShieldCheck size={22} />
              <span>
                <strong>Secure</strong>
                Role-based access
              </span>
            </div>

            <div>
              <Zap size={22} />
              <span>
                <strong>Simple</strong>
                Easy daily management
              </span>
            </div>

            <div>
              <Building2 size={22} />
              <span>
                <strong>Scalable</strong>
                Manage multiple hostels
              </span>
            </div>

            <div>
              <LayoutDashboard size={22} />
              <span>
                <strong>Organized</strong>
                Everything in one dashboard
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}

        <section id="about" className="section about-section">
          <div className="page-container about-container">
            <div className="about-content">
              <span className="section-tag">ABOUT HOSTELHUB</span>

              <h2>
                Hostel management shouldn't depend on
                <span> registers and spreadsheets.</span>
              </h2>

              <p className="about-main-text">
                HostelHub is designed to help hostel owners and supervisors
                handle everyday hostel operations from one place.
              </p>

              <p>
                Instead of maintaining separate records for students, rooms,
                beds, workers and payments, HostelHub keeps the information
                connected and easy to access.
              </p>

              <div className="about-checks">
                <div>
                  <Check size={16} />
                  Know which beds are available
                </div>

                <div>
                  <Check size={16} />
                  View active and vacated students
                </div>

                <div>
                  <Check size={16} />
                  Track pending monthly payments
                </div>

                <div>
                  <Check size={16} />
                  Assign supervisors to specific hostels
                </div>
              </div>
            </div>

            <div className="about-cards">
              <div className="about-card about-card-large">
                <div className="about-card-icon">
                  <LayoutDashboard size={25} />
                </div>

                <h3>One connected dashboard</h3>

                <p>
                  Important hostel information stays organized and visible
                  instead of being scattered across different records.
                </p>

                <div className="about-mini-dashboard">
                  <div>
                    <span>Students</span>
                    <strong>120</strong>
                  </div>

                  <div>
                    <span>Occupied</span>
                    <strong>108</strong>
                  </div>

                  <div>
                    <span>Available</span>
                    <strong>12</strong>
                  </div>
                </div>
              </div>

              <div className="about-small-cards">
                <div className="about-card">
                  <div className="about-card-icon green-bg">
                    <UserCheck size={23} />
                  </div>

                  <h3>Role based</h3>

                  <p>
                    Owners control their business while supervisors manage only
                    assigned hostels.
                  </p>
                </div>

                <div className="about-card">
                  <div className="about-card-icon violet-bg">
                    <CreditCard size={23} />
                  </div>

                  <h3>Clear payments</h3>

                  <p>
                    See collected rent, balances, partial payments and overdue
                    dues clearly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section id="features" className="section features-section">
          <div className="page-container">
            <div className="section-heading">
              <span className="section-tag">EVERYTHING YOU NEED</span>

              <h2>
                One platform for your
                <span> complete hostel operation.</span>
              </h2>

              <p>
                Built around the tasks hostel owners and supervisors handle
                every day.
              </p>
            </div>

            <div className="features-grid">
              {features.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <article className="feature-card" key={feature.title}>
                    <div className="feature-card-top">
                      <span className="feature-icon">
                        <Icon size={24} />
                      </span>

                      <span className="feature-number">0{index + 1}</span>
                    </div>

                    <h3>{feature.title}</h3>

                    <p>{feature.description}</p>

                    <div className="feature-bottom-line"></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            ROLE SECTION
        ====================================================== */}

        <section className="section roles-section">
          <div className="page-container">
            <div className="section-heading">
              <span className="section-tag">BUILT FOR YOUR TEAM</span>

              <h2>
                The right access for
                <span> the right people.</span>
              </h2>

              <p>
                Owners stay in control while supervisors focus on the hostels
                assigned to them.
              </p>
            </div>

            <div className="roles-grid">
              <div className="role-card owner-role">
                <div className="role-header">
                  <span className="role-icon">
                    <Building2 size={25} />
                  </span>

                  <div>
                    <span className="role-label">OWNER</span>
                    <h3>Complete business visibility</h3>
                  </div>
                </div>

                <p>
                  Manage your hostels, supervisors, students, workers, payments
                  and subscription from one account.
                </p>

                <div className="role-features">
                  <span>
                    <Check size={15} /> Create and manage hostels
                  </span>

                  <span>
                    <Check size={15} /> Invite supervisors
                  </span>

                  <span>
                    <Check size={15} /> View students and occupancy
                  </span>

                  <span>
                    <Check size={15} /> Track payments and dues
                  </span>
                </div>

                <Link to="/signup/owner">
                  Create Owner Account
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="role-card supervisor-role">
                <div className="role-header">
                  <span className="role-icon">
                    <UserRoundCog size={25} />
                  </span>

                  <div>
                    <span className="role-label">SUPERVISOR</span>
                    <h3>Simple daily hostel operations</h3>
                  </div>
                </div>

                <p>
                  Supervisors can manage assigned hostels without getting access
                  to the owner's complete business.
                </p>

                <div className="role-features">
                  <span>
                    <Check size={15} /> Manage assigned hostels
                  </span>

                  <span>
                    <Check size={15} /> Add and update students
                  </span>

                  <span>
                    <Check size={15} /> Maintain worker details
                  </span>

                  <span>
                    <Check size={15} /> Record rent payments
                  </span>
                </div>

                <Link to="/login">
                  Supervisor Login
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section id="how-it-works" className="section process-section">
          <div className="page-container">
            <div className="section-heading">
              <span className="section-tag">HOW IT WORKS</span>

              <h2>
                From registration to daily management
                <span> in six simple steps.</span>
              </h2>

              <p>
                Getting started is straightforward. Set up your account,
                organize your hostel and start managing.
              </p>
            </div>

            <div className="process-grid">
              {steps.map((step) => (
                <article className="process-card" key={step.number}>
                  <div className="process-number">{step.number}</div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            PLATFORM SECTION
        ====================================================== */}

        <section className="section platform-section">
          <div className="page-container platform-container">
            <div className="platform-preview">
              <div className="platform-window">
                <aside className="mock-sidebar">
                  <div className="mock-logo">
                    <Building2 size={20} />
                  </div>

                  <span className="mock-menu active"></span>
                  <span className="mock-menu"></span>
                  <span className="mock-menu"></span>
                  <span className="mock-menu"></span>
                  <span className="mock-menu"></span>
                  <span className="mock-menu"></span>
                </aside>

                <div className="mock-content">
                  <div className="mock-topbar">
                    <div>
                      <span></span>
                      <span></span>
                    </div>

                    <div className="mock-profile"></div>
                  </div>

                  <div className="mock-stats">
                    <div>
                      <small></small>
                      <strong></strong>
                    </div>

                    <div>
                      <small></small>
                      <strong></strong>
                    </div>

                    <div>
                      <small></small>
                      <strong></strong>
                    </div>
                  </div>

                  <div className="mock-bottom">
                    <div className="mock-chart">
                      <span style={{ height: "32%" }}></span>
                      <span style={{ height: "48%" }}></span>
                      <span style={{ height: "42%" }}></span>
                      <span style={{ height: "63%" }}></span>
                      <span style={{ height: "55%" }}></span>
                      <span style={{ height: "78%" }}></span>
                      <span style={{ height: "88%" }}></span>
                    </div>

                    <div className="mock-list">
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="platform-content">
              <span className="section-tag">ONE PLATFORM</span>

              <h2>
                Everything important stays
                <span> connected.</span>
              </h2>

              <p>
                When a student joins, their hostel, room and bed are connected.
                When they vacate, the bed becomes available again. Payments
                remain linked to the correct student and hostel.
              </p>

              <div className="platform-features">
                {platformFeatures.map((feature) => (
                  <div key={feature}>
                    <span>
                      <Check size={14} />
                    </span>

                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PRICING
        ====================================================== */}

        <section id="pricing" className="section pricing-section">
          <div className="page-container pricing-container">
            <div className="pricing-content">
              <span className="section-tag">SIMPLE PRICING</span>

              <h2>
                Start managing today.
                <span> Pay later.</span>
              </h2>

              <p>
                Every approved owner receives a 30-day free trial. Explore the
                platform and organize your hostel before paying for a
                subscription.
              </p>

              <div className="trial-highlight">
                <Sparkles size={22} />

                <div>
                  <strong>30-Day Free Trial</strong>
                  <span>No subscription payment required initially.</span>
                </div>
              </div>
            </div>

            <div className="pricing-card">
              <span className="pricing-badge">MONTHLY PLAN</span>

              <p className="pricing-title">HostelHub</p>

              <div className="price">
                <sup>₹</sup>
                <strong>499</strong>
                <span>/ 30 days</span>
              </div>

              <p className="pricing-description">
                Continue using the complete platform after your free trial.
              </p>

              <div className="pricing-divider"></div>

              <div className="pricing-list">
                <span>
                  <Check size={15} /> Hostel management
                </span>

                <span>
                  <Check size={15} /> Students, rooms & beds
                </span>

                <span>
                  <Check size={15} /> Supervisor management
                </span>

                <span>
                  <Check size={15} /> Worker management
                </span>

                <span>
                  <Check size={15} /> Payments & dues
                </span>

                <span>
                  <Check size={15} /> Owner dashboard
                </span>
              </div>

              <Link to="/signup/owner" className="pricing-button">
                Start Free for 30 Days
                <ArrowRight size={18} />
              </Link>

              <small>
                Plan price and trial duration can be updated by the system
                administrator.
              </small>
            </div>
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ====================================================== */}

        <section className="final-cta">
          <div className="cta-grid"></div>

          <div className="page-container final-cta-content">
            <span className="cta-top-icon">
              <Building2 size={25} />
            </span>

            <h2>
              Less paperwork.
              <br />
              More control over your hostel.
            </h2>

            <p>Create your owner account and start your 30-day free trial.</p>

            <div className="cta-actions">
              <Link to="/signup/owner" className="cta-primary">
                Create Owner Account
                <ArrowRight size={18} />
              </Link>

              <Link to="/login" className="cta-secondary">
                Already have an account? Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">
        <div className="page-container footer-main">
          <div className="footer-about">
            <button
              className="brand footer-brand"
              onClick={() => scrollToSection("home")}
              type="button"
            >
              <span className="brand-logo">
                <Building2 size={22} />
              </span>

              <span className="brand-name">
                Hostel<span>Hub</span>
              </span>
            </button>

            <p>
              A simple, secure and organized platform for modern hostel
              management.
            </p>
          </div>

          <div className="footer-column">
            <h4>Platform</h4>

            <button onClick={() => scrollToSection("about")} type="button">
              About
            </button>

            <button onClick={() => scrollToSection("features")} type="button">
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              type="button"
            >
              How It Works
            </button>

            <button onClick={() => scrollToSection("pricing")} type="button">
              Pricing
            </button>
          </div>

          <div className="footer-column">
            <h4>Account</h4>

            <Link to="/login">Login</Link>

            <Link to="/signup/owner">Owner Signup</Link>

            <Link to="/forgot-password">Forgot Password</Link>
          </div>

          <div className="footer-column">
            <h4>Management</h4>

            <span>Hostels</span>
            <span>Students</span>
            <span>Supervisors</span>
            <span>Payments</span>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>

            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>

        <div className="page-container footer-bottom">
          <p>© 2026 HostelHub. All rights reserved.</p>

          <p>Smart Hostel Management</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
