// Permissions / Access & sharing -----------------------------------------

const CONSENTS = [
  { who: "Praktijk Hofstede (huisarts)", scope: "Volledig dossier", granted: "2019-01-12", expires: "—", state: "active" },
  { who: "Amsterdam UMC", scope: "Hartzorg + medicatie", granted: "2024-02-10", expires: "2026-02-10", state: "active" },
  { who: "Apotheek De Linden", scope: "Medicatie + allergieën", granted: "2018-04-20", expires: "—", state: "active" },
  { who: "OLVG (cardio consult)", scope: "Eenmalige consultatie", granted: "2022-06-12", expires: "2022-07-12", state: "expired" },
  { who: "GGZ Noord-Holland", scope: "Mentale gezondheid", granted: "—", expires: "—", state: "pending" },
];

const Permissions = () => (
  <div className="page">
    <div className="dashboard-head">
      <h1 className="h1">Access & sharing</h1>
      <div className="spacer"/>
      <Button variant="outlined" icon="history">Audit log</Button>
      <Button variant="contained" icon="add">Grant access</Button>
    </div>

    <div className="paper flat" style={{padding: 16, marginBottom: 24, display:"flex", gap:16, alignItems:"center", background: "var(--bg-default)"}}>
      <Icon name="shield" size={28} style={{color:"var(--hinq-primary-main)"}}/>
      <div style={{flex:1}}>
        <div className="h5">Network-wide consent (Wabvpz)</div>
        <div className="b1 muted">Patient has actively consented to share data via the HINQ network with treating providers. Consent recorded 14 March 2024 via DigiD.</div>
      </div>
      <Button variant="text">View consent record</Button>
    </div>

    <div className="paper flat" style={{padding: 0}}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Scope</th>
            <th style={{width: 130}}>Granted</th>
            <th style={{width: 130}}>Expires</th>
            <th style={{width: 170, whiteSpace: "nowrap"}}>Status</th>
            <th style={{width: 56}}></th>
          </tr>
        </thead>
        <tbody>
          {CONSENTS.map((c, i) => (
            <tr key={i}>
              <td><div style={{fontWeight:600}}>{c.who}</div></td>
              <td>{c.scope}</td>
              <td>{c.granted}</td>
              <td>{c.expires}</td>
              <td>
                {c.state === "active"   && <Chip variant="success-soft" dot="currentColor">Active</Chip>}
                {c.state === "expired"  && <Chip variant="">Expired</Chip>}
                {c.state === "pending"  && <Chip variant="warn-soft">Awaiting consent</Chip>}
              </td>
              <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

window.Permissions = Permissions;
