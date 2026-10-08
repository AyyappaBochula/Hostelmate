// src/services/api.js
/**
 * HostelHub API Service Layer
 *
 * This file serves as the centralized interface for all backend communications.
 * Currently, each function uses our comprehensive demo data store and local persistence.
 *
 * BACKEND DEVELOPER GUIDE:
 * To connect each API to your real backend server (e.g., Node/Express, Django, Spring Boot, FastAPI, Laravel):
 * 1. Set `USE_MOCK_API = false` below or configure `VITE_API_URL` in your .env file.
 * 2. Each function contains a commented-out standard `fetch` / `axios` call template.
 * 3. Uncomment the production call and remove/bypass the mock fallback.
 */

import {
  demoHostels,
  demoSupervisors,
  demoStudents,
  demoWorkers,
  demoPayments,
  demoDues,
  initialRepairs,
  demoSubscription,
  demoOwnerProfile,
  demoSupervisorProfile,
} from "../data/hostelDemoData";

// Set to true for UI demo mode, or false to call your live REST backend
export const USE_MOCK_API = true;

// Configure your backend base URL (e.g., "http://localhost:5000/api" or from .env)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper for auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Simulated network delay helper for realistic UX testing (loading spinners, etc.)
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// LOCAL PERSISTENT STORE (Initializes from hostelDemoData on first load)
// ============================================================================
const getStore = (key, fallback) => {
  try {
    const data = localStorage.getItem(`hostelhub_${key}`);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

const setStore = (key, value) => {
  try {
    localStorage.setItem(`hostelhub_${key}`, JSON.stringify(value));
  } catch (err) {
    console.error("Storage write error", err);
  }
};

// Initialize persistent state
let hostelsStore = getStore("hostels", demoHostels);
let supervisorsStore = getStore("supervisors", demoSupervisors);
let studentsStore = getStore("students", demoStudents);
let workersStore = getStore("workers", demoWorkers);
let paymentsStore = getStore("payments", demoPayments);
let duesStore = getStore("dues", demoDues);
let repairsStore = getStore("repairs", initialRepairs);
let subscriptionStore = getStore("subscription", demoSubscription);
let ownerProfileStore = getStore("ownerProfile", demoOwnerProfile);
let supervisorProfileStore = getStore(
  "supervisorProfile",
  demoSupervisorProfile
);

// ============================================================================
// 1. AUTHENTICATION APIS
// ============================================================================
export const authApi = {
  /**
   * User login (Owner or Supervisor)
   * Backend Endpoint: POST /api/auth/login
   */
  login: async (credentials) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/auth/login`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(credentials)
       });
       if (!response.ok) throw new Error("Login failed");
       return await response.json();
    ========================================================================= */
    await delay();
    const { email, role = "OWNER" } = credentials;
    const token = `mock-jwt-token-${Date.now()}`;
    const user = {
      id: 1,
      email: email || "vinay@example.com",
      role: role.toUpperCase(),
      name: role.toUpperCase() === "OWNER" ? "Vinay Kumar" : "Ravi Kumar",
    };
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userRole", user.role);
    return { success: true, token, user };
  },

  /**
   * Owner Registration
   * Backend Endpoint: POST /api/auth/owner/signup
   */
  signupOwner: async (ownerData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/auth/owner/signup`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(ownerData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    return { success: true, message: "Owner account registered successfully!" };
  },

  /**
   * Supervisor Registration / Invite Acceptance
   * Backend Endpoint: POST /api/auth/supervisor/signup
   */
  signupSupervisor: async (supervisorData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/auth/supervisor/signup`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(supervisorData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    return {
      success: true,
      message: "Supervisor account registered successfully!",
    };
  },

  /**
   * Forgot Password request
   * Backend Endpoint: POST /api/auth/forgot-password
   */
  forgotPassword: async (email) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ email })
       });
       return await response.json();
    ========================================================================= */
    await delay();
    return {
      success: true,
      message: "Password reset link sent to your registered email.",
    };
  },

  /**
   * Reset Password
   * Backend Endpoint: POST /api/auth/reset-password
   */
  resetPassword: async ({ token, newPassword }) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ token, newPassword })
       });
       return await response.json();
    ========================================================================= */
    await delay();
    return { success: true, message: "Password reset successfully!" };
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
  },
};

// ============================================================================
// 2. DASHBOARD APIS (Owner & Supervisor)
// ============================================================================
export const dashboardApi = {
  /**
   * Get Owner Dashboard Stats & Overview
   * Backend Endpoint: GET /api/owner/dashboard
   */
  getOwnerDashboardStats: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/owner/dashboard`, {
         headers: getAuthHeaders()
       });
       if (!response.ok) throw new Error("Failed to load dashboard data");
       return await response.json();
    ========================================================================= */
    await delay();

    const allHostels = hostelsStore;
    const allStudents = studentsStore;
    const allWorkers = workersStore;
    const allSupervisors = supervisorsStore;
    const allPayments = paymentsStore;
    const allDues = duesStore;

    // Calculate beds
    const allBeds = allHostels.flatMap((h) =>
      (h.floors || []).flatMap((f) =>
        (f.rooms || []).flatMap((r) => r.beds || [])
      )
    );

    const totalRooms = allHostels.reduce(
      (acc, h) =>
        acc +
        (h.floors || []).reduce((fAcc, f) => fAcc + (f.rooms || []).length, 0),
      0
    );

    const occupiedBeds = allBeds.filter((b) => b.status === "occupied").length;
    const availableBeds = allBeds.filter(
      (b) => b.status === "available"
    ).length;
    const totalBeds = allBeds.length || 30;

    const monthlyCollection = allPayments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );

    const pendingDues = allDues
      .filter((d) => d.status !== "paid")
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    const overdueDues = allDues
      .filter((d) => d.status !== "paid" && (d.daysOverdue > 0 || true))
      .reduce((sum, d) => sum + (Number(d.amount) || 0) * 0.45, 0);

    return {
      stats: {
        totalHostels: allHostels.length,
        totalSupervisors: allSupervisors.filter((s) => s.status === "active")
          .length,
        totalStudents: allStudents.length,
        activeStudents: allStudents.filter((s) => s.status === "active").length,
        totalWorkers: allWorkers.length,
        totalRooms: totalRooms || 10,
        totalBeds,
        occupiedBeds,
        availableBeds,
        monthlyCollection,
        pendingDues,
        overdueDues: Math.round(overdueDues),
        trialDaysRemaining: subscriptionStore.trial_days_remaining || 24,
        trialTotalDays: subscriptionStore.trial_total_days || 30,
      },
      recentStudents: allStudents.slice(0, 5).map((s) => ({
        id: s.id,
        name: s.name,
        hostel: s.hostel_name,
        room: `Room ${s.room_number || "101"}`,
        bed: s.bed_number || "B1",
        joined: s.joining_date || "05 Oct 2026",
      })),
      recentPayments: allPayments.slice(0, 5).map((p) => ({
        id: p.id,
        student: p.student,
        amount: p.amount,
        type: p.type || "Rent",
        mode: p.payment_mode || p.mode || "UPI",
        status: p.status || "Paid",
        date: p.payment_date || "07 Oct 2026",
      })),
    };
  },

  /**
   * Get Supervisor Dashboard Stats & Overview
   * Backend Endpoint: GET /api/supervisor/dashboard
   */
  getSupervisorDashboardStats: async (supervisorId = 1) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/supervisor/dashboard?supervisorId=${supervisorId}`, {
         headers: getAuthHeaders()
       });
       return await response.json();
    ========================================================================= */
    await delay();

    const assignedHostel = hostelsStore.find((h) => h.id === 1) || hostelsStore[0];
    const hostelStudents = studentsStore.filter(
      (s) => s.hostel_id === assignedHostel.id
    );
    const hostelWorkers = workersStore.filter(
      (w) => w.hostelId === assignedHostel.id || w.hostel === assignedHostel.name
    );
    const hostelPayments = paymentsStore.filter(
      (p) => p.hostelId === assignedHostel.id || p.hostel === assignedHostel.name
    );

    const beds = (assignedHostel.floors || []).flatMap((f) =>
      (f.rooms || []).flatMap((r) => r.beds || [])
    );

    const totalBeds = beds.length || 12;
    const occupiedBeds = beds.filter((b) => b.status === "occupied").length || 8;
    const availableBeds = beds.filter((b) => b.status === "available").length || 4;

    const monthlyCollection = hostelPayments.reduce(
      (sum, p) => sum + (Number(p.amount) || 0),
      0
    );

    return {
      assignedHostels: 1,
      hostelName: assignedHostel.name,
      totalStudents: hostelStudents.length,
      activeStudents: hostelStudents.filter((s) => s.status === "active").length,
      totalBeds,
      occupiedBeds,
      availableBeds,
      workers: hostelWorkers.length,
      todayCollection: 11000,
      monthlyCollection,
      pendingDues: 16500,
      recentStudents: hostelStudents.slice(0, 4).map((s) => ({
        id: s.id,
        name: s.name,
        room: s.room_number,
        bed: s.bed_number,
        date: s.joining_date,
      })),
      recentPayments: hostelPayments.slice(0, 4).map((p) => ({
        id: p.id,
        student: p.student,
        amount: p.amount,
        mode: p.payment_mode || "UPI",
      })),
    };
  },
};

// ============================================================================
// 3. HOSTEL MANAGEMENT APIS
// ============================================================================
export const hostelsApi = {
  /**
   * Get all hostels for owner
   * Backend Endpoint: GET /api/hostels
   */
  getHostels: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return [...hostelsStore];
  },

  /**
   * Get single hostel details with floors, rooms, and beds
   * Backend Endpoint: GET /api/hostels/:id
   */
  getHostelById: async (id) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels/${id}`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    const hostel = hostelsStore.find((h) => h.id === Number(id));
    return hostel || hostelsStore[0];
  },

  /**
   * Create a new hostel property
   * Backend Endpoint: POST /api/hostels
   */
  createHostel: async (hostelData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(hostelData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const newHostel = {
      id: Date.now(),
      name: hostelData.hostel_name,
      hostel_name: hostelData.hostel_name,
      hostel_type: hostelData.hostel_type || "Boys",
      type: hostelData.hostel_type || "Boys",
      address: hostelData.address || "",
      city: hostelData.city || "Visakhapatnam",
      state: hostelData.state || "Andhra Pradesh",
      pincode: hostelData.pincode || "530001",
      status: "active",
      supervisor: {
        id: null,
        name: "Not Assigned",
        phone: "-",
      },
      floors: [],
    };
    hostelsStore = [newHostel, ...hostelsStore];
    setStore("hostels", hostelsStore);
    return newHostel;
  },

  /**
   * Update hostel details
   * Backend Endpoint: PUT /api/hostels/:id
   */
  updateHostel: async (id, hostelData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels/${id}`, {
         method: "PUT",
         headers: getAuthHeaders(),
         body: JSON.stringify(hostelData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    hostelsStore = hostelsStore.map((h) =>
      h.id === Number(id) ? { ...h, ...hostelData } : h
    );
    setStore("hostels", hostelsStore);
    return hostelsStore.find((h) => h.id === Number(id));
  },

  /**
   * Add floor to hostel
   * Backend Endpoint: POST /api/hostels/:id/floors
   */
  addFloor: async (hostelId, floorData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}/floors`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(floorData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const newFloor = {
      id: Date.now(),
      floor_number: Number(floorData.floor_number),
      name: floorData.floor_name,
      floor_name: floorData.floor_name,
      rooms: [],
    };

    hostelsStore = hostelsStore.map((h) => {
      if (h.id === Number(hostelId)) {
        return {
          ...h,
          floors: [...(h.floors || []), newFloor],
        };
      }
      return h;
    });
    setStore("hostels", hostelsStore);
    return newFloor;
  },

  /**
   * Add room to floor
   * Backend Endpoint: POST /api/hostels/:hostelId/floors/:floorId/rooms
   */
  addRoom: async (hostelId, floorId, roomData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}/floors/${floorId}/rooms`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(roomData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const capacity = Number(roomData.capacity) || 3;
    const generatedBeds = Array.from({ length: capacity }, (_, i) => ({
      id: Date.now() + i,
      number: `B${i + 1}`,
      bed_number: `B${i + 1}`,
      status: "available",
      student: null,
      studentId: null,
    }));

    const newRoom = {
      id: Date.now(),
      number: roomData.room_number,
      room_number: roomData.room_number,
      capacity,
      monthly_rent: Number(roomData.monthly_rent) || 5000,
      status: "active",
      beds: generatedBeds,
    };

    hostelsStore = hostelsStore.map((h) => {
      if (h.id === Number(hostelId)) {
        return {
          ...h,
          floors: (h.floors || []).map((f) => {
            if (f.id === Number(floorId)) {
              return {
                ...f,
                rooms: [...(f.rooms || []), newRoom],
              };
            }
            return f;
          }),
        };
      }
      return h;
    });
    setStore("hostels", hostelsStore);
    return newRoom;
  },

  /**
   * Add bed to room
   * Backend Endpoint: POST /api/hostels/:hostelId/rooms/:roomId/beds
   */
  addBed: async (hostelId, floorId, roomId, bedData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/hostels/${hostelId}/rooms/${roomId}/beds`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(bedData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const newBed = {
      id: Date.now(),
      number: bedData.bed_number,
      bed_number: bedData.bed_number,
      status: "available",
      student: null,
      studentId: null,
    };

    hostelsStore = hostelsStore.map((h) => {
      if (h.id === Number(hostelId)) {
        return {
          ...h,
          floors: (h.floors || []).map((f) => {
            if (f.id === Number(floorId)) {
              return {
                ...f,
                rooms: (f.rooms || []).map((r) => {
                  if (r.id === Number(roomId)) {
                    return {
                      ...r,
                      capacity: (r.beds || []).length + 1,
                      beds: [...(r.beds || []), newBed],
                    };
                  }
                  return r;
                }),
              };
            }
            return f;
          }),
        };
      }
      return h;
    });
    setStore("hostels", hostelsStore);
    return newBed;
  },
};

// ============================================================================
// 4. SUPERVISORS APIS
// ============================================================================
export const supervisorsApi = {
  /**
   * Get all supervisors
   * Backend Endpoint: GET /api/supervisors
   */
  getSupervisors: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/supervisors`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return [...supervisorsStore];
  },

  /**
   * Send invite to supervisor
   * Backend Endpoint: POST /api/supervisors/invite
   */
  inviteSupervisor: async ({ email, hostelId, name }) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/supervisors/invite`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify({ email, hostelId, name })
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const targetHostel = hostelsStore.find((h) => h.id === Number(hostelId));
    const newSupervisor = {
      id: Date.now(),
      name: name || "Invitation Sent",
      email,
      phone: "-",
      hostel: targetHostel ? targetHostel.name : "Not assigned",
      hostelId: targetHostel ? targetHostel.id : null,
      invite_status: "pending",
      status: "inactive",
      joiningDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    };
    supervisorsStore = [newSupervisor, ...supervisorsStore];
    setStore("supervisors", supervisorsStore);
    return newSupervisor;
  },

  /**
   * Toggle active/inactive status
   * Backend Endpoint: PATCH /api/supervisors/:id/status
   */
  toggleStatus: async (id) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/supervisors/${id}/status`, {
         method: "PATCH",
         headers: getAuthHeaders()
       });
       return await response.json();
    ========================================================================= */
    await delay();
    supervisorsStore = supervisorsStore.map((s) =>
      s.id === Number(id)
        ? { ...s, status: s.status === "active" ? "inactive" : "active" }
        : s
    );
    setStore("supervisors", supervisorsStore);
    return supervisorsStore.find((s) => s.id === Number(id));
  },
};

// ============================================================================
// 5. STUDENTS APIS
// ============================================================================
export const studentsApi = {
  /**
   * Get all students
   * Backend Endpoint: GET /api/students
   */
  getStudents: async (hostelId = null) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const url = hostelId ? `${API_BASE_URL}/students?hostelId=${hostelId}` : `${API_BASE_URL}/students`;
       const response = await fetch(url, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    if (hostelId && hostelId !== "all") {
      return studentsStore.filter((s) => s.hostel_id === Number(hostelId));
    }
    return [...studentsStore];
  },

  /**
   * Get student by ID
   * Backend Endpoint: GET /api/students/:id
   */
  getStudentById: async (id) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/students/${id}`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return studentsStore.find((s) => s.id === Number(id));
  },

  /**
   * Create new student admission and assign bed
   * Backend Endpoint: POST /api/students
   */
  createStudent: async (studentData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/students`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(studentData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const newStudent = {
      id: Date.now(),
      ...studentData,
      status: "active",
      joining_date:
        studentData.joining_date || new Date().toISOString().split("T")[0],
    };

    studentsStore = [newStudent, ...studentsStore];
    setStore("students", studentsStore);

    // Also update bed status in hostel structure to occupied
    if (studentData.hostel_id && studentData.bed_id) {
      hostelsStore = hostelsStore.map((h) => {
        if (h.id === Number(studentData.hostel_id)) {
          return {
            ...h,
            floors: (h.floors || []).map((f) => ({
              ...f,
              rooms: (f.rooms || []).map((r) => ({
                ...r,
                beds: (r.beds || []).map((b) => {
                  if (b.id === Number(studentData.bed_id)) {
                    return {
                      ...b,
                      status: "occupied",
                      student: newStudent.name,
                      studentId: newStudent.id,
                    };
                  }
                  return b;
                }),
              })),
            })),
          };
        }
        return h;
      });
      setStore("hostels", hostelsStore);
    }

    return newStudent;
  },

  /**
   * Vacate student / Mark inactive
   * Backend Endpoint: POST /api/students/:id/vacate
   */
  vacateStudent: async (id) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/students/${id}/vacate`, {
         method: "POST",
         headers: getAuthHeaders()
       });
       return await response.json();
    ========================================================================= */
    await delay();
    studentsStore = studentsStore.map((s) =>
      s.id === Number(id) ? { ...s, status: "inactive" } : s
    );
    setStore("students", studentsStore);
    return { success: true };
  },
};

