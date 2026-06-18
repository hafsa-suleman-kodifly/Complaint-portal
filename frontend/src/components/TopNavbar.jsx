import { Layout, Typography, Button, Space, Drawer, Menu, Grid } from "antd";
import { MenuOutlined, LoginOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function TopNavbar() {
  const screens = useBreakpoint();
  const mobile = !screens.md;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "home",
      label: "Home",
      onClick: () => {
        navigate("/");
        setOpen(false);
      }
    },
    {
      key: "complaint",
      label: "Lodge Complaint",
      onClick: () => {
        navigate("/complaints/new");
        setOpen(false);
      }
    },
    {
      key: "track",
      label: "Track Status",
      onClick: () => {
        navigate("/complaints/track");
        setOpen(false);
      }
    }
  ];

  return (
    <>
      <Header
        style={{
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#fff",
          borderBottom: "1px solid #c4c6cf",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: mobile ? "0 16px" : "0 64px"
        }}
      >
        <Title level={4} style={{ margin: 0, color: "#002046" }}>
          CivicResolve
        </Title>

        {!mobile && (
          <Menu
            mode="horizontal"
            items={menuItems}
            selectedKeys={[]}
            style={{
              flex: 1,
              justifyContent: "center",
              borderBottom: "none"
            }}
          />
        )}

        <Space>
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={() => navigate("/admin/login")}
            style={{
              background: "#002046",
              borderColor: "#002046",
              borderRadius: 8
            }}
          >
            Admin Login
          </Button>

          {mobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setOpen(true)}
            />
          )}
        </Space>
      </Header>

      <Drawer open={open} onClose={() => setOpen(false)} placement="right">
        <Menu mode="vertical" items={menuItems} />
      </Drawer>
    </>
  );
}