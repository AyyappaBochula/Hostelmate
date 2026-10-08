import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BedDouble,
  Building2,
  DoorOpen,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { hostelsApi } from "../../services/api";
import "./Hostels.css";

function HostelDetails() {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showFloorModal, setShowFloorModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showBedModal, setShowBedModal] = useState(false);

  const [selectedFloorId, setSelectedFloorId] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [message, setMessage] = useState("");

  const [floorForm, setFloorForm] = useState({
    floor_number: "",
    floor_name: "",
  });

  const [roomForm, setRoomForm] = useState({
    room_number: "",
    capacity: "3",
    monthly_rent: "5500",
  });

  const [bedForm, setBedForm] = useState({
    bed_number: "",
  });

  const loadHostel = async () => {
    try {
      setLoading(true);
      const data = await hostelsApi.getHostelById(id);
      setHostel(data);
    } catch (err) {
      console.error("Failed to load hostel details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostel();
  }, [id]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  // ADD FLOOR
  const handleAddFloor = async (event) => {
    event.preventDefault();
    if (floorForm.floor_number === "" || !floorForm.floor_name.trim()) return;

    try {
      await hostelsApi.addFloor(id, floorForm);
      setFloorForm({ floor_number: "", floor_name: "" });
      setShowFloorModal(false);
      showMessage("Floor added successfully.");
      loadHostel();
    } catch (err) {
      console.error("Failed to add floor:", err);
    }
  };

  // ADD ROOM
  const handleAddRoom = async (event) => {
    event.preventDefault();
    if (!roomForm.room_number.trim() || !selectedFloorId) return;

    try {
      await hostelsApi.addRoom(id, selectedFloorId, roomForm);
      setRoomForm({ room_number: "", capacity: "3", monthly_rent: "5500" });
      setShowRoomModal(false);
      showMessage("Room and beds configured successfully.");
      loadHostel();
    } catch (err) {
      console.error("Failed to add room:", err);
    }
  };

  // ADD BED
  const handleAddBed = async (event) => {
    event.preventDefault();
    if (!bedForm.bed_number.trim() || !selectedRoom) return;

    try {
      await hostelsApi.addBed(
        id,
        selectedRoom.floorId,
        selectedRoom.id,
        bedForm
      );
      setBedForm({ bed_number: "" });
      setShowBedModal(false);
      showMessage("Bed added successfully.");
      loadHostel();
    } catch (err) {
      console.error("Failed to add bed:", err);
    }
  };

  const floors = hostel?.floors || [];

  return (
    <OwnerLayout title="Hostel Details">
      <div className="owner-page-heading">
        <div>
          <Link to="/owner/hostels" className="owner-back-link">
            <ArrowLeft size={16} />
            Back to Hostels
          </Link>
          <h1>{hostel ? hostel.name || hostel.hostel_name : "Hostel Details"}</h1>
          <p>
            Configure building floors, room numbers, bed capacities, and
            pricing.
          </p>
        </div>

        <div className="owner-welcome-actions">
          <button
            type="button"
            className="owner-secondary-button"
            onClick={loadHostel}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
          <button
            type="button"
            className="owner-primary-button"
            onClick={() => setShowFloorModal(true)}
          >
            <Plus size={18} />
            Add Floor
          </button>
        </div>
      </div>

      {message && (
        <div className="owner-success-banner">
          <span>✓ {message}</span>
        </div>
      )}

      {loading ? (
        <p className="owner-empty-text">Loading hostel layout...</p>
      ) : floors.length === 0 ? (
        <section className="owner-page-card text-center py-10">
          <DoorOpen size={48} className="mx-auto text-slate-400 mb-3" />
          <h3>No Floors Configured Yet</h3>
          <p className="text-slate-500 text-sm mb-4">
            Click "Add Floor" to create the first floor and start adding rooms & beds.
          </p>
          <button
            type="button"
            className="owner-primary-button"
            onClick={() => setShowFloorModal(true)}
          >
            <Plus size={18} />
            Add First Floor
          </button>
        </section>
      ) : (
        <div className="owner-floor-list">
          {floors.map((floor) => (
            <section className="bed-hostel-card" key={floor.id}>
              <div className="bed-hostel-heading">
                <div>
                  <span className="bed-hostel-icon">
                    <Building2 size={20} />
                  </span>
                  <div>
                    <h2>{floor.name || floor.floor_name}</h2>
                    <p>{(floor.rooms || []).length} Rooms configured</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="owner-secondary-button"
                  onClick={() => {
                    setSelectedFloorId(floor.id);
                    setShowRoomModal(true);
                  }}
                >
                  <Plus size={16} />
                  Add Room
                </button>
              </div>

              {(floor.rooms || []).length === 0 ? (
                <p className="owner-empty-text">No rooms added to this floor.</p>
              ) : (
                <div className="bed-room-grid">
                  {(floor.rooms || []).map((room) => (
                    <article className="bed-room-card" key={room.id}>
                      <div className="bed-room-heading">
                        <div>
                          <span>ROOM NUMBER</span>
                          <h4>Room {room.number || room.room_number}</h4>
                        </div>
                        <span className="room-fill-badge free">
                          Rent: ₹{(room.monthly_rent || 5500).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="bed-items mb-3">
                        {(room.beds || []).map((bed) => (
                          <div
                            key={bed.id}
                            className={`bed-item bed-${bed.status || "available"}`}
                          >
                            <BedDouble size={16} />
                            <div>
                              <strong>{bed.number || bed.bed_number}</strong>
                              <span>{bed.student || bed.status || "Available"}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        className="owner-secondary-button owner-full-button text-xs py-1"
                        onClick={() => {
                          setSelectedRoom({ ...room, floorId: floor.id });
                          setShowBedModal(true);
                        }}
                      >
                        <Plus size={13} />
                        Add Bed
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {/* ADD FLOOR MODAL */}
      {showFloorModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>BUILDING STRUCTURE</span>
                <h2>Add New Floor</h2>
              </div>
              <button type="button" onClick={() => setShowFloorModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFloor}>
              <label className="owner-form-field">
                <span>Floor Number (0 for Ground, 1 for First) *</span>
                <input
                  type="number"
                  placeholder="e.g. 1"
                  value={floorForm.floor_number}
                  onChange={(e) =>
                    setFloorForm({ ...floorForm, floor_number: e.target.value })
                  }
                  required
                />
              </label>

              <label className="owner-form-field">
                <span>Floor Name *</span>
                <input
                  type="text"
                  placeholder="e.g. First Floor"
                  value={floorForm.floor_name}
                  onChange={(e) =>
                    setFloorForm({ ...floorForm, floor_name: e.target.value })
                  }
                  required
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Add Floor to Hostel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD ROOM MODAL */}
      {showRoomModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>ROOM CONFIGURATION</span>
                <h2>Add Room to Floor</h2>
              </div>
              <button type="button" onClick={() => setShowRoomModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddRoom}>
              <div className="owner-form-two">
                <label className="owner-form-field">
                  <span>Room Number *</span>
                  <input
                    type="text"
                    placeholder="e.g. 201"
                    value={roomForm.room_number}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, room_number: e.target.value })
                    }
                    required
                  />
                </label>

                <label className="owner-form-field">
                  <span>Bed Sharing Capacity</span>
                  <select
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, capacity: e.target.value })
                    }
                  >
                    <option value="1">1 Sharing (Single)</option>
                    <option value="2">2 Sharing (Double)</option>
                    <option value="3">3 Sharing (Triple)</option>
                    <option value="4">4 Sharing (Four)</option>
                    <option value="5">5 Sharing (Five)</option>
                  </select>
                </label>
              </div>

              <label className="owner-form-field">
                <span>Monthly Rent per Bed (₹)</span>
                <input
                  type="number"
                  placeholder="e.g. 5500"
                  value={roomForm.monthly_rent}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, monthly_rent: e.target.value })
                  }
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Create Room & Beds
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD BED MODAL */}
      {showBedModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>BED ALLOCATION</span>
                <h2>Add Bed to Room {selectedRoom?.number}</h2>
              </div>
              <button type="button" onClick={() => setShowBedModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBed}>
              <label className="owner-form-field">
                <span>Bed Number / Label *</span>
                <input
                  type="text"
                  placeholder="e.g. B4"
                  value={bedForm.bed_number}
                  onChange={(e) =>
                    setBedForm({ bed_number: e.target.value })
                  }
                  required
                />
              </label>

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Add Bed
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

export default HostelDetails;
