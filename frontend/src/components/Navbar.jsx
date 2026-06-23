import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Grid,
  Badge,
  Avatar,
  Dropdown,
  Empty,
  Typography,
  Divider,
} from "antd"
import {
  MenuOutlined,
  BellOutlined,
  SafetyCertificateFilled,
  UserOutlined,
  LogoutOutlined,
  FormOutlined,
  SearchOutlined,
  DashboardOutlined,
  LoginOutlined,
} from "@ant-design/icons"
import useAuthStore from "../store/authStore.js"
import { useNotificationFeed } from "./NotificationCenter.jsx"
import StatusChangeCard from "./StatusChangeCard.jsx"

const { Header } = Layout
const { useBreakpoint } = Grid
const { Text } = Typography

const PUBLIC_LINKS = [
  { key: "/", label: "Submit Complaint", icon: <FormOutlined /> },
  { key: "/track", label: "Track Status", icon: <SearchOutlined /> },
]

export default function Navbar() {
  const screens = useBreakpoint()
  const isMobile = !screens.md
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [feedOpen, setFeedOpen] = useState(false)

  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { feed, unread, markRead } = useNotificationFeed()

  const links = [...PUBLIC_LINKS]
  if (user) links.push({ key: "/admin/dashboard", label: "Dashboard", icon: <DashboardOutlined /> })

  const activeKey =
    links.find((l) => l.key === location.pathname)?.key ||
    (location.pathname.startsWith("/admin") ? "/admin/dashboard" : location.pathname)

  const go = (key) => {
    navigate(key)
    setDrawerOpen(false)
  }

  const openFeed = () => {
    setFeedOpen(true)
    markRead()
  }

  const Brand = (
    <Link
      to="/"
      style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: "linear-gradient(135deg,#1677ff,#0a3d8f)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 20,
          boxShadow: "0 6px 16px rgba(22,119,255,0.35)",
        }}
      >
        <SafetyCertificateFilled />
      </div>
      <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: "#0f274d" }}>CivicResolve</div>
        <div style={{ fontSize: 11, color: "#7b8aa3", fontWeight: 500 }}>Complaint Portal</div>
      </div>
    </Link>
  )

  const userMenu = {
    items: [
      { key: "profile", icon: <UserOutlined />, label: user?.name || "Administrator", disabled: true },
      { type: "divider" },
      { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
      { key: "logout", icon: <LogoutOutlined />, label: "Sign out", danger: true },
    ],
    onClick: ({ key }) => {
      if (key === "logout") {
        logout()
        navigate("/")
      } else if (key === "dashboard") navigate("/admin/dashboard")
    },
  }

  const NotificationBell = (
    <Badge count={unread} size="small" offset={[-2, 2]}>
      <Button
        type="text"
        shape="circle"
        size="large"
        icon={<BellOutlined style={{ fontSize: 18 }} />}
        onClick={openFeed}
        aria-label="Notifications"
      />
    </Badge>
  )

  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 16px" : "0 32px",
        height: 68,
        borderBottom: "1px solid #eaeefb",
        backdropFilter: "blur(8px)",
      }}
    >
      {Brand}

      {!isMobile && (
        <Menu
          mode="horizontal"
          selectedKeys={[activeKey]}
          onClick={({ key }) => go(key)}
          items={links.map((l) => ({ key: l.key, label: l.label, icon: l.icon }))}
          style={{
            flex: 1,
            justifyContent: "center",
            borderBottom: "none",
            background: "transparent",
            fontWeight: 600,
          }}
        />
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user && NotificationBell}

        {!isMobile &&
          (user ? (
            <Dropdown menu={userMenu} placement="bottomRight" trigger={["click"]}>
              <Button type="text" style={{ height: 44, display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar size={30} style={{ background: "#1677ff" }} icon={<UserOutlined />} />
                <span style={{ fontWeight: 600, color: "#0f274d" }}>{user?.name || "Admin"}</span>
              </Button>
            </Dropdown>
          ) : (
            <Button type="primary" icon={<LoginOutlined />} onClick={() => navigate("/admin/login")}>
              Admin Login
            </Button>
          ))}

        {isMobile && (
          <Button
            type="text"
            size="large"
            icon={<MenuOutlined style={{ fontSize: 18 }} />}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          />
        )}
      </div>

      {/* Mobile navigation drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={280}
        title={Brand}
        styles={{ body: { padding: 12 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={({ key }) => go(key)}
          items={links.map((l) => ({ key: l.key, label: l.label, icon: l.icon }))}
          style={{ borderInlineEnd: "none", fontWeight: 600 }}
        />
        <Divider />
        {user ? (
          <Button
            danger
            block
            icon={<LogoutOutlined />}
            onClick={() => {
              logout()
              go("/")
            }}
          >
            Sign out
          </Button>
        ) : (
          <Button type="primary" block icon={<LoginOutlined />} onClick={() => go("/admin/login")}>
            Admin Login
          </Button>
        )}
      </Drawer>

      {/* Notification feed drawer */}
      <Drawer
        open={feedOpen}
        onClose={() => setFeedOpen(false)}
        placement="right"
        width={isMobile ? "85%" : 400}
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <BellOutlined style={{ color: "#1677ff" }} />
            <span>Notifications</span>
          </div>
        }
        styles={{ body: { padding: 16, background: "#f4f7fc" } }}
      >
        {feed.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications yet"
            style={{ marginTop: 80 }}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Recent status changes
            </Text>
            {feed.map((e) => (
              <div
                key={e.key}
                style={{
                  background: "#fff",
                  borderRadius: 14,
                  padding: 14,
                  border: "1px solid #eef2f8",
                }}
              >
                <StatusChangeCard event={e} compact />
                <div style={{ marginTop: 8, fontSize: 11, color: "#9aa7bd" }}>
                  {new Date(e.time).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </Header>
  )
}
