import { Button, Typography, Avatar } from "antd"
import { ArrowRightOutlined, BellFilled, UserOutlined } from "@ant-design/icons"
import StatusTag from "./StatusTag.jsx"

const { Text } = Typography

// The visual body of a realtime status-change popup. Reused by both the
// floating notification and the feed drawer.
export default function StatusChangeCard({ event, onOk, compact = false }) {
  return (
    <div style={{ padding: compact ? 0 : 4 }}>
      {!compact && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "linear-gradient(90deg,#1677ff,#0a3d8f)",
            margin: "-12px -12px 14px",
            padding: "12px 16px",
            color: "#fff",
          }}
        >
          <BellFilled style={{ fontSize: 18 }} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Status Updated</span>
        </div>
      )}

      <div style={{ padding: compact ? 0 : "0 4px" }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Reference Number
        </Text>
        <div style={{ fontWeight: 700, fontSize: 16, color: "#0f274d", marginBottom: 12 }}>
          {event.reference_number}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          <StatusTag status={event.old_status} size="small" />
          <ArrowRightOutlined style={{ color: "#8c8c8c" }} />
          <StatusTag status={event.new_status} size="small" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: compact ? 0 : 16 }}>
          <Avatar size={24} icon={<UserOutlined />} style={{ background: "#e6f0ff", color: "#1677ff" }} />
          <Text type="secondary" style={{ fontSize: 13 }}>
            Changed by <Text strong>{event.changed_by}</Text>
          </Text>
        </div>

        {!compact && (
          <Button type="primary" block onClick={onOk} style={{ borderRadius: 10 }}>
            OK, got it
          </Button>
        )}
      </div>
    </div>
  )
}
