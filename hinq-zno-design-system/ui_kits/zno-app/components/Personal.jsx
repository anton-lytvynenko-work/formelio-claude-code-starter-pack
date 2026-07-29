// Personal data view ----------------------------------------------------

const Personal = () => (
  <div className="page">
    <div className="dashboard-head">
      <h1 className="h1">Personal data</h1>
      <Chip variant="success-soft" dot="currentColor">BSN verified</Chip>
      <div className="spacer"/>
      <Button variant="text" icon="history">History</Button>
      <Button variant="outlined" icon="edit">Edit</Button>
    </div>

    <div className="stack">
      <div className="paper flat">
        <div className="row-h" style={{marginBottom: 16}}>
          <div className="h4">Identity</div>
          <div className="spacer"/>
          <Chip variant="info-soft">Source · GBA</Chip>
        </div>
        <div className="section-row">
          <Field label="Voornamen" value="Jansje Maria"/>
          <Field label="Achternaam" value="Vermeer"/>
          <Field label="Roepnaam" value="Jans"/>
          <Field label="Geslacht" value="Vrouw"/>
          <Field label="Geboortedatum" value="14 Maart 1962"/>
          <Field label="BSN" value="123 456 789" mono action={<Icon name="check_circle" size={16} style={{color:"var(--hinq-success-main)"}}/>}/>
          <Field label="Burgerlijke staat" value="Gehuwd"/>
          <Field label="Nationaliteit" value="Nederlandse"/>
        </div>
      </div>

      <div className="paper flat">
        <div className="row-h" style={{marginBottom: 16}}>
          <div className="h4">Contact</div>
          <div className="spacer"/>
          <Button variant="text" icon="add" size="sm">Add</Button>
        </div>
        <div className="section-row">
          <Field label="Adres" value="Prinsengracht 263, 1016 GV Amsterdam"/>
          <Field label="Land" value="Nederland"/>
          <Field label="Telefoon (mobiel)" value="+31 6 12 34 56 78" action={<button className="icon-btn"><Icon name="call" size={18}/></button>}/>
          <Field label="Telefoon (vast)" value="+31 20 555 12 34"/>
          <Field label="E-mail" value="j.vermeer@example.nl" action={<button className="icon-btn"><Icon name="mail" size={18}/></button>}/>
          <Field label="Voorkeurstaal" value="Nederlands"/>
        </div>
      </div>

      <div className="paper flat">
        <div className="row-h" style={{marginBottom: 16}}>
          <div className="h4">Care contacts</div>
          <div className="spacer"/>
          <Button variant="text" icon="add" size="sm">Add</Button>
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th style={{width: 220}}>Role</th>
              <th>Person</th>
              <th>Contact</th>
              <th style={{width: 120}}>Status</th>
              <th style={{width: 56}}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Huisarts</td>
              <td><div style={{fontWeight:600}}>Dr. P. Hofstede</div><div className="meta">Praktijk Hofstede</div></td>
              <td>020 555 88 22</td>
              <td><Chip variant="success-soft" dot="currentColor">Active</Chip></td>
              <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
            </tr>
            <tr>
              <td>Apotheek</td>
              <td><div style={{fontWeight:600}}>Apotheek De Linden</div><div className="meta">Bonaireplein 14</div></td>
              <td>020 555 14 14</td>
              <td><Chip variant="success-soft" dot="currentColor">Active</Chip></td>
              <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
            </tr>
            <tr>
              <td>Specialist (cardiologie)</td>
              <td><div style={{fontWeight:600}}>Dr. M. Iversen</div><div className="meta">Amsterdam UMC</div></td>
              <td>020 566 99 11</td>
              <td><Chip variant="info-soft">Consult</Chip></td>
              <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
            </tr>
            <tr>
              <td>Mantelzorger</td>
              <td><div style={{fontWeight:600}}>Pieter Vermeer</div><div className="meta">Echtgenoot</div></td>
              <td>+31 6 11 22 33 44</td>
              <td><Chip variant="">Family</Chip></td>
              <td><button className="icon-btn"><Icon name="more_vert"/></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

window.Personal = Personal;
