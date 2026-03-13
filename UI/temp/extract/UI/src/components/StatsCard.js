export default function StatsCard({ icon, title, value, color }) {
  return (
    <div className="stats-card">
      <i className={`bi ${icon}`} style={{ color, fontSize: '2rem' }}></i>
      <h3>{title}</h3>
      <div className="value">{value}</div>
    </div>
  );
}