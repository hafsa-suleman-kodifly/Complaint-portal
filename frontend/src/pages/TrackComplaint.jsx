import { useState } from "react"
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Result,
  Row,
  Col,
  Descriptions,
  Timeline,
  App as AntApp,
} from "antd"
import {
  SearchOutlined,
  MailOutlined,
  NumberOutlined,
  FrownOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from "@ant-design/icons"
import api from "../services/api.js"
import PageHero from "../components/PageHero.jsx"
import StatusTag from "../components/StatusTag.jsx"
import { getStatus } from "../utils/status.jsx"

const { Title, Text } = Typography

function fmt(d) {
  return d ? new Date(d).toLocaleString() : "N/A"
}

export default function TrackComplaint() {
  const { message } = AntApp.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [complaint, setComplaint] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const onFinish = async (v) => {
    setLoading(true)
    setComplaint(null)
    setNotFound(false)
    try {
      const r = await api.get("/complaints/track/", {
        params: { ref: v.reference_number, email: v.email },
      })
      setComplaint(r.data)
      message.success("Complaint found")
    } catch (e) {
      if (e.response?.status === 404) {
        setNotFound(true)
        message.error("Complaint not found")
      } else {
        message.error("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setComplaint(null)
    setNotFound(false)
    form.resetFields()
  }

  const buildTimeline = (c) => {
    const items = [
      {
        color: "#1677ff",
        children: (
          <>
            <Text strong>Complaint submitted</Text>
            <div style={{ color: "#7b8aa3", fontSize: 12 }}>{fmt(c.created_at)}</div>
          </>
        ),
      },
      {
        color: getStatus(c.status).hex,
        children: (
          <>
            <Text strong>Last updated · {getStatus(c.status).label}</Text>
            <div style={{ color: "#7b8aa3", fontSize: 12 }}>{fmt(c.updated_at)}</div>
          </>
        ),
      },
    ]
    if (c.resolved_at) {
      items.push({
        color: "#389e0d",
        children: (
          <>
            <Text strong>Resolved</Text>
            <div style={{ color: "#7b8aa3", fontSize: 12 }}>{fmt(c.resolved_at)}</div>
          </>
        ),
      })
    }
    return items
  }

  return (
    <div>
      <PageHero
        eyebrow="Real-time Tracking"
        icon={<SearchOutlined />}
        title="Track Your Complaint"
        subtitle="Enter your reference number and email to view the latest status and updates."
      />

      <div style={{ maxWidth: 760, margin: "-64px auto 56px", padding: "0 16px" }}>
        <Card>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Reference Number"
                  name="reference_number"
                  rules={[{ required: true, message: "Enter your reference number" }]}
                >
                  <Input size="large" prefix={<NumberOutlined />} placeholder="CR-2024-1000" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: "Enter your email" },
                    { type: "email", message: "Enter a valid email" },
                  ]}
                >
                  <Input size="large" prefix={<MailOutlined />} placeholder="name@example.com" />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              icon={<SearchOutlined />}
            >
              Track Progress
            </Button>
          </Form>
        </Card>

        {complaint && (
          <Card style={{ marginTop: 24 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Reference
                </Text>
                <Title level={4} style={{ margin: 0 }}>
                  {complaint.reference_number}
                </Title>
              </div>
              <StatusTag status={complaint.status} />
            </div>

            <Descriptions
              column={{ xs: 1, sm: 2 }}
              size="middle"
              items={[
                { key: "title", label: "Title", children: complaint.title },
                { key: "cat", label: "Category", children: complaint.category || "General" },
                {
                  key: "created",
                  label: (
                    <span>
                      <CalendarOutlined /> Created
                    </span>
                  ),
                  children: fmt(complaint.created_at),
                },
                {
                  key: "updated",
                  label: (
                    <span>
                      <CalendarOutlined /> Updated
                    </span>
                  ),
                  children: fmt(complaint.updated_at),
                },
              ]}
            />

            <Title level={5} style={{ marginTop: 24 }}>
              Progress timeline
            </Title>
            <Timeline items={buildTimeline(complaint)} style={{ marginTop: 12 }} />

            <Button icon={<ReloadOutlined />} onClick={reset}>
              Track another complaint
            </Button>
          </Card>
        )}

        {notFound && (
          <Card style={{ marginTop: 24 }}>
            <Result
              icon={<FrownOutlined style={{ color: "#1677ff" }} />}
              title="Complaint not found"
              subTitle="We couldn't find a complaint matching that reference number and email. Please check your details and try again."
              extra={
                <Button type="primary" onClick={() => setNotFound(false)}>
                  Try Again
                </Button>
              }
            />
          </Card>
        )}
      </div>
    </div>
  )
}
