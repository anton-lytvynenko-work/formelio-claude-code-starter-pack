// Source status — shows which networks have responded with data ------

const SourceStatus = ({ sources }) => {
  const total = sources.length;
  const ready = sources.filter(s => s.state === "ready").length;
  const failed = sources.filter(s => s.state === "failed").length;
  const inflight = total - ready - failed;
  return (
    <div className="source-strip" title="Network sources">
      {inflight > 0 ? (
        <div className="progress"><div className="ring"/></div>
      ) : (
        <Icon name={failed ? "warning" : "cloud_done"} size={16}
              style={{color: failed ? "var(--hinq-warning-main)" : "var(--hinq-success-main)"}}/>
      )}
      <span><b>{ready}</b>/{total} sources</span>
      {failed > 0 && <span className="muted">· {failed} failed</span>}
      <Icon name="expand_more" size={16} style={{color: "var(--fg-2)"}}/>
    </div>
  );
};

window.SourceStatus = SourceStatus;
