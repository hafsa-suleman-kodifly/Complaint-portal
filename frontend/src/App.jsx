import { Layout, Menu, Typography } from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import SubmitComplaint from './pages/SubmitComplaint';
import TrackComplaint from './pages/TrackComplaint';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

function Home() {
  return (
    <div style={{ maxWidth: 720, margin: '48px auto', padding: '0 24px' }}>
      <Title level={2}>Complaint Management Portal</Title>
      <Paragraph>
        Submit a new complaint or track an existing one using your reference number.
      </Paragraph>
    </div>
  );
}

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0, marginRight: 32 }}>
          Complaint Portal
        </Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectable={false}
          items={[
            { key: 'home', label: <Link to="/">Home</Link> },
            { key: 'new', label: <Link to="/complaints/new">Submit Complaint</Link> },
            { key: 'track', label: <Link to="/complaints/track">Track Complaint</Link> },
          ]}
        />
      </Header>
      <Content style={{ padding: '24px 48px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/complaints/new" element={<SubmitComplaint />} />
          <Route path="/complaints/track" element={<TrackComplaint />} />
        </Routes>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Complaint Management Portal</Footer>
    </Layout>
  );
}
