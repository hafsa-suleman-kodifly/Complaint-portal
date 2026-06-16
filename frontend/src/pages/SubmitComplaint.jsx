import { Button, Card, Form, Input, Typography } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

export default function SubmitComplaint() {
  return (
    <Card style={{ maxWidth: 640, margin: '0 auto' }}>
      <Title level={3}>Submit a Complaint</Title>
      <Form layout="vertical">
        <Form.Item label="Full Name" name="full_name" rules={[{ required: true }]}>
          <Input placeholder="Your full name" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input placeholder="you@example.com" />
        </Form.Item>
        <Form.Item label="Phone" name="phone">
          <Input placeholder="Optional" />
        </Form.Item>
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input maxLength={150} placeholder="Brief summary" />
        </Form.Item>
        <Form.Item label="Description" name="description" rules={[{ required: true, min: 20 }]}>
          <TextArea rows={5} placeholder="Describe your issue (min 20 characters)" />
        </Form.Item>
        <Button type="primary" htmlType="submit" disabled>
          Submit (API coming soon)
        </Button>
      </Form>
    </Card>
  );
}
