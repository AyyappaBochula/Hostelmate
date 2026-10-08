import { useEffect, useMemo, useState } from "react";
import { BedDouble, CircleCheck, CircleX, RefreshCw, Wrench } from "lucide-react";

import SupervisorLayout from "./SupervisorLayout";
import { hostelsApi } from "../../services/api";
import "./BedAvailability.css";

function BedAvailability() {
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadHostel = async () => {
    try {
      setLoading(true);
      const data = await hostelsApi.getHostelById(1);
      setHostel(data);
    } catch (err) {
      console.error("Failed to load supervisor bed availability:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostel();
  }, []);

  const beds = useMemo(() => {
    if (!hostel) return [];
    return (hostel.floors || []).flatMap((floor) =>
      (floor.rooms || []).flatMap((room) => room.beds || [])
    );
  }, [hostel]);

  const stats = {
    total: beds.length,
    occupied: beds.filter((b) => b.status === "occupied").length,
    available: beds.filter((b) => b.status === "available").length,
    maintenance: beds.filter((b) => b.status === "maintenance").length,
  };

  return (
    <SupervisorLayout title="Bed Availability">
      <div className="supervisor-welcome-section">
        <div>
          <span className="supervisor-welcome-label">ROOM OCCUPANCY</span>
          <h1>Bed Availability</h1>
          <p>
            Live status of all beds across floors in{" "}
            <strong>{hostel ? hostel.name : "Sunrise Boys Hostel"}</strong>.
          </p>
        </div>

        <div className="supervisor-welcome-actions">
          <button
            type="button"
            className="supervisor-secondary-button"
            onClick={loadHostel}
          >
            <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
            Refresh
          </button>
        </div>
      </div>

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
          label="Maintenance"
          value={stats.maintenance}
        />
      </div>

      {loading ? (
        <p className="owner-empty-text">Loading beds...</p>
      ) : !hostel ? (
        <p className="owner-empty-text">Hostel data unavailable.</p>
      ) : (
        <section className="bed-hostel-card">
          {(hostel.floors || []).map((floor) => (
            <div className="bed-floor" key={floor.id}>
              <div className="bed-floor-heading">
                <h3>{floor.name || floor.floor_name}</h3>
                <span>{(floor.rooms || []).length} Rooms</span>
              </div>

              <div className="bed-room-grid">
                {(floor.rooms || []).map((room) => {
                  const roomBeds = room.beds || [];
                  const occupied = roomBeds.filter(
                    (b) => b.status === "occupied"
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
          ))}
        </section>
      )}
    </SupervisorLayout>
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