// ============================================================================
// 6. WORKERS APIS
// ============================================================================
export const workersApi = {
  /**
   * Get all workers
   * Backend Endpoint: GET /api/workers
   */
  getWorkers: async (hostelId = null) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/workers`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    if (hostelId && hostelId !== "all") {
      return workersStore.filter((w) => w.hostelId === Number(hostelId));
    }
    return [...workersStore];
  },

  /**
   * Add new worker
   * Backend Endpoint: POST /api/workers
   */
  createWorker: async (workerData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/workers`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(workerData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const newWorker = {
      id: Date.now(),
      ...workerData,
      status: "active",
      salary: Number(workerData.salary) || 0,
    };
    workersStore = [newWorker, ...workersStore];
    setStore("workers", workersStore);
    return newWorker;
  },
};

// ============================================================================
// 7. PAYMENTS APIS
// ============================================================================
export const paymentsApi = {
  /**
   * Get all payment transactions
   * Backend Endpoint: GET /api/payments
   */
  getPayments: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/payments`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return [...paymentsStore];
  },

  /**
   * Record new rent/deposit payment
   * Backend Endpoint: POST /api/payments
   */
  recordPayment: async (paymentData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/payments`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(paymentData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const receipt_no = `HST-2026-${String(paymentsStore.length + 1).padStart(
      6,
      "0"
    )}`;
    const newPayment = {
      id: Date.now(),
      receipt_no,
      amount: Number(paymentData.amount) || 0,
      payment_date:
        paymentData.payment_date || new Date().toISOString().split("T")[0],
      status: "Paid",
      type: paymentData.payment_type || "Rent",
      payment_mode: paymentData.payment_mode || "UPI",
      mode: paymentData.payment_mode || "UPI",
      ...paymentData,
    };
    paymentsStore = [newPayment, ...paymentsStore];
    setStore("payments", paymentsStore);
    return newPayment;
  },
};

