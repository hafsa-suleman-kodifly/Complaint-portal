import { useEffect, useMemo, useState } from "react"
import {
  Layout,
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Grid,
  Avatar,
  Tag,
  Empty,
  App as AntApp,
  Segmented,
} from "antd"
import {
  SearchOutlined,
  ReloadOutlined,
  InboxOutlined,
  SyncOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FilterOutlined,
} from "@ant-design/icons"
import api from "../services/api.js"
import StatCard from "../components/StatCard.jsx"
import StatusTag from "../components/StatusTag.jsx"
import { STATUS_OPTIONS, getStatus } from "../utils/status.jsx"

const { Content } = Layout
const { useBreakpoint } = Grid
const { Title, Text } = Typography

export default function AdminDashboard() {
  const { message } = AntApp.useApp()
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [view, setView] = useState("table")
  const [updatingId, setUpdatingId] = useState(null)

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/complaints/")
      setComplaints(res.data.results || res.data)
    } catch {
      message.error("Failed loading complaints")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {

  fetchComplaints()

  const WS_BASE = import.meta.env.VITE_WS_BASE_URL

  const socket = new WebSocket(
    `${WS_BASE}/ws/admin/notifications/`
  )

  socket.onopen = () => {
    console.log("Admin websocket connected")
  }


  socket.onmessage = (event) => {

    console.log("RAW MESSAGE:", event.data)

    const data = JSON.parse(event.data)

    console.log("WebSocket notification:", data)

    message.info(
      data.message || "Complaint updated"
    )

    fetchComplaints()
  }


  socket.onerror = (error) => {
    console.log("WebSocket error", error)
  }


  socket.onclose = (event) => {
    console.log(
      "Admin websocket disconnected",
      event.code,
      event.reason
    )
  }


  return () => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close()
    }
  }


}, [])
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id)
      await api.patch(`/admin/complaints/${id}/status/`, { status })
      message.success("Status updated")
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status, updated_at: new Date().toISOString() } : c)),
      )
    } catch {
      message.error("Update failed")
    } finally {
      setUpdatingId(null)
    }
  }

  const stats = useMemo(() => {
    const by = (s) => complaints.filter((c) => c.status === s).length
    return {
      total: complaints.length,
      open: by("open"),
      inProgress: by("in_progress"),
      resolved: by("resolved"),
    }
  }, [complaints])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return complaints.filter((c) => {
      const matchStatus = statusFilter === "ALL" || c.status === statusFilter
      const matchSearch =
        !q ||
        c.reference_number.toLowerCase().includes(q) ||
        c.title?.toLowerCase().includes(q) ||
        c.complainant_name?.toLowerCase().includes(q) ||
        c.complainant_email?.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [complaints, search, statusFilter])

  const StatusSelect = (record) => (
    <Select
      value={record.status}
      size="middle"
      style={{ width: 150 }}
      loading={updatingId === record.id}
      onChange={(v) => updateStatus(record.id, v)}
      options={STATUS_OPTIONS.map((o) => ({
        value: o.value,
        label: (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 999,
                background: getStatus(o.value).hex,
                display: "inline-block",
              }}
            />
            {o.label}
          </span>
        ),
      }))}
    />
  )

  const columns = [
    {
      title: "Reference",
      dataIndex: "reference_number",
      render: (v) => <Text strong style={{ color: "#0a3d8f" }}>{v}</Text>,
    },
    {
      title: "Complaint",
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: "#0f274d" }}>{r.title}</div>
          <Tag bordered={false} color="blue" style={{ marginTop: 4 }}>
            {r.category || "General"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Complainant",
      render: (_, r) => (
        <Space>
          <Avatar size={32} style={{ background: "#e6f0ff", color: "#1677ff" }} icon={<UserOutlined />} />
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600 }}>{r.complainant_name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {r.complainant_email}
            </Text>
          </div>
        </Space>
      ),
      responsive: ["lg"],
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (d) => new Date(d).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      responsive: ["md"],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, r) => StatusSelect(r),
    },
  ]

  const renderCards = () => (
    <Row gutter={[16, 16]}>
      {filtered.map((r) => (
        <Col xs={24} sm={12} xl={8} key={r.id}>
          <Card style={{ height: "100%" }} styles={{ body: { padding: 18 } }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <Text strong style={{ color: "#0a3d8f" }}>{r.reference_number}</Text>
              <StatusTag status={r.status} size="small" />
            </div>
            <div style={{ fontWeight: 600, color: "#0f274d", marginBottom: 6 }}>{r.title}</div>
            <Tag bordered={false} color="blue">{r.category || "General"}</Tag>
            <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "14px 0" }}>
              <Avatar size={28} style={{ background: "#e6f0ff", color: "#1677ff" }} icon={<UserOutlined />} />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.complainant_name}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>{r.complainant_email}</Text>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(r.created_at).toLocaleDateString()}
              </Text>
              {StatusSelect(r)}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  )

  return (
    <Content style={{ padding: isMobile ? "20px 16px 48px" : "32px 32px 56px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div>
          <Text style={{ color: "#1677ff", fontWeight: 700, letterSpacing: 1, fontSize: 12 }}>
            COMPLAINT MANAGEMENT
          </Text>
          <Title level={2} style={{ margin: "4px 0 0" }}>
            Overview
          </Title>
          <Text type="secondary">Monitor, triage, and resolve civic complaints in real time.</Text>
        </div>
        <Button icon={<ReloadOutlined />} onClick={fetchComplaints} loading={loading}>
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} lg={6}>
          <StatCard title="Total Complaints" value={stats.total} icon={<FileTextOutlined />} accent="#1677ff" loading={loading} />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard title="Open" value={stats.open} icon={<InboxOutlined />} accent="#1677ff" loading={loading} />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard title="In Progress" value={stats.inProgress} icon={<SyncOutlined />} accent="#d48806" loading={loading} />
        </Col>
        <Col xs={12} lg={6}>
          <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircleOutlined />} accent="#389e0d" loading={loading} />
        </Col>
      </Row>

      {/* Filters + content */}
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <Space wrap>
            <Input
              allowClear
              prefix={<SearchOutlined style={{ color: "#9aa7bd" }} />}
              placeholder="Search reference, title, or person"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: isMobile ? "100%" : 280 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 170 }}
              suffixIcon={<FilterOutlined />}
              options={[{ value: "ALL", label: "All statuses" }, ...STATUS_OPTIONS]}
            />
          </Space>
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "table", icon: <UnorderedListOutlined />, label: isMobile ? null : "Table" },
              { value: "cards", icon: <AppstoreOutlined />, label: isMobile ? null : "Cards" },
            ]}
          />
        </div>

        {view === "table" ? (
          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={filtered}
            scroll={{ x: "max-content" }}
            pagination={{ pageSize: 8, showSizeChanger: false, hideOnSinglePage: true }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No complaints match your filters"
                  style={{ padding: "32px 0" }}
                />
              ),
            }}
          />
        ) : filtered.length ? (
          renderCards()
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No complaints match your filters" style={{ padding: "48px 0" }} />
        )}
      </Card>
    </Content>
  )
}
