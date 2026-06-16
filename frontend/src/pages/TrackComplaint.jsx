import { Button, Card, Form, Input, Typography } from 'antd';

const { Title } = Typography;

export default function TrackComplaint() {
  return (
    <Card style={{ maxWidth: 480, margin: '0 auto' }}>
      <Title level={3}>Track Your Complaint</Title>
      <Form layout="vertical">
        <Form.Item
          label="Reference Number"
          name="reference_number"
          rules={[{ required: true, message: 'Please enter a valid reference number' }]}
        >
          <Input placeholder="CMP-2026-0001" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled>
          Track (API coming soon)
        </Button>
      </Form>
    </Card>
  );
}
