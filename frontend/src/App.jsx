import { Layout, Typography } from "antd";
import { Route, Routes } from "react-router-dom";

import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import TopNavbar from "./components/TopNavbar";


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



export default function App(){


  return (

    <Layout
      style={{
        minHeight:"100vh"
      }}
    >


      {/* SINGLE GLOBAL NAVBAR */}

      <TopNavbar />



      <Content
        style={{
          padding:"24px 48px"
        }}
      >

        <Routes>


          <Route
            path="/"
            element={<Home />}
          />


          <Route
            path="/complaints/new"
            element={<SubmitComplaint />}
          />


          <Route
            path="/complaints/track"
            element={<TrackComplaint />}
          />


          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />


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



      <Footer
        style={{
          textAlign:"center"
        }}
      >

        Complaint Management Portal

      </Footer>



    </Layout>

  );

}