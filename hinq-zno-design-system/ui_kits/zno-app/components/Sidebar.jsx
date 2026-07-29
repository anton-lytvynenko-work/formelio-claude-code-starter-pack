// Side navigation ------------------------------------------------------

const NAV = [
  { group: "Dossier" },
  { id: "personal", label: "Personal data", svg: "client_info" },
  { id: "medical-history", label: "Medical history", svg: "medication_history" },
  { id: "medication", label: "Medication", svg: "medications" },
  { id: "lab", label: "Lab results", svg: "lab_results" },
  { id: "measurements", label: "Measurements", svg: "measurements" },
  { id: "allergies", label: "Allergies & vaccines", svg: "allergies_vaccinations" },
  { id: "lifestyle", label: "Lifestyle", svg: "lifestyle" },
  { group: "Care plans" },
  { id: "chronic", label: "Chronic care", svg: "chronic_care" },
  { id: "maternity", label: "Maternity", svg: "maternity" },
  { id: "advance", label: "Advance care", svg: "advance_care" },
  { group: "Coordination" },
  { id: "documents", label: "Documents", svg: "documents" },
  { id: "referrals", label: "Referrals", svg: "referrals" },
  { id: "tasks", label: "Tasks", svg: "tasks" },
  { id: "access", label: "Access & sharing", svg: "access" },
];

const Sidebar = ({ active, onSelect }) => (
  <nav className="sidebar">
    {NAV.map((item, i) => {
      if (item.group) {
        return <div key={i} className="group-title">{item.group}</div>;
      }
      const isActive = item.id === active;
      return (
        <div key={item.id}
             className={`nav-item ${isActive ? "active" : ""}`}
             onClick={() => onSelect(item.id)}>
          <img src={`../../assets/icons/nav/${item.svg}.svg`} alt=""/>
          <span>{item.label}</span>
        </div>
      );
    })}
  </nav>
);

window.Sidebar = Sidebar;
window.NAV_ITEMS = NAV;
