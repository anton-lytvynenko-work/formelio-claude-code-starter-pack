// App shell & routing ---------------------------------------------------

const PATIENT = {
  name: "Jansje Vermeer",
  nameLast: "VERMEER, Jansje",
  initials: "JV",
  bsn: "BSN 123456789",
  dob: "14-03-1962",
  age: 63,
};

const App = () => {
  const [navOpen, setNavOpen] = React.useState(true);
  const [section, setSection] = React.useState("medical-history");
  const [diagnosis, setDiagnosis] = React.useState(null);
  const [snack, setSnack] = React.useState(null);

  const placeholderTitle = (() => {
    const item = NAV_ITEMS.find(i => i.id === section);
    return item ? item.label : section;
  })();

  let body;
  if (section === "medical-history") body = <MedicalHistory onOpenDiagnosis={setDiagnosis}/>;
  else if (section === "personal")    body = <Personal/>;
  else if (section === "medication")  body = <Medication/>;
  else if (section === "access")      body = <Permissions/>;
  else body = (
    <div className="page">
      <div className="dashboard-head"><h1 className="h1">{placeholderTitle}</h1></div>
      <div className="paper flat empty">
        <div className="icon-bg"><Icon name="info" size={36}/></div>
        <div className="h5">Module placeholder</div>
        <div className="muted b1">This module would follow the same shell pattern: header, source status, tabs, and tabular records.</div>
        <Button variant="outlined" onClick={() => setSection("medical-history")}>Back to medical history</Button>
      </div>
    </div>
  );

  return (
    <div className="app" data-screen-label={`ZNO · ${placeholderTitle}`}>
      <AppBar patient={PATIENT} onToggleNav={() => setNavOpen(!navOpen)} navOpen={navOpen}/>
      <div className={"app-shell " + (navOpen ? "" : "collapsed")}>
        {navOpen && <Sidebar active={section} onSelect={(id) => { setSection(id); setSnack(null); }}/>}
        <main>{body}</main>
      </div>

      <Drawer open={!!diagnosis} onClose={() => setDiagnosis(null)}
              title={diagnosis ? `${diagnosis.code} · ${diagnosis.title}` : ""}>
        {diagnosis && (
          <div className="stack-2">
            <Field label="Status" value={(STATUS_VARIANTS[diagnosis.status]||{}).label}/>
            <Field label="Onset" value={diagnosis.onset}/>
            <Field label="System" value={diagnosis.system} mono/>
            <Field label="Reported by" value={diagnosis.source}/>
            {diagnosis.note && <Field label="Notes" value={diagnosis.note}/>}
            <div className="divider" style={{margin:"8px 0"}}/>
            <div className="h6">Linked records</div>
            <div className="row-h"><Icon name="document" style={{color:"var(--fg-2)"}}/><span className="b1">Consultnotitie · 2024-03-12</span></div>
            <div className="row-h"><Icon name="test_tube" style={{color:"var(--fg-2)"}}/><span className="b1">Lab · HbA1c 58 mmol/mol</span></div>
            <div className="row-h"><Icon name="drug" style={{color:"var(--fg-2)"}}/><span className="b1">Metformine 500 mg, 2× per dag</span></div>
          </div>
        )}
      </Drawer>

      {snack && (
        <div className="snackbar">
          <span>{snack}</span>
          <a onClick={() => setSnack(null)}>Dismiss</a>
        </div>
      )}
    </div>
  );
};

window.App = App;
