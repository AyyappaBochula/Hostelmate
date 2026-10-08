import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import {
  BedDouble,
  Bell,
  Building2,
  ChevronDown,
  CreditCard,
  Home,
  LogOut,
  Menu,
  ReceiptIndianRupee,
  Settings,
  UserRound,
  UserRoundCog,
  Users,
  Wrench,
  X,
} from "lucide-react";

import "./ownerLayout.css";

function OwnerLayout({ children, title = "Owner Panel" }) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Temporary owner data.
  // Later replace this with owner profile API data.
  const owner = {
    name: "Vinay Kumar",
    email: "vinay@example.com",
    initials: "VK",
  };

  const menu = [
    {
      name: "Dashboard",
      path: "/owner/dashboard",
      icon: Home,
    },
    {
      name: "Hostels",
      path: "/owner/hostels",
      icon: Building2,
    },
    {
      name: "Bed Availability",
      path: "/owner/bed-availability",
      icon: BedDouble,
    },
    {
      name: "Supervisors",
      path: "/owner/supervisors",
      icon: UserRoundCog,
    },
    {
      name: "Students",
      path: "/owner/students",
      icon: Users,
    },
    {
      name: "Rent / Due Tracker",
      path: "/owner/due-tracker",
      icon: ReceiptIndianRupee,
    },
    {
      name: "Workers",
      path: "/owner/workers",
      icon: UserRound,
    },
    {
      name: "Payments",
      path: "/owner/payments",
      icon: CreditCard,
    },
    {
      name: "Repair Requests",
      path: "/owner/repairs",
      icon: Wrench,
    },
    {
      name: "Subscription",
      path: "/owner/subscription",
      icon: CreditCard,
    },
    {
      name: "Profile",
      path: "/owner/profile",
      icon: Settings,
    },
  ];

  // Temporary notifications.
  // Later these can come from the backend.
  const notifications = [
    {
      id: 1,
      type: "repair",
      title: "Critical Repair",
      message: "Water leakage reported at Sunrise Boys Hostel, Room 203.",
      time: "5 min ago",
      path: "/owner/repairs",
    },
    {
      id: 2,
      type: "due",
      title: "Payment Overdue",
      message: "Anjali Reddy's rent is overdue by more than 3 days.",
      time: "20 min ago",
      path: "/owner/due-tracker",
    },
    {
      id: 3,
      type: "repair",
      title: "New Repair Request",
      message: "Suresh reported a plumbing problem at Blue Moon Hostel.",
      time: "1 hour ago",
      path: "/owner/repairs",
    },
  ];

  const closeMenus = () => {
    setProfileOpen(false);
    setNotificationOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleNotification = (notification) => {
    setNotificationOpen(false);

    if (notification.path) {
      navigate(notification.path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");

    setProfileOpen(false);
    setNotificationOpen(false);
    setSidebarOpen(false);

    navigate("/login");
  };

  return (
    <div className="owner-layout">
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {sidebarOpen && (
        <div className="owner-layout-overlay" onClick={closeSidebar} />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside className={`owner-layout-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* SIDEBAR HEADER */}
        <div className="owner-layout-sidebar-header">
          <Link
            to="/owner/dashboard"
            className="owner-layout-brand"
            onClick={closeSidebar}
          >
            <div className="owner-layout-logo">
              <BedDouble size={24} />
            </div>

            <div>
              <strong>HostelHub</strong>
              <span>Owner Panel</span>
            </div>
          </Link>

          <button
            type="button"
            className="owner-layout-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* OWNER ACCOUNT */}
        <div className="owner-layout-account">
          <div className="owner-layout-avatar">{owner.initials}</div>

          <div>
            <strong>{owner.name}</strong>
            <span>Hostel Owner</span>
          </div>
        </div>

        {/* MENU */}
        <div className="owner-layout-menu-title">MANAGEMENT</div>

        <nav className="owner-layout-nav">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `owner-layout-nav-link ${
                    isActive ? "owner-layout-nav-active" : ""
                  }`
                }
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* SIDEBAR BOTTOM */}
        <div className="owner-layout-sidebar-bottom">
          {/* TRIAL CARD */}
          <div className="owner-layout-trial">
            <div className="owner-layout-trial-heading">
              <div>
                <span>FREE TRIAL</span>
                <strong>24 days left</strong>
              </div>

              <CreditCard size={18} />
            </div>

            <div className="owner-layout-trial-bar">
              <span style={{ width: "80%" }} />
            </div>

            <p>Upgrade your plan before your trial expires.</p>

            <Link to="/owner/subscription" onClick={closeSidebar}>
              View Subscription
            </Link>
          </div>

          {/* LOGOUT */}
          <button
            type="button"
            className="owner-layout-logout"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}
      <main
        className="owner-layout-main"
        onClick={() => {
          if (profileOpen || notificationOpen) {
            closeMenus();
          }
        }}
      >
        {/* ===================================================
            TOP HEADER
        =================================================== */}
        <header
          className="owner-layout-topbar"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="owner-layout-topbar-left">
            <button
              type="button"
              className="owner-layout-menu-button"
              onClick={() => setSidebarOpen((previous) => !previous)}
              aria-label="Open sidebar"
            >
              <Menu size={21} />
            </button>

            <div>
              <span>HostelHub</span>
              <h2>{title}</h2>
            </div>
          </div>

          <div className="owner-layout-topbar-right">
            {/* ===============================================
                NOTIFICATIONS
            =============================================== */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="owner-layout-notification"
                onClick={() => {
                  setNotificationOpen((previous) => !previous);

                  setProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <Bell size={19} />

                {notifications.length > 0 && (
                  <span className="notification-dot" />
                )}
              </button>

              {notificationOpen && (
                <div className="notification-dropdown">
                  <div className="notification-heading">
                    <div>
                      <span>NOTIFICATIONS</span>
                      <h3>Recent Alerts</h3>
                    </div>

                    <strong>{notifications.length}</strong>
                  </div>

                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <button
                        type="button"
                        key={notification.id}
                        className={`notification-item notification-${notification.type}`}
                        onClick={() => handleNotification(notification)}
                      >
                        <div>
                          <strong>{notification.title}</strong>

                          <p>{notification.message}</p>

                          <small>{notification.time}</small>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="notification-footer">
                    <span>
                      Important payment and repair alerts appear here.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ===============================================
                PROFILE
            =============================================== */}
            <div className="owner-layout-profile">
              <button
                type="button"
                className="owner-layout-profile-button"
                onClick={() => {
                  setProfileOpen((previous) => !previous);

                  setNotificationOpen(false);
                }}
              >
                <div className="owner-layout-profile-avatar">
                  {owner.initials}
                </div>

                <div className="owner-layout-profile-info">
                  <strong>{owner.name}</strong>
                  <span>Owner</span>
                </div>

                <ChevronDown
                  size={16}
                  className={profileOpen ? "profile-chevron-open" : ""}
                />
              </button>

              {profileOpen && (
                <div className="owner-layout-profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="owner-layout-profile-avatar">
                      {owner.initials}
                    </div>

                    <div>
                      <strong>{owner.name}</strong>
                      <span>{owner.email}</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <Link
                    to="/owner/profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Profile Settings
                  </Link>

                  <Link
                    to="/owner/subscription"
                    onClick={() => setProfileOpen(false)}
                  >
                    <CreditCard size={16} />
                    Subscription
                  </Link>

                  <div className="profile-dropdown-divider" />

                  <button type="button" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}
        <div className="owner-layout-content">{children}</div>
      </main>
    </div>
  );
}

export default OwnerLayout;
