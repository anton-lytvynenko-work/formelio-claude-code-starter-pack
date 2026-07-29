// Tiny shared primitives -------------------------------------------------

const Chip = ({ variant = "default", children, dot, onClick, style }) => (
  <span className={`chip ${variant}`} onClick={onClick} style={style}>
    {dot && <span className="dot" style={{ background: dot }}/>}
    {children}
  </span>
);

const Button = ({ variant = "contained", size, icon, endIcon, children, onClick, style }) => (
  <button className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""}`} onClick={onClick} style={style}>
    {icon && <Icon name={icon} size={18}/>}
    {children}
    {endIcon && <Icon name={endIcon} size={18}/>}
  </button>
);

const Avatar = ({ children, sec, lavender, size = 36 }) => (
  <span className={`avatar ${sec ? "sec" : ""} ${lavender ? "lavender" : ""}`}
        style={{ width: size, height: size, fontSize: size <= 28 ? 11 : 13 }}>
    {children}
  </span>
);

const Field = ({ label, value, hint, mono, action }) => (
  <div className="field">
    <div className="field-label">{label}</div>
    <div className="field-value-row">
      <div className={"field-value" + (mono ? " mono" : "")}>{value || <span className="muted">—</span>}</div>
      {action}
    </div>
    {hint && <div className="field-hint">{hint}</div>}
  </div>
);

const Tab = ({ active, count, onClick, children }) => (
  <button className={`tab ${active ? "active" : ""}`} onClick={onClick}>
    {children}
    {count != null && <span className="count">{count}</span>}
  </button>
);

// Drawer -----------------------------------------------------------------
const Drawer = ({ open, onClose, title, footer, width = 600, children }) => {
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" style={{ width }} onClick={e => e.stopPropagation()}>
        <div className="drawer-head">
          <div className="h5">{title}</div>
          <button className="icon-btn" onClick={onClose}><Icon name="close"/></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </div>
  );
};

window.Chip = Chip;
window.Button = Button;
window.Avatar = Avatar;
window.Field = Field;
window.Tab = Tab;
window.Drawer = Drawer;
