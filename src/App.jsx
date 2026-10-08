import { Routes, Route } from "react-router-dom";

// ======================================================
// Landing
// ======================================================
import LandingPage from "./components/landing/LandingPage";

// ======================================================
// AUTH
// ======================================================
import Login from "./components/auth/Login";
import OwnerSignup from "./components/auth/OwnerSignup";
import SupervisorSignup from "./components/auth/SupervisorSignup";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";

// ======================================================
// OWNER
// ======================================================
import OwnerDashboard from "./components/owner/OwnerDashboard";
import Hostels from "./components/owner/Hostels";
import HostelDetails from "./components/owner/HostelDetails";
import Supervisors from "./components/owner/Supervisors";
import Students from "./components/owner/Students";
import Workers from "./components/owner/Workers";
import Payments from "./components/owner/Payments";
import Subscription from "./components/owner/Subscription";
import OwnerProfile from "./components/owner/OwnerProfile";

// NEW OWNER COMPONENTS
import OwnerBedAvailability from "./components/owner/BedAvailability";
import OwnerDueTracker from "./components/owner/DueTracker";
import OwnerRepairRequests from "./components/owner/RepairRequests";

// ======================================================
// SUPERVISOR
// ======================================================
import SupervisorDashboard from "./components/supervisor/SupervisorDashboard";
import SupervisorStudents from "./components/supervisor/Students";
import SupervisorWorkers from "./components/supervisor/Workers";
import SupervisorPayments from "./components/supervisor/Payments";
import SupervisorProfile from "./components/supervisor/SupervisorProfile";

// NEW SUPERVISOR COMPONENTS
import SupervisorBedAvailability from "./components/supervisor/BedAvailability";
import SupervisorDueTracker from "./components/supervisor/DueTracker";
import SupervisorRepairRequests from "./components/supervisor/RepairRequests";

function App() {
  return (
    <Routes>
      
      {/* ==================================================
          Landing Routes
      ================================================== */}
      <Route path="/" element={<LandingPage />} />


      {/* ==================================================
          AUTH ROUTES
      ================================================== */}

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<OwnerSignup />} />
      <Route path="/signup/owner" element={<OwnerSignup />} />
      <Route path="/owner/signup" element={<OwnerSignup />} />

      <Route path="/signup/supervisor" element={<SupervisorSignup />} />
      <Route path="/supervisor/signup" element={<SupervisorSignup />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      {/* ==================================================
          OWNER ROUTES
      ================================================== */}

      <Route path="/owner/dashboard" element={<OwnerDashboard />} />

      <Route path="/owner/hostels" element={<Hostels />} />

      <Route path="/owner/hostels/:id" element={<HostelDetails />} />

      <Route
        path="/owner/bed-availability"
        element={<OwnerBedAvailability />}
      />

      <Route path="/owner/supervisors" element={<Supervisors />} />

      <Route path="/owner/students" element={<Students />} />

      <Route path="/owner/due-tracker" element={<OwnerDueTracker />} />

      <Route path="/owner/workers" element={<Workers />} />

      <Route path="/owner/payments" element={<Payments />} />

      <Route path="/owner/repairs" element={<OwnerRepairRequests />} />

      <Route path="/owner/subscription" element={<Subscription />} />

      <Route path="/owner/profile" element={<OwnerProfile />} />

      {/* ==================================================
          SUPERVISOR ROUTES
      ================================================== */}

      <Route path="/supervisor/dashboard" element={<SupervisorDashboard />} />

      <Route path="/supervisor/students" element={<SupervisorStudents />} />

      <Route
        path="/supervisor/bed-availability"
        element={<SupervisorBedAvailability />}
      />

      <Route
        path="/supervisor/due-tracker"
        element={<SupervisorDueTracker />}
      />

      <Route path="/supervisor/workers" element={<SupervisorWorkers />} />

      <Route path="/supervisor/payments" element={<SupervisorPayments />} />

      <Route
        path="/supervisor/repairs"
        element={<SupervisorRepairRequests />}
      />

      <Route path="/supervisor/profile" element={<SupervisorProfile />} />
    </Routes>
  );
}

export default App;
