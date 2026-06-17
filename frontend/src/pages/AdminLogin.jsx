import { Form, Input, Button, Card, Typography, Alert } from "antd";
import { useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";

const { Title } = Typography;


export default function AdminLogin() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const login = useAuthStore(
   (state)=>state.login
);

  const onFinish = async (values) => {
    setLoading(true);
    setError("");
    
    try {
    const response =
        await api.post(
        "/auth/login/",
        {
            email: values.email,
            password: values.password
        }
        );


    console.log(response.data);
    login(response.data);
    alert("Login successful");


    window.location.href =
        "/admin/dashboard";

    }
    catch(error){
    console.log("FULL ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    setError(
      error.response?.data?.detail ||
      "Invalid email or password"
    );
}
    finally{
    setLoading(false);
    }
  };


  return (
    <Card
      style={{
        maxWidth: 420,
        margin: "60px auto"
      }}
    >

      <Title level={3}>
        Admin Login
      </Title>


      {error && (
        <Alert
          message={error}
          type="error"
          style={{ marginBottom: 20 }}
        />
      )}


      <Form
        layout="vertical"
        onFinish={onFinish}
      >

        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required:true,
              message:"Enter email"
            },
            {
              type:"email",
              message:"Invalid email"
            }
          ]}
        >

          <Input
            placeholder="admin@test.com"
          />

        </Form.Item>



        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required:true,
              message:"Enter password"
            }
          ]}
        >

          <Input.Password
            placeholder="Password"
          />

        </Form.Item>



        <Button
          type="primary"
          htmlType="submit"
          block
          loading={loading}
        >
          Login
        </Button>


      </Form>

    </Card>
  );
}