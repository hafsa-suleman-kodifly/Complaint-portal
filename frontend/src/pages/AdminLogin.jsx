import {Form,Input,Button,Card,Typography,Alert,Space,Divider,Layout} from "antd";
import {MailOutlined,LockOutlined,BankOutlined,ArrowRightOutlined,InfoCircleOutlined} from "@ant-design/icons";
import {useState} from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";

const {Title,Text}=Typography;
const {Content}=Layout;

export default function AdminLogin(){

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const login=useAuthStore(state=>state.login);

  const onFinish=async(values)=>{

    setLoading(true);
    setError("");

    try{

      const res=await api.post("/auth/login/",{
        email:values.email,
        password:values.password
      });

      login(res.data);
      window.location.href="/admin/dashboard";

    }catch(err){

      setError(err.response?.data?.detail || "Invalid credentials");

    }finally{
      setLoading(false);
    }
  };


  return (

    <Layout style={{minHeight:"100vh",background:"radial-gradient(circle at top right,#e5eeff,#f8f9ff)"}}>

      <Content>

        <Space direction="vertical" align="center" style={{width:"100%",minHeight:"100vh",justifyContent:"center",padding:24}}>


          <Space direction="vertical" align="center" size={2}>

            <Space size={10} align="center">

              <BankOutlined style={{fontSize:40,color:"#002046"}}/>

              <Title level={2} style={{margin:0,color:"#002046"}}>
                CivicResolve
              </Title>

            </Space>

            <Text type="secondary">
              Administrative Secure Access
            </Text>

          </Space>


          <Card style={{width:"100%",maxWidth:440,borderRadius:16,boxShadow:"0 4px 20px rgba(27,54,93,.08)"}} bodyStyle={{padding:30}}>


            <Title level={3}>Sign In</Title>

            <Text type="secondary">
              Access the portal with your official administrator credentials.
            </Text>


            {error && <Alert style={{marginTop:20}} message={error} type="error"/>}


            <Form layout="vertical" onFinish={onFinish} style={{marginTop:25}}>


              <Form.Item
                label="Official Email"
                name="email"
                rules={[{required:true,message:"Enter email"},{type:"email",message:"Invalid email"}]}
              >

                <Input size="large" prefix={<MailOutlined/>} placeholder="name@civicresolve.gov"/>

              </Form.Item>


              <Form.Item
                label="Password"
                name="password"
                rules={[{required:true,message:"Enter password"}]}
              >

                <Input.Password size="large" prefix={<LockOutlined/>} placeholder="Password"/>

              </Form.Item>


              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                icon={<ArrowRightOutlined/>}
                style={{background:"#002046",borderColor:"#002046",borderRadius:10}}
              >
                Sign In
              </Button>


            </Form>


            <Divider/>


            <Space align="start">

              <InfoCircleOutlined style={{fontSize:20,color:"#49607b"}}/>

              <Text type="secondary">
                This system is for authorized personnel only.
              </Text>

            </Space>


          </Card>


          <Space style={{marginTop:20}}>

            <Text type="secondary">Portal Support</Text>
            <Text>|</Text>
            <Text type="secondary">Privacy Policy</Text>
            <Text>|</Text>
            <Text type="secondary">Terms of Use</Text>

          </Space>


          <Text type="secondary" style={{marginTop:30}}>
            © 2024 CivicResolve Complaint Portal. All rights reserved.
          </Text>


        </Space>

      </Content>

    </Layout>

  );

}