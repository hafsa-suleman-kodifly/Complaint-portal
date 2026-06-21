import { useState, useRef } from "react"
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  Result,
  Row,
  Col,
  Upload,
  App as AntApp,
  Steps,
  Tag,
} from "antd"
import {
  UploadOutlined,
  FormOutlined,
  CheckCircleFilled,
  CopyOutlined,
  InfoCircleOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
  FileTextOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import api from "../services/api.js"
import PageHero from "../components/PageHero.jsx"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const RULES = [
  "Provide valid contact details so we can reach you.",
  "Use a clear, specific complaint title.",
  "Describe the issue in at least 20 characters.",
  "Upload relevant evidence (up to 3 files).",
]

export default function SubmitComplaint() {
  const { message } = AntApp.useApp()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [fileList, setFileList] = useState([])
  const idempotencyKey = useRef(crypto.randomUUID()).current

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("complainant_name", values.complainant_name)
      formData.append("complainant_email", values.complainant_email)
      formData.append("complainant_phone", values.complainant_phone || "")
      formData.append("title", values.title)
      formData.append("description", values.description)
      fileList.forEach((file) => {
        if (file.originFileObj) formData.append("attachments", file.originFileObj)
      })

      const response = await api.post("/complaints/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Idempotency-Key": idempotencyKey,
        },
      })

      message.success("Complaint submitted successfully")
      setSubmitted(response.data)
      form.resetFields()
      setFileList([])
    } catch (error) {
      message.error(
        error.response?.data?.attachments?.[0] ||
          error.response?.data?.detail ||
          "Failed to submit complaint",
      )
    } finally {
      setLoading(false)
    }
  }

  const copyRef = () => {
    navigator.clipboard?.writeText(submitted.reference_number)
    message.success("Reference number copied")
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "48px 16px" }}>
        <Card style={{ textAlign: "center" }}>
          <Result
            icon={<CheckCircleFilled style={{ color: "#389e0d" }} />}
            title="Complaint Submitted"
            subTitle="Your complaint has been recorded. Save your reference number to track its progress."
          />
          <div
            style={{
              background: "#f0f5ff",
              border: "1px dashed #1677ff",
              borderRadius: 12,
              padding: 20,
              margin: "0 auto 24px",
              maxWidth: 360,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              Reference Number
            </Text>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#0a3d8f",
                letterSpacing: 1,
                margin: "6px 0 12px",
              }}
            >
              {submitted.reference_number}
            </div>
            <Button icon={<CopyOutlined />} onClick={copyRef}>
              Copy reference
            </Button>
          </div>
          <Row gutter={12} justify="center">
            <Col>
              <Button type="primary" onClick={() => navigate("/track")}>
                Track this complaint
              </Button>
            </Col>
            <Col>
              <Button onClick={() => setSubmitted(null)}>Submit another</Button>
            </Col>
          </Row>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        eyebrow="Citizen Services"
        icon={<FormOutlined />}
        title="Submit a Complaint"
        subtitle="Report civic issues directly to the responsible department. Your feedback helps us improve public services."
      />

      <div style={{ maxWidth: 1080, margin: "-64px auto 56px", padding: "0 16px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={15}>
            <Card>
              <Title level={4} style={{ marginTop: 0 }}>
                Complaint details
              </Title>
              <Paragraph type="secondary" style={{ marginTop: -4 }}>
                Please provide accurate information to ensure your request is processed efficiently.
              </Paragraph>

              <Form form={form} layout="vertical" requiredMark="optional" onFinish={onFinish}>
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Full Name"
                      name="complainant_name"
                      rules={[{ required: true, message: "Enter your name" }]}
                    >
                      <Input size="large" prefix={<UserOutlined />} placeholder="Jane Doe" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email Address"
                      name="complainant_email"
                      rules={[
                        { required: true, message: "Enter your email" },
                        { type: "email", message: "Enter a valid email" },
                      ]}
                    >
                      <Input size="large" prefix={<MailOutlined />} placeholder="name@example.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label="Phone" name="complainant_phone">
                  <Input size="large" prefix={<PhoneOutlined />} placeholder="Optional" />
                </Form.Item>

                <Form.Item
                  label="Complaint Title"
                  name="title"
                  rules={[{ required: true, max: 150, message: "Enter a title (max 150 chars)" }]}
                >
                  <Input size="large" prefix={<FileTextOutlined />} placeholder="Brief summary of the issue" />
                </Form.Item>

                <Form.Item
                  label="Detailed Description"
                  name="description"
                  rules={[{ required: true, min: 20, message: "Minimum 20 characters" }]}
                >
                  <TextArea rows={6} showCount maxLength={1200} placeholder="Describe your issue in detail" />
                </Form.Item>

                <Form.Item label="Supporting Documents">
                  <Upload
                    listType="picture"
                    fileList={fileList}
                    onChange={({ fileList: fl }) => setFileList(fl)}
                    beforeUpload={() => false}
                    maxCount={3}
                  >
                    <Button size="large" icon={<UploadOutlined />} disabled={fileList.length >= 3}>
                      Upload File
                    </Button>
                  </Upload>
                </Form.Item>

                <Button type="primary" htmlType="submit" loading={loading} block size="large">
                  Submit Complaint
                </Button>
              </Form>
            </Card>
          </Col>

          <Col xs={24} lg={9}>
            <Card style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <InfoCircleOutlined style={{ color: "#1677ff", fontSize: 18 }} />
                <Title level={5} style={{ margin: 0 }}>
                  Submission Guidelines
                </Title>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {RULES.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Tag color="blue" style={{ borderRadius: 999, margin: 0, minWidth: 24, textAlign: "center" }}>
                      {i + 1}
                    </Tag>
                    <Text type="secondary">{r}</Text>
                  </div>
                ))}
              </div>
            </Card>

            <Card style={{ background: "linear-gradient(135deg,#0a3d8f,#1677ff)", border: "none" }}>
              <Title level={5} style={{ color: "#fff", marginTop: 0 }}>
                How it works
              </Title>
              <Steps
                direction="vertical"
                size="small"
                current={-1}
                items={[
                  { title: <span style={{ color: "#fff" }}>Submit your complaint</span> },
                  { title: <span style={{ color: "#fff" }}>Receive a reference number</span> },
                  { title: <span style={{ color: "#fff" }}>Track real-time progress</span> },
                ]}
                style={{ ["--cr-step"]: "#fff" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
