// Medical History dashboard — diagnoses, episodes, procedures ----------

const SOURCES = [
  { id: "huisarts", short: "GP",   label: "GP — Praktijk Hofstede", state: "ready",   count: 12 },
  { id: "ziekenhuis-amc", short: "AMC", label: "Amsterdam UMC (locatie AMC)", state: "ready", count: 7 },
  { id: "ziekenhuis-olvg", short: "OLVG", label: "OLVG", state: "ready", count: 3 },
  { id: "apotheek", short: "RX", label: "Apotheek De Linden", state: "ready", count: 9 },
  { id: "ggz", short: "GGZ", label: "GGZ Noord-Holland", state: "inflight" },
  { id: "lsp", short: "LSP", label: "Landelijk Schakelpunt", state: "failed" },
];

const DIAGNOSES = [
  { id: 1, code: "I10", system: "ICD-10", title: "Essentiële (primaire) hypertensie",
    onset: "2018-04-12", status: "active", source: "GP", note: "Onder controle met lisinopril 10 mg" },
  { id: 2, code: "E11.9", system: "ICD-10", title: "Diabetes mellitus type 2 zonder complicaties",
    onset: "2020-09-03", status: "active", source: "GP", note: "HbA1c 58 mmol/mol op 12-Mar" },
  { id: 3, code: "M54.5", system: "ICD-10", title: "Lage rugpijn",
    onset: "2024-11-22", status: "active", source: "AMC", note: "Conservatief beleid; FT 2x/wk" },
  { id: 4, code: "J45.9", system: "ICD-10", title: "Astma, niet gespecificeerd",
    onset: "2009-01-15", status: "in remission", source: "GP" },
  { id: 5, code: "K21.9", system: "ICD-10", title: "Gastro-oesofageale refluxziekte",
    onset: "2022-06-30", status: "resolved", source: "OLVG" },
  { id: 6, code: "Z87.891", system: "ICD-10", title: "Voormalig roken (anamnese)",
    onset: "2017-08-04", status: "history", source: "GP" },
  { id: 7, code: "S82.6XXA", system: "ICD-10", title: "Fractuur enkel (initieel)",
    onset: "2024-02-18", status: "resolved", source: "AMC", note: "Gips 6 weken; nazorg afgesloten" },
];

const STATUS_VARIANTS = {
  active: { label: "Actief", variant: "primary" },
  "in remission": { label: "In remissie", variant: "info-soft" },
  resolved: { label: "Afgesloten", variant: "" },
  history: { label: "Anamnese", variant: "" },
};

const MedicalHistory = ({ onOpenSources, onOpenDiagnosis }) => {
  const [tab, setTab] = React.useState("diagnoses");
  const [sortAsc, setSortAsc] = React.useState(false);
  const [selected, setSelected] = React.useState(new Set());

  const sorted = React.useMemo(() => {
    const a = [...DIAGNOSES];
    a.sort((x, y) => sortAsc ? x.onset.localeCompare(y.onset) : y.onset.localeCompare(x.onset));
    return a;
  }, [sortAsc]);

  const toggle = (id) => {
    const n = new Set(selected); n.has(id) ? n.delete(id) : n.add(id); setSelected(n);
  };

  return (
    <div className="page">
      <div className="dashboard-head">
        <h1 className="h1">Medical history</h1>
        <Chip variant="info-soft">Last sync · 2 min ago</Chip>
        <div className="spacer"/>
        <SourceStatus sources={SOURCES}/>
        <Button variant="text" icon="refresh">Refresh</Button>
        <Button variant="outlined" icon="filter_list">Filter</Button>
        <Button variant="contained" icon="add">Add diagnosis</Button>
      </div>

      <div className="tabs" style={{marginBottom: 16}}>
        <Tab active={tab==="diagnoses"} count={7} onClick={() => setTab("diagnoses")}>Diagnoses & episodes</Tab>
        <Tab active={tab==="procedures"} count={2} onClick={() => setTab("procedures")}>Procedures</Tab>
        <Tab active={tab==="encounters"} count={14} onClick={() => setTab("encounters")}>Encounters</Tab>
        <Tab active={tab==="problems"} count={4} onClick={() => setTab("problems")}>Problem list</Tab>
        <Tab active={tab==="timeline"} onClick={() => setTab("timeline")}>Timeline</Tab>
      </div>

      {tab === "diagnoses" && (
        <div className="paper flat" style={{padding: 0}}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width: 40}}></th>
                <th style={{width: 140, cursor:"pointer", whiteSpace:"nowrap"}} onClick={() => setSortAsc(!sortAsc)}>
                  Onset {sortAsc ? "↑" : "↓"}
                </th>
                <th style={{width: 110}}>Code</th>
                <th>Diagnosis</th>
                <th style={{width: 130}}>Status</th>
                <th style={{width: 110}}>Source</th>
                <th style={{width: 56}}></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(d => {
                const s = STATUS_VARIANTS[d.status];
                return (
                  <tr key={d.id} className={selected.has(d.id) ? "selected" : ""}
                      onClick={() => onOpenDiagnosis && onOpenDiagnosis(d)}>
                    <td onClick={e => { e.stopPropagation(); toggle(d.id); }}>
                      <input type="checkbox" checked={selected.has(d.id)} onChange={() => {}}/>
                    </td>
                    <td style={{whiteSpace: "nowrap"}}>
                      <div>{d.onset}</div>
                      <div className="meta">{Math.floor((Date.now() - new Date(d.onset)) / (1000*60*60*24*365))}y ago</div>
                    </td>
                    <td><code style={{fontFamily:"var(--font-mono)", fontSize:12}}>{d.code}</code><div className="meta">{d.system}</div></td>
                    <td>
                      <div style={{fontWeight:600}}>{d.title}</div>
                      {d.note && <div className="meta" style={{marginTop:2}}>{d.note}</div>}
                    </td>
                    <td><Chip variant={s.variant}>{s.label}</Chip></td>
                    <td><span className="meta">{d.source}</span></td>
                    <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab !== "diagnoses" && (
        <div className="paper flat empty">
          <div className="icon-bg"><Icon name="document" size={40}/></div>
          <div className="h5">No data was found in the resources you have access to</div>
          <div className="muted b1">This tab would list <b>{tab}</b> with the same column structure.</div>
          <Button variant="outlined" icon="refresh">Reload all sources</Button>
        </div>
      )}
    </div>
  );
};

window.MedicalHistory = MedicalHistory;
