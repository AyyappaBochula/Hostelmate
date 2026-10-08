import { Building2, LayoutGrid } from "lucide-react";
import './HostelFilter.css';

function HostelFilter({ hostels, selectedHostel, onChange }) {
  return (
    <div className="hostel-filter-cards">
      <button
        type="button"
        className={`hostel-filter-card ${
          selectedHostel === "all" ? "active" : ""
        }`}
        onClick={() => onChange("all")}
      >
        <span className="hostel-filter-icon">
          <LayoutGrid size={18} />
        </span>

        <div>
          <small>VIEW</small>
          <strong>All Hostels</strong>
        </div>
      </button>

      {hostels.map((hostel) => (
        <button
          type="button"
          key={hostel.id}
          className={`hostel-filter-card ${
            Number(selectedHostel) === hostel.id ? "active" : ""
          }`}
          onClick={() => onChange(hostel.id)}
        >
          <span className="hostel-filter-icon">
            <Building2 size={18} />
          </span>

          <div>
            <small>HOSTEL</small>
            <strong>{hostel.name}</strong>
          </div>
        </button>
      ))}
    </div>
  );
}

export default HostelFilter;
