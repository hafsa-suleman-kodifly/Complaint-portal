import { Tag } from "antd"
import { getStatus } from "../utils/status.jsx"

// Reusable, theme-aware status pill used in tables, cards, and results.
export default function StatusTag({ status, size = "default" }) {
  const cfg = getStatus(status)
  return (
    <Tag
      icon={cfg.icon}
      color={cfg.color}
      style={{
        margin: 0,
        borderRadius: 999,
        padding: size === "small" ? "1px 10px" : "3px 12px",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {cfg.label}
    </Tag>
  )
}
