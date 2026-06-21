import {
  ClockCircleOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons"

// Single source of truth for how each complaint status is presented.
export const STATUS_CONFIG = {
  open: {
    label: "Open",
    color: "blue",
    hex: "#1677ff",
    icon: <ClockCircleOutlined />,
  },
  in_progress: {
    label: "In Progress",
    color: "gold",
    hex: "#d48806",
    icon: <SyncOutlined spin />,
  },
  resolved: {
    label: "Resolved",
    color: "green",
    hex: "#389e0d",
    icon: <CheckCircleOutlined />,
  },
  closed: {
    label: "Closed",
    color: "default",
    hex: "#8c8c8c",
    icon: <StopOutlined />,
  },
}

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, c]) => ({
  value,
  label: c.label,
}))

export function getStatus(key) {
  return STATUS_CONFIG[key] || STATUS_CONFIG.OPEN
}
