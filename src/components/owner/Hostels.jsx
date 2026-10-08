import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Eye,
  MapPin,
  Pencil,
  Plus,
  Power,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import OwnerLayout from "./OwnerLayout";
import { hostelsApi } from "../../services/api";
import "./OwnerDashboard.css";

function Hostels() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hostels, setHostels] = useState([]);

  const [form, setForm] = useState({
    hostel_name: "",
    hostel_type: "Boys",
    address: "",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    pincode: "530048",
  });

  const loadHostels = async () => {
    try {
      setLoading(true);
      const data = await hostelsApi.getHostels();
      setHostels(data || []);
    } catch (err) {
      console.error("Failed to load hostels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHostels();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.hostel_name.trim()) {
      alert("Please enter a hostel name.");
      return;
    }

    try {
      const created = await hostelsApi.createHostel(form);
      setHostels((prev) => [created, ...prev]);
      setForm({
        hostel_name: "",
        hostel_type: "Boys",
        address: "",
        city: "Visakhapatnam",
        state: "Andhra Pradesh",
        pincode: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add hostel:", err);
      alert("Error adding hostel.");
    }
  };

  const toggleStatus = async (id) => {
    const target = hostels.find((h) => h.id === id);
    if (!target) return;
    const newStatus = target.status === "active" ? "inactive" : "active";
    await hostelsApi.updateHostel(id, { status: newStatus });
    setHostels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, status: newStatus } : h))
    );
  };

  const filteredHostels = hostels.filter((hostel) =>
    `${hostel.hostel_name || hostel.name} ${hostel.city || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <OwnerLayout title="Hostels">
      <div className="owner-page-heading">
        <div>
          <span>PROPERTY MANAGEMENT</span>
          <h1>My Hostels</h1>
          <p>
            Create, configure and manage all your hostel buildings, floors and
            rooms.
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
          <button
            type="button"
            className="owner-primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Add Hostel
          </button>
        </div>
      </div>

      <section className="owner-page-card">
        <div className="owner-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search hostel by name, location or city..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <p className="owner-empty-text">Loading hostels...</p>
        ) : filteredHostels.length === 0 ? (
          <p className="owner-empty-text">
            No hostels found matching your search.
          </p>
        ) : (
          <div className="owner-hostel-grid">
            {filteredHostels.map((hostel) => (
              <article className="owner-hostel-card" key={hostel.id}>
                <div className="owner-hostel-card-top">
                  <span className="owner-hostel-icon">
                    <Building2 size={23} />
                  </span>

                  <span
                    className={`owner-table-status ${
                      hostel.status === "active"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {hostel.status || "active"}
                  </span>
                </div>

                <h3>{hostel.hostel_name || hostel.name}</h3>

                <span className="owner-hostel-type">
                  {hostel.hostel_type || hostel.type || "Hostel"}
                </span>

                <p className="owner-hostel-address">
                  <MapPin size={15} />
                  <span>
                    {hostel.address || "Main Road"}, {hostel.city},{" "}
                    {hostel.state} {hostel.pincode ? `- ${hostel.pincode}` : ""}
                  </span>
                </p>

                <div className="owner-hostel-actions">
                  <Link
                    to={`/owner/hostels/${hostel.id}`}
                    className="owner-details-link"
                  >
                    <Eye size={15} />
                    View & Add Rooms
                  </Link>

                  <button
                    type="button"
                    title={
                      hostel.status === "active"
                        ? "Deactivate hostel"
                        : "Activate hostel"
                    }
                    onClick={() => toggleStatus(hostel.id)}
                    className="owner-icon-action-btn"
                  >
                    <Power size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ADD HOSTEL MODAL */}
      {showForm && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <div>
                <span>NEW PROPERTY</span>
                <h2>Add Hostel</h2>
              </div>

              <button type="button" onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <FormField
                label="Hostel Name"
                name="hostel_name"
                placeholder="e.g. Royal PG & Hostel"
                value={form.hostel_name}
                onChange={handleChange}
                required
              />

              <label className="owner-form-field">
                <span>Hostel Type</span>
                <select
                  name="hostel_type"
                  value={form.hostel_type}
                  onChange={handleChange}
                >
                  <option value="Boys">Boys Hostel</option>
                  <option value="Girls">Girls Hostel</option>
                  <option value="Co-Living">Co-Living PG</option>
                  <option value="Working Men">Working Men PG</option>
                  <option value="Working Women">Working Women PG</option>
                </select>
              </label>

              <FormField
                label="Address / Landmark"
                name="address"
                placeholder="e.g. Plot 12, Sector 3, Madhurawada"
                value={form.address}
                onChange={handleChange}
                required
              />

              <div className="owner-form-two">
                <FormField
                  label="City"
                  name="city"
                  placeholder="e.g. Visakhapatnam"
                  value={form.city}
                  onChange={handleChange}
                  required
                />

                <FormField
                  label="State"
                  name="state"
                  placeholder="e.g. Andhra Pradesh"
                  value={form.state}
                  onChange={handleChange}
                  required
                />
              </div>

              <FormField
                label="Pincode"
                name="pincode"
                placeholder="e.g. 530048"
                value={form.pincode}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="owner-primary-button owner-full-button"
              >
                Create Hostel Property
              </button>
            </form>
          </div>
        </div>
      )}
    </OwnerLayout>
  );
}

function FormField({ label, ...props }) {
  return (
    <label className="owner-form-field">
      <span>{label}</span>
      <input type="text" {...props} />
    </label>
  );
}

export default Hostels;
