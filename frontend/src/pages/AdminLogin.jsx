import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Space,
  Divider,
  Layout,
} from "antd"
import {
  MailOutlined,
  LockOutlined,
  ArrowRightOutlined,
  InfoCircleOutlined,
  SafetyCertificateFilled,
  HomeOutlined,
} from "@ant-design/icons"
import api from "../services/api.js"
import useAuthStore from "../store/authStore.js"

const { Title, Text } = Typography
const { Content } = Layout

export default function AdminLogin() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)

  const onFinish = async (values) => {
    setLoading(true)
    setError("")
    try {
      console.log(import.meta.env.VITE_API_BASE_URL);
      const res = await api.post("/auth/login/", {
        email: values.email,
        password: values.password,
      })
      login(res.data)
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          background:
            "radial-gradient(1200px 600px at 50% -10%, #1677ff22, transparent), linear-gradient(180deg,#f4f7fc,#eaf1ff)",
        }}
      >
        <Space direction="vertical" align="center" size={20} style={{ width: "100%", maxWidth: 440 }}>
          <Space direction="vertical" align="center" size={10}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "linear-gradient(135deg,#1677ff,#0a3d8f)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 28,
                boxShadow: "0 10px 26px rgba(22,119,255,0.4)",
              }}
            >
              <SafetyCertificateFilled />
            </div>
            <Title level={3} style={{ margin: 0 }}>
              Administrator Access
            </Title>
            <Text type="secondary">Secure portal for authorized personnel</Text>
          </Space>

          <Card style={{ width: "100%" }}>
            <Title level={5} style={{ marginTop: 0 }}>
              Sign in to your account
            </Title>
            <Text type="secondary">
              Access the portal with your official administrator credentials.
            </Text>

            {error && (
              <Alert type="error" message={error} showIcon style={{ margin: "16px 0" }} />
            )}

            <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 16 }}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Enter email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input size="large" prefix={<MailOutlined />} placeholder="name@civicresolve.gov" />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Enter password" }]}
              >
                <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                iconPosition="end"
                icon={<ArrowRightOutlined />}
              >
                Sign In
              </Button>
            </Form>

            <Divider style={{ margin: "20px 0" }} />

            <Space align="start" size={10}>
              <InfoCircleOutlined style={{ fontSize: 18, color: "#1677ff" }} />
              <Text type="secondary">
                This system is for authorized personnel only. All activity is monitored.
              </Text>
            </Space>
          </Card>

          <Link to="/" style={{ color: "#0a3d8f", fontWeight: 600 }}>
            <HomeOutlined /> Back to public portal
          </Link>

          <Text type="secondary" style={{ fontSize: 12, textAlign: "center" }}>
            © 2024 CivicResolve Complaint Portal. All rights reserved.
          </Text>
        </Space>
      </Content>
    </Layout>
  )
}
