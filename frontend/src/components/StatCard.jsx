import { Card, Statistic, Skeleton } from "antd"

// Modern statistic widget with an accent icon chip.
export default function StatCard({ title, value, icon, accent = "#1677ff", loading }) {
  return (
    <Card style={{ height: "100%" }} styles={{ body: { padding: 20 } }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: `${accent}1a`,
            color: accent,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div style={{ flex: 1 }}>
          {loading ? (
            <Skeleton active paragraph={false} title={{ width: "70%" }} />
          ) : (
            <Statistic
              title={title}
              value={value}
              valueStyle={{ fontWeight: 800, color: "#0f274d", fontSize: 26 }}
            />
          )}
        </div>
      </div>
    </Card>
  )
}
