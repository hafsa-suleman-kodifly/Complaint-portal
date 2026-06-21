import { Layout, Typography } from "antd";
import { Route, Routes } from "react-router-dom";

import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/Navbar";
import AppFooter from "./components/AppFooter";                         
import NotificationProvider from "./components/NotificationCenter";

const {
  Content,
  Footer
} = Layout;


const {
  Title,
  Paragraph
} = Typography;



function Home(){

  return (

    <div
      style={{
        maxWidth:720,
        margin:"48px auto",
        padding:"0 24px"
      }}
    >

      <Title level={2}>
        Complaint Management Portal
      </Title>


      <Paragraph>

        Submit a new complaint or track an existing one using your reference number.

      </Paragraph>


    </div>

  );

}


export default function App() {
  return (
    <NotificationProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar />
        <Content>
          <Routes>
            <Route path="/" element={<SubmitComplaint />} />
            <Route path="/track" element={<TrackComplaint />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
          </Routes>
        </Content>
        <AppFooter />
      </Layout>
    </NotificationProvider>
  );
}
