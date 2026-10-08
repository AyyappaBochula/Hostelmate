import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  CircleCheck,
  CircleX,
  RefreshCw,
  Wrench,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import HostelFilter from "../common/HostelFilter";
import { hostelsApi } from "../../services/api";
import "./BedAvailability.css";

function BedAvailability() {
  const [selectedHostel, setSelectedHostel] = useState("all");
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHostels = async () => {
    try {
      setLoading(true);
      const data = await hostelsApi.getHostels();
      setHostels(data || []);
    } catch (err) {
      console.error("Failed to load bed availability:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const activeHostels = useMemo(
    () =>
      selectedHostel === "all"
        ? hostels
        : hostels.filter((hostel) => Number(hostel.id) === Number(selectedHostel)),
    [hostels, selectedHostel]
  );

  const beds = activeHostels.flatMap((hostel) =>
    (hostel.floors || []).flatMap((floor) =>
      (floor.rooms || []).flatMap((room) => room.beds || [])
    )
  );

  const stats = {
    total: beds.length,
    occupied: beds.filter((bed) => bed.status === "occupied").length,
    available: beds.filter((bed) => bed.status === "available").length,
    maintenance: beds.filter((bed) => bed.status === "maintenance").length,
  };

  return (
    <OwnerLayout title="Bed Availability">
      <div className="owner-page-heading">
        <div>
          <span>ROOM & BED STATUS MATRIX</span>
          <h1>Bed Availability</h1>
          <p>
            Real-time live occupancy view across every hostel building, floor,
            room and bed.
          </p>
        </div>

        <div className="owner-welcome-actions">
          <button
            type="button"
            className="owner-secondary-button"
            onClick={loadHostels}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <HostelFilter
        hostels={hostels}
        selectedHostel={selectedHostel}
        onChange={setSelectedHostel}
      />

      <div className="bed-summary-grid">
        <Summary icon={BedDouble} label="Total Beds" value={stats.total} />
        <Summary icon={CircleX} label="Occupied Beds" value={stats.occupied} />
        <Summary
          icon={CircleCheck}
          label="Available Beds"
          value={stats.available}
        />
        <Summary
          icon={Wrench}
          label="Under Maintenance"
          value={stats.maintenance}
        />
      </div>

      {loading ? (
        <p className="owner-empty-text">Loading bed matrix...</p>
      ) : activeHostels.length === 0 ? (
        <p className="owner-empty-text">No hostel properties found.</p>
      ) : (
        <div className="bed-hostel-list">
          {activeHostels.map((hostel) => (
            <section className="bed-hostel-card" key={hostel.id}>
              <div className="bed-hostel-heading">
                <div>
                  <span className="bed-hostel-icon">
                    <Building2 size={21} />
                  </span>

                  <div>
                    <h2>{hostel.name || hostel.hostel_name}</h2>
                    <p>{hostel.city}, {hostel.address || "Visakhapatnam"}</p>
                  </div>
                </div>

                <span>
                  Supervisor:{" "}
                  <strong>
                    {hostel.supervisor ? hostel.supervisor.name : "Assigned Staff"}
                  </strong>
                </span>
              </div>

              {(hostel.floors && hostel.floors.length > 0) ? (
                hostel.floors.map((floor) => (
                  <div className="bed-floor" key={floor.id}>
                    <div className="bed-floor-heading">
                      <h3>{floor.name || floor.floor_name || `Floor ${floor.floor_number}`}</h3>
                      <span>{(floor.rooms || []).length} Rooms</span>
                    </div>

                    <div className="bed-room-grid">
                      {(floor.rooms || []).map((room) => {
                        const roomBeds = room.beds || [];
                        const occupied = roomBeds.filter(
                          (bed) => bed.status === "occupied"
                        ).length;
                        const full = occupied > 0 && occupied === roomBeds.length;

                        return (
                          <article
                            key={room.id}
                            className={`bed-room-card ${full ? "room-full" : ""}`}
                          >
                            <div className="bed-room-heading">
                              <div>
                                <span>ROOM</span>
                                <h4>{room.number || room.room_number}</h4>
                              </div>

                              <span
                                className={`room-fill-badge ${
                                  full ? "full" : "free"
                                }`}
                              >
                                {occupied}/{roomBeds.length} Filled
                              </span>
                            </div>

                            <div className="bed-items">
                              {roomBeds.map((bed) => (
                                <div
                                  key={bed.id}
                                  className={`bed-item bed-${bed.status}`}
                                >
                                  <BedDouble size={16} />

                                  <div>
                                    <strong>{bed.number || bed.bed_number}</strong>
                                    <span>
                                      {bed.status === "occupied"
                                        ? bed.student || "Occupied"
                                        : bed.status}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="owner-empty-text">
                  No floors or rooms configured for this hostel. Visit Hostel Details to add rooms.
                </p>
              )}
            </section>
          ))}
        </div>
      )}
    </OwnerLayout>
  );
}

function Summary({ icon: Icon, label, value }) {
  return (
    <div className="bed-summary-card">
      <span>
        <Icon size={21} />
      </span>

      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

export default BedAvailability;
