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
  Users,
  Wrench,
  X,
} from "lucide-react";

import "./SupervisorLayout.css";

function SupervisorLayout({ children, title = "Supervisor Panel" }) {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Temporary supervisor.
  // Later replace this with logged-in supervisor API data.
  const supervisor = {
    name: "Ravi Kumar",
    email: "ravi@example.com",
    phone: "9876543210",
    initials: "RK",
  };

  // For now this supervisor manages 3 hostels.
  const assignedHostels = [
    {
      id: 1,
      name: "Sunrise Boys Hostel",
    },
    {
      id: 2,
      name: "Blue Moon Hostel",
    },
    {
      id: 3,
      name: "Green Stay Hostel",
    },
  ];

  const menu = [
    {
      name: "Dashboard",
      path: "/supervisor/dashboard",
      icon: Home,
    },
    {
      name: "Students",
      path: "/supervisor/students",
      icon: Users,
    },
    {
      name: "Bed Availability",
      path: "/supervisor/bed-availability",
      icon: BedDouble,
    },
    {
      name: "Rent / Due Tracker",
      path: "/supervisor/due-tracker",
      icon: ReceiptIndianRupee,
    },
    {
      name: "Workers",
      path: "/supervisor/workers",
      icon: UserRound,
    },
    {
      name: "Payments",
      path: "/supervisor/payments",
      icon: CreditCard,
    },
    {
      name: "Repair Requests",
      path: "/supervisor/repairs",
      icon: Wrench,
    },
    {
      name: "Profile",
      path: "/supervisor/profile",
      icon: Settings,
    },
  ];

  // Temporary notifications.
  // Later replace with notification API.
  const notifications = [
    {
      id: 1,
      type: "due",
      title: "Rent Overdue",
      message: "Karthik's rent is overdue by more than 3 days.",
      time: "10 min ago",
      path: "/supervisor/due-tracker",
    },
    {
      id: 2,
      type: "due",
      title: "Rent Due Today",
      message: "Sai Kiran's ₹5,000 hostel rent is due today.",
      time: "30 min ago",
      path: "/supervisor/due-tracker",
    },
    {
      id: 3,
      type: "repair",
      title: "Repair Acknowledged",
      message: "Owner acknowledged the Room 203 water leakage.",
      time: "1 hour ago",
      path: "/supervisor/repairs",
    },
  ];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const closeMenus = () => {
    setProfileOpen(false);
    setNotificationOpen(false);
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

    setSidebarOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);

    navigate("/login");
  };

  return (
    <div className="supervisor-layout">
      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}
      {sidebarOpen && (
        <div className="supervisor-layout-overlay" onClick={closeSidebar} />
      )}

      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <aside
        className={`supervisor-layout-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* SIDEBAR HEADER */}
        <div className="supervisor-layout-sidebar-header">
          <Link
            to="/supervisor/dashboard"
            className="supervisor-layout-brand"
            onClick={closeSidebar}
          >
            <div className="supervisor-layout-logo">
              <BedDouble size={24} />
            </div>

            <div>
              <strong>HostelHub</strong>
              <span>Supervisor Panel</span>
            </div>
          </Link>

          <button
            type="button"
            className="supervisor-layout-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* SUPERVISOR ACCOUNT */}
        <div className="supervisor-layout-account">
          <div className="supervisor-layout-avatar">{supervisor.initials}</div>

          <div>
            <strong>{supervisor.name}</strong>
            <span>Supervisor</span>
          </div>
        </div>

        {/* ASSIGNED HOSTELS */}
        {/* <div className="supervisor-assigned-hostels">
          <div className="supervisor-assigned-heading">
            <div>
              <span>ASSIGNED HOSTELS</span>
              <strong>{assignedHostels.length} Hostels</strong>
            </div>

            <Building2 size={17} />
          </div>

          <div className="supervisor-assigned-list">
            {assignedHostels.map((hostel) => (
              <div className="supervisor-assigned-item" key={hostel.id}>
                <span>{hostel.id}</span>
                <strong>{hostel.name}</strong>
              </div>
            ))}
          </div>
        </div> */}

        {/* MENU */}
        <div className="supervisor-layout-menu-title">MANAGEMENT</div>

        <nav className="supervisor-layout-nav">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `supervisor-layout-nav-link ${
                    isActive ? "supervisor-layout-nav-active" : ""
                  }`
                }
              >
                <Icon size={18} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* BOTTOM */}
        <div className="supervisor-layout-sidebar-bottom">
          <div className="supervisor-access-card">
            <div className="supervisor-access-card-icon">
              <Building2 size={18} />
            </div>

            <div>
              <span>HOSTEL ACCESS</span>

              <strong>{assignedHostels.length} Assigned</strong>

              <p>You can manage only hostels assigned by the owner.</p>
            </div>
          </div>

          <button
            type="button"
            className="supervisor-layout-logout"
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
        className="supervisor-layout-main"
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
          className="supervisor-layout-topbar"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="supervisor-layout-topbar-left">
            <button
              type="button"
              className="supervisor-layout-menu-button"
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

          <div className="supervisor-layout-topbar-right">
            {/* ===============================================
                NOTIFICATIONS
            =============================================== */}
            <div className="notification-wrapper">
              <button
                type="button"
                className="supervisor-layout-notification"
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
                    <span>Payment and maintenance alerts appear here.</span>
                  </div>
                </div>
              )}
            </div>

            {/* ===============================================
                PROFILE
            =============================================== */}
            <div className="supervisor-layout-profile">
              <button
                type="button"
                className="supervisor-layout-profile-button"
                onClick={() => {
                  setProfileOpen((previous) => !previous);

                  setNotificationOpen(false);
                }}
              >
                <div className="supervisor-layout-profile-avatar">
                  {supervisor.initials}
                </div>

                <div className="supervisor-layout-profile-info">
                  <strong>{supervisor.name}</strong>
                  <span>Supervisor</span>
                </div>

                <ChevronDown
                  size={16}
                  className={profileOpen ? "profile-chevron-open" : ""}
                />
              </button>

              {profileOpen && (
                <div className="supervisor-layout-profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="supervisor-layout-profile-avatar">
                      {supervisor.initials}
                    </div>

                    <div>
                      <strong>{supervisor.name}</strong>

                      <span>{supervisor.email}</span>
                    </div>
                  </div>

                  <div className="profile-dropdown-divider" />

                  <Link
                    to="/supervisor/profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={16} />
                    Profile Settings
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
        <div className="supervisor-layout-content">{children}</div>
      </main>
    </div>
  );
}

export default SupervisorLayout;
