import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import HostelFilter from "../common/HostelFilter";
import { hostelsApi, studentsApi } from "../../services/api";
import "./Students.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  aadhaar_no: "",
  address: "",
  parent_name: "",
  parent_phone: "",
  emergency_contact: "",
  date_of_birth: "",
  gender: "Male",
  joining_date: "",
  hostel_id: "",
  floor_id: "",
  room_id: "",
  bed_id: "",
  monthly_rent: 5500,
  deposit: 5500,
};

function Students() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedHostel, setSelectedHostel] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);

  const [hostels, setHostels] = useState([]);
  const [students, setStudents] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hostData, studData] = await Promise.all([
        hostelsApi.getHostels(),
        studentsApi.getStudents(),
      ]);
      setHostels(hostData || []);
      setStudents(studData || []);

      if (hostData && hostData.length > 0 && !form.hostel_id) {
        setForm((prev) => ({
          ...prev,
          hostel_id: hostData[0].id,
        }));
      }
    } catch (err) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Floor, Room, Bed cascade
  const activeHostel = hostels.find(
    (h) => Number(h.id) === Number(form.hostel_id)
  );
  const activeFloors = activeHostel ? activeHostel.floors || [] : [];
  const activeFloor = activeFloors.find(
    (f) => Number(f.id) === Number(form.floor_id)
  );
  const activeRooms = activeFloor ? activeFloor.rooms || [] : [];
  const activeRoom = activeRooms.find(
    (r) => Number(r.id) === Number(form.room_id)
  );
  const activeBeds = activeRoom
    ? (activeRoom.beds || []).filter((b) => b.status === "available")
    : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "hostel_id") {
        updated.floor_id = "";
        updated.room_id = "";
        updated.bed_id = "";
      } else if (name === "floor_id") {
        updated.room_id = "";
        updated.bed_id = "";
      } else if (name === "room_id") {
        updated.bed_id = "";
      }
      return updated;
    });
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      alert("Please fill in the student's name and mobile number.");
      return;
    }

    try {
      const selectedHostelObj = hostels.find(
        (h) => Number(h.id) === Number(form.hostel_id)
      );
      const selectedRoomObj = activeRooms.find(
        (r) => Number(r.id) === Number(form.room_id)
      );
      const selectedBedObj = (activeRoom ? activeRoom.beds || [] : []).find(
        (b) => Number(b.id) === Number(form.bed_id)
      );

      const payload = {
        ...form,
        hostel_name: selectedHostelObj ? selectedHostelObj.name : "Hostel",
        room_number: selectedRoomObj ? selectedRoomObj.number : "101",
        bed_number: selectedBedObj ? selectedBedObj.number : "B1",
      };

      const created = await studentsApi.createStudent(payload);
      setStudents((prev) => [created, ...prev]);
      setShowModal(false);
      setForm(initialForm);
      loadData(); // refresh hostel bed occupancy
    } catch (err) {
      console.error("Failed to create student:", err);
      alert("Error admitting student.");
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesHostel =
      selectedHostel === "all" ||
      Number(student.hostel_id) === Number(selectedHostel);
    const matchesStatus =
      statusFilter === "all" || student.status === statusFilter;
    const matchesSearch =
      `${student.name} ${student.phone} ${student.room_number || ""} ${
        student.hostel_name || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase());

    return matchesHostel && matchesStatus && matchesSearch;
  });

  return (
    <OwnerLayout title="Students">
      <div className="owner-page-heading">
        <div>
          <span>RESIDENT MANAGEMENT</span>
          <h1>Students & Residents</h1>
          <p>
            Manage student registrations, bed allocations, contact information,
            and stay records.
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
            Register Student
          </button>
        </div>
      </div>

      <HostelFilter
        hostels={hostels}
        selectedHostel={selectedHostel}
        onChange={setSelectedHostel}
      />

      <section className="owner-page-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search student by name, mobile number, room or hostel..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Hostel</th>
                <th>Room & Bed</th>
                <th>Mobile</th>
                <th>Monthly Rent</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <strong>{student.name}</strong>
                    <small>{student.email || student.phone}</small>
                  </td>

                  <td>
                    <span className="owner-table-hostel-tag">
                      <Building2 size={13} />
                      {student.hostel_name || "Sunrise Boys Hostel"}
                    </span>
                  </td>

                  <td>
                    <span className="owner-room-pill">
                      Room {student.room_number || "101"} ({student.bed_number || "B1"})
                    </span>
                  </td>

                  <td>{student.phone}</td>

                  <td>
                    ₹{(student.monthly_rent || 5500).toLocaleString("en-IN")}
                  </td>

                  <td>{student.joining_date || "2026-08-01"}</td>

                  <td>
                    <span
                      className={`owner-table-status ${
                        student.status === "active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      {student.status || "active"}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="owner-table-button"
                      title="View Student Profile"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* VIEW STUDENT DETAILS MODAL */}
      {selectedStudent && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>STUDENT PROFILE</span>
                <h2>{selectedStudent.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="owner-student-profile-view">
              <div className="owner-profile-field-grid">
                <div>
                  <small>Mobile Number</small>
                  <strong>{selectedStudent.phone}</strong>
                </div>
                <div>
                  <small>Email</small>
                  <strong>{selectedStudent.email || "-"}</strong>
                </div>
                <div>
                  <small>Assigned Hostel</small>
                  <strong>{selectedStudent.hostel_name}</strong>
                </div>
                <div>
                  <small>Room & Bed</small>
                  <strong>
                    Room {selectedStudent.room_number}, Bed {selectedStudent.bed_number}
                  </strong>
                </div>
                <div>
                  <small>Monthly Rent</small>
                  <strong>₹{(selectedStudent.monthly_rent || 5500).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <small>Security Deposit</small>
                  <strong>₹{(selectedStudent.deposit || 5500).toLocaleString("en-IN")}</strong>
                </div>
                <div>
                  <small>Parent Name & Phone</small>
                  <strong>
                    {selectedStudent.parent_name || "-"} ({selectedStudent.parent_phone || "-"})
                  </strong>
                </div>
                <div>
                  <small>Permanent Address</small>
                  <strong>{selectedStudent.address || "-"}</strong>
                </div>
                <div>
                  <small>Aadhaar Number</small>
                  <strong>{selectedStudent.aadhaar_no || "-"}</strong>
                </div>
                <div>
                  <small>Admission Date</small>
                  <strong>{selectedStudent.joining_date}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADMISSION MODAL */}
      {showModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>NEW ADMISSION</span>
                <h2>Register Student</h2>
              </div>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddStudent}>
              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Student Full Name *</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Rahul Kumar"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label className="owner-form-field">
                  <span>Mobile Number *</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="student@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </label>

                <label className="owner-form-field">
                  <span>Aadhaar Number</span>
                  <input
                    type="text"
                    name="aadhaar_no"
                    placeholder="12-digit Aadhaar"
                    value={form.aadhaar_no}
                    onChange={handleChange}
                  />
                </label>
              </div>

              {/* HOSTEL & BED CASCADE */}
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
                      {h.name || h.hostel_name} ({h.city})
                    </option>
                  ))}
                </select>
              </label>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Floor</span>
                  <select
                    name="floor_id"
                    value={form.floor_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Floor --</option>
                    {activeFloors.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name || f.floor_name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Room</span>
                  <select
                    name="room_id"
                    value={form.room_id}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Room --</option>
                    {activeRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        Room {r.number || r.room_number} (
                        {(r.beds || []).filter((b) => b.status === "available").length} free beds)
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Available Bed *</span>
                  <select
                    name="bed_id"
                    value={form.bed_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Select Bed --</option>
                    {activeBeds.map((b) => (
                      <option key={b.id} value={b.id}>
                        Bed {b.number || b.bed_number} (Available)
                      </option>
                    ))}
                  </select>
                </label>

                <label className="owner-form-field">
                  <span>Monthly Rent (₹)</span>
                  <input
                    type="number"
                    name="monthly_rent"
                    value={form.monthly_rent}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Parent / Guardian Name</span>
                  <input
                    type="text"
                    name="parent_name"
                    placeholder="Parent Name"
                    value={form.parent_name}
                    onChange={handleChange}
                  />
                </label>

                <label className="owner-form-field">
                  <span>Parent Phone Number</span>
                  <input
                    type="tel"
                    name="parent_phone"
                    placeholder="Parent Contact"
                    value={form.parent_phone}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <label className="owner-form-field">
                <span>Permanent Address</span>
                <input
                  type="text"
                  name="address"
                  placeholder="Home address with city & state"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Complete Admission
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

export default Students;
