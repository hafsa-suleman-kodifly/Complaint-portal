import { Layout, Typography, Space } from "antd"
import { SafetyCertificateFilled } from "@ant-design/icons"

const { Footer } = Layout
const { Text } = Typography

export default function AppFooter() {
  return (
    <Footer style={{ textAlign: "center", padding: "28px 16px" }}>
      <Space direction="vertical" size={6}>
        <Space size={8} style={{ color: "#0f274d", fontWeight: 700 }}>
          <SafetyCertificateFilled style={{ color: "#1677ff" }} />
          CivicResolve Complaint Portal
        </Space>
        <Space split={<Text type="secondary">·</Text>} wrap>
          <Text type="secondary">Portal Support</Text>
          <Text type="secondary">Privacy Policy</Text>
          <Text type="secondary">Terms of Use</Text>
        </Space>
        <Text type="secondary" style={{ fontSize: 12 }}>
          © 2024 CivicResolve. All rights reserved.
        </Text>
      </Space>
    </Footer>
  )
}