// ============================================================================
// 8. DUES & FOLLOW-UP APIS
// ============================================================================
export const duesApi = {
  /**
   * Get all dues
   * Backend Endpoint: GET /api/dues
   */
  getDues: async (hostelId = null) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/dues`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    if (hostelId && hostelId !== "all") {
      return duesStore.filter((d) => d.hostelId === Number(hostelId));
    }
    return [...duesStore];
  },

  /**
   * Send WhatsApp / SMS reminder to student or supervisor
   * Backend Endpoint: POST /api/dues/:id/remind
   */
  sendReminder: async (dueId, message) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/dues/${dueId}/remind`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify({ message })
       });
       return await response.json();
    ========================================================================= */
    await delay();
    return { success: true, message: "Reminder message dispatched successfully!" };
  },
};

// ============================================================================
// 9. REPAIRS & MAINTENANCE APIS
// ============================================================================
export const repairsApi = {
  /**
   * Get all repair requests
   * Backend Endpoint: GET /api/repairs
   */
  getRepairs: async (hostelId = null) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/repairs`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    if (hostelId && hostelId !== "all") {
      return repairsStore.filter((r) => r.hostelId === Number(hostelId));
    }
    return [...repairsStore];
  },

  /**
   * Create new repair ticket (Supervisor/Student)
   * Backend Endpoint: POST /api/repairs
   */
  createRepair: async (repairData) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/repairs`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify(repairData)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    const newRepair = {
      id: Date.now(),
      status: "Reported",
      createdAt: new Date().toISOString().split("T")[0],
      ...repairData,
    };
    repairsStore = [newRepair, ...repairsStore];
    setStore("repairs", repairsStore);
    return newRepair;
  },

  /**
   * Update repair status (Reported -> Acknowledged -> In Progress -> Resolved)
   * Backend Endpoint: PATCH /api/repairs/:id/status
   */
  updateRepairStatus: async (id, status) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/repairs/${id}/status`, {
         method: "PATCH",
         headers: getAuthHeaders(),
         body: JSON.stringify({ status })
       });
       return await response.json();
    ========================================================================= */
    await delay();
    repairsStore = repairsStore.map((r) =>
      r.id === Number(id) ? { ...r, status } : r
    );
    setStore("repairs", repairsStore);
    return repairsStore.find((r) => r.id === Number(id));
  },
};

// ============================================================================
// 10. SUBSCRIPTION & BILLING APIS
// ============================================================================
export const subscriptionApi = {
  /**
   * Get current subscription and trial details
   * Backend Endpoint: GET /api/subscription
   */
  getSubscription: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/subscription`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return { ...subscriptionStore };
  },

  /**
   * Apply discount coupon code
   * Backend Endpoint: POST /api/subscription/coupon
   */
  applyCoupon: async (couponCode) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/subscription/coupon`, {
         method: "POST",
         headers: getAuthHeaders(),
         body: JSON.stringify({ couponCode })
       });
       return await response.json();
    ========================================================================= */
    await delay();
    if (couponCode.toUpperCase() === "HOSTEL50" || couponCode.toUpperCase() === "WELCOME") {
      return { success: true, discountPercent: 50, finalPrice: 249 };
    }
    return { success: false, message: "Invalid or expired coupon code." };
  },
};

// ============================================================================
// 11. PROFILE APIS
// ============================================================================
export const profileApi = {
  /**
   * Get Owner Profile
   * Backend Endpoint: GET /api/owner/profile
   */
  getOwnerProfile: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/owner/profile`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return { ...ownerProfileStore };
  },

  /**
   * Update Owner Profile
   * Backend Endpoint: PUT /api/owner/profile
   */
  updateOwnerProfile: async (data) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/owner/profile`, {
         method: "PUT",
         headers: getAuthHeaders(),
         body: JSON.stringify(data)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    ownerProfileStore = { ...ownerProfileStore, ...data };
    setStore("ownerProfile", ownerProfileStore);
    return ownerProfileStore;
  },

  /**
   * Get Supervisor Profile
   * Backend Endpoint: GET /api/supervisor/profile
   */
  getSupervisorProfile: async () => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/supervisor/profile`, { headers: getAuthHeaders() });
       return await response.json();
    ========================================================================= */
    await delay();
    return { ...supervisorProfileStore };
  },

  /**
   * Update Supervisor Profile
   * Backend Endpoint: PUT /api/supervisor/profile
   */
  updateSupervisorProfile: async (data) => {
    /* =========================================================================
       BACKEND INTEGRATION:
       const response = await fetch(`${API_BASE_URL}/supervisor/profile`, {
         method: "PUT",
         headers: getAuthHeaders(),
         body: JSON.stringify(data)
       });
       return await response.json();
    ========================================================================= */
    await delay();
    supervisorProfileStore = { ...supervisorProfileStore, ...data };
    setStore("supervisorProfile", supervisorProfileStore);
    return supervisorProfileStore;
  },
};
