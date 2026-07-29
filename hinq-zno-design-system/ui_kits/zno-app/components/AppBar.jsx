// Top app bar -----------------------------------------------------------

const AppBar = ({ patient, onToggleNav, navOpen }) => (
  <header className="app-bar">
    <div className="logo-area">
      <button className="menu-btn" onClick={onToggleNav} aria-label="Menu">
        <Icon name="menu" size={22}/>
      </button>
      <img className="logo-img" src="../../assets/hinq_logo.svg" alt="HINQ"/>
    </div>

    <div className="breadcrumbs">
      <span>ZNO</span>
      <span className="sep">/</span>
      <span>Dossiers</span>
      <span className="sep">/</span>
      <span className="current">{patient.name}</span>
    </div>

    <div className="right">
      <button className="icon-btn" title="Search"><Icon name="search"/></button>
      <button className="icon-btn" title="Notifications">
        <Icon name="notifications"/>
        <span className="badge">3</span>
      </button>
      <button className="icon-btn" title="Help"><Icon name="help"/></button>
      <div className="v-divider"/>
      <div className="patient-info">
        <div className="name">{patient.nameLast}</div>
        <div className="meta">{patient.bsn} · {patient.dob} · {patient.age}y</div>
      </div>
      <Avatar lavender>{patient.initials}</Avatar>
    </div>
  </header>
);

window.AppBar = AppBar;
