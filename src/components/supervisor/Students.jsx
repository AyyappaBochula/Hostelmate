import { useEffect, useState } from "react";
import {
  BedDouble,
  Building2,
  Eye,
  LogOut,
  Plus,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
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
  hostel_id: "1",
  floor_id: "",
  room_id: "",
  bed_id: "",
  monthly_rent: 5500,
  deposit: 5500,
};

function Students() {
  const [search, setSearch] = useState("");
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
        studentsApi.getStudents(1), // Supervisor hostel ID = 1
      ]);
      setHostels(hostData || []);
      setStudents(studData || []);

      if (hostData && hostData.length > 0) {
        setForm((prev) => ({
          ...prev,
          hostel_id: hostData[0].id,
        }));
      }
    } catch (err) {
      console.error("Failed to load supervisor students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      alert("Please fill in student name and mobile number.");
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
      loadData();
    } catch (err) {
      console.error("Failed to add student:", err);
      alert("Error admitting student.");
    }
  };

  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.phone} ${student.room_number || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <SupervisorLayout title="Students">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">RESIDENTS</span>
          <h1>Hostel Students</h1>
          <p>
            Admit students, assign rooms and beds, and manage residents of{" "}
            <strong>Sunrise Boys Hostel</strong>.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadData}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="supervisor-primary-button"
            onClick={() => setShowModal(true)}
          >
            <Plus size={17} />
            Add Student
          </button>
        </div>
      </div>

      <section className="supervisor-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search student by name, phone or room number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="owner-table-wrapper">
          <table className="owner-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Room & Bed</th>
                <th>Mobile</th>
                <th>Parent Contact</th>
                <th>Monthly Rent</th>
                <th>Joining Date</th>
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
                    <span className="owner-room-pill">
                      Room {student.room_number || "101"} ({student.bed_number || "B1"})
                    </span>
                  </td>

                  <td>{student.phone}</td>

                  <td>
                    <small>
                      {student.parent_name || "-"} ({student.parent_phone || "-"})
                    </small>
                  </td>

                  <td>
                    <strong>₹{(student.monthly_rent || 5500).toLocaleString("en-IN")}</strong>
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
                      title="View Student Info"
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

      {/* VIEW MODAL */}
      {selectedStudent && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>STUDENT PROFILE</span>
                <h2>{selectedStudent.name}</h2>
              </div>
              <button type="button" onClick={() => setSelectedStudent(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="owner-profile-field-grid">
              <div>
                <small>Mobile Number</small>
                <strong>{selectedStudent.phone}</strong>
              </div>
              <div>
                <small>Room & Bed</small>
                <strong>Room {selectedStudent.room_number}, Bed {selectedStudent.bed_number}</strong>
              </div>
              <div>
                <small>Monthly Rent</small>
                <strong>₹{(selectedStudent.monthly_rent || 5500).toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <small>Parent Name & Phone</small>
                <strong>{selectedStudent.parent_name || "-"} ({selectedStudent.parent_phone || "-"})</strong>
              </div>
              <div>
                <small>Permanent Address</small>
                <strong>{selectedStudent.address || "-"}</strong>
              </div>
              <div>
                <small>Admission Date</small>
                <strong>{selectedStudent.joining_date}</strong>
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
                <span>NEW RESIDENT</span>
                <h2>Admit Student</h2>
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
                    placeholder="e.g. Sai Kiran"
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
                  <span>Parent Name</span>
                  <input
                    type="text"
                    name="parent_name"
                    placeholder="Parent Name"
                    value={form.parent_name}
                    onChange={handleChange}
                  />
                </label>

                <label className="owner-form-field">
                  <span>Parent Phone</span>
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
                  placeholder="Address with town/city"
                  value={form.address}
                  onChange={handleChange}
                />
              </label>

              <button
                type="submit"
                className="supervisor-primary-button owner-full-button"
              >
                Admit Student to Bed
              </button>
            </form>
          </div>
        </div>
      )}
    </SupervisorLayout>
  );
}

export default Students;
