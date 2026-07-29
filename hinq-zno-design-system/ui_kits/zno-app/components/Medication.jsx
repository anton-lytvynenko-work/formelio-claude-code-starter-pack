// Medication view -------------------------------------------------------

const MEDS = [
  { name: "Lisinopril", strength: "10 mg", form: "tablet", dose: "1× per dag, 's ochtends",
    indication: "Hypertensie", since: "2018-04-20", status: "active", source: "Apotheek De Linden",
    refills: 2 },
  { name: "Metformine", strength: "500 mg", form: "tablet", dose: "2× per dag bij maaltijd",
    indication: "Diabetes mellitus type 2", since: "2020-09-15", status: "active", source: "Apotheek De Linden",
    refills: 1 },
  { name: "Salbutamol", strength: "100 µg/dosis", form: "inhalator", dose: "Z.n., max 4× per dag",
    indication: "Astma", since: "2009-02-01", status: "active", source: "Apotheek De Linden", refills: 0 },
  { name: "Pantoprazol", strength: "40 mg", form: "tablet", dose: "1× per dag, voor ontbijt",
    indication: "Reflux", since: "2022-07-01", status: "stopped", source: "GP", endedOn: "2023-04-12" },
  { name: "Diclofenac", strength: "50 mg", form: "tablet", dose: "Z.n., max 3× per dag",
    indication: "Rugpijn (kortdurend)", since: "2024-11-22", status: "active", source: "GP", refills: 0 },
];

const Medication = () => (
  <div className="page">
    <div className="dashboard-head">
      <h1 className="h1">Medication</h1>
      <Chip variant="warn-soft">2 herhaalrecepten verlopen</Chip>
      <div className="spacer"/>
      <Button variant="text" icon="history">Verstrekkingen</Button>
      <Button variant="outlined" icon="print">Print BMR</Button>
      <Button variant="contained" icon="add">Voorschrijven</Button>
    </div>

    <div className="paper flat" style={{padding: 0, marginBottom: 24}}>
      <table className="tbl">
        <thead>
          <tr>
            <th>Medicijn</th>
            <th>Dosering</th>
            <th>Indicatie</th>
            <th style={{width: 110}}>Sinds</th>
            <th style={{width: 170, whiteSpace: "nowrap"}}>Status</th>
            <th style={{width: 130}}>Herhaal</th>
            <th style={{width: 56}}></th>
          </tr>
        </thead>
        <tbody>
          {MEDS.map((m, i) => (
            <tr key={i}>
              <td>
                <div className="row-h">
                  <Icon name={m.form === "inhalator" ? "monitor_heart" : "drug"} size={18} style={{color:"var(--hinq-primary-main)"}}/>
                  <div>
                    <div style={{fontWeight:600}}>{m.name} {m.strength}</div>
                    <div className="meta">{m.form} · {m.source}</div>
                  </div>
                </div>
              </td>
              <td>{m.dose}</td>
              <td>{m.indication}</td>
              <td>{m.since}</td>
              <td>
                {m.status === "active"
                  ? <Chip variant="success-soft" dot="currentColor">Actief</Chip>
                  : (
                    <div style={{display:"flex", flexDirection:"column", alignItems:"flex-start", gap:2, lineHeight:1.2}}>
                      <Chip variant="">Gestopt</Chip>
                      <span className="meta" style={{fontSize:11}}>per {m.endedOn}</span>
                    </div>
                  )}
              </td>
              <td>
                {m.status !== "active" ? <span className="muted">—</span>
                  : m.refills === 0
                    ? <Chip variant="warn-soft">Verlopen</Chip>
                    : <span>{m.refills} ×</span>}
              </td>
              <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="paper flat">
      <div className="row-h" style={{marginBottom: 12}}>
        <div className="h4">Drug interaction check</div>
        <div className="spacer"/>
        <Chip variant="warn-soft" dot="currentColor">1 medium · 0 ernstig</Chip>
      </div>
      <div className="b1 muted" style={{marginBottom:12}}>
        Op basis van actuele medicatie en allergieën.
      </div>
      <div style={{display:"flex", flexDirection:"column", gap:8}}>
        <div className="row-h" style={{padding:"12px", background: "var(--bg-default)", borderRadius:4}}>
          <Icon name="warning" style={{color:"var(--hinq-warning-main)"}}/>
          <div>
            <div style={{fontWeight:600}}>Diclofenac + Lisinopril</div>
            <div className="meta">NSAID kan het bloeddrukverlagende effect van ACE-remmers verminderen. Overweeg paracetamol.</div>
          </div>
          <div className="spacer"/>
          <Button variant="text">Details</Button>
        </div>
      </div>
    </div>
  </div>
);

window.Medication = Medication;
