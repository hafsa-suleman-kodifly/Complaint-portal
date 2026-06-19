import {useState, useRef} from "react";
import {Button,Card,Form,Input,Typography,message,Result} from "antd";
import {Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import api from "../services/api";

const {Title}=Typography;
const {TextArea}=Input;

export default function SubmitComplaint(){

  const [loading,setLoading]=useState(false);
  const [submitted,setSubmitted]=useState(null);
  const [fileList,setFileList]=useState([]);
  const idempotencyKey = useRef(crypto.randomUUID()).current;
      
  const onFinish=async(values)=>{

    setLoading(true);

    try{

      const formData=new FormData();

      formData.append("complainant_name",values.complainant_name);
      formData.append("complainant_email",values.complainant_email);
      formData.append("complainant_phone",values.complainant_phone || "");
      formData.append("title",values.title);
      formData.append("description",values.description);

      fileList.forEach(file => {
          formData.append(
              "attachments",
              file.originFileObj
          );
      });
      
      const response=await api.post(
        "/complaints/",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data",
            "Idempotency-Key": idempotencyKey,
          }
        }
      );

      message.success("Complaint submitted successfully");
      setSubmitted(response.data);

    }catch(error){
        console.log(error.response?.data);
        message.error(
          error.response?.data?.attachments?.[0] ||
          error.response?.data?.detail ||
          "Failed to submit complaint"
        );

    }finally{
      setLoading(false);
    }
  };


  if(submitted){

    return (

      <Result
        status="success"
        title="Complaint Submitted"
        subTitle={
          <>
            Your reference number is:
            <br/>
            <b>{submitted.reference_number}</b>
          </>
        }
      />

    );

  }


  return (
    <div style={{minHeight:"100vh",background:"#f8f9ff",padding:"64px 24px"}}>
    <div style={{maxWidth:1100,margin:"0 auto"}}>

    <div style={{marginBottom:30}}>
    <Title level={1} style={{color:"#002046",marginBottom:8}}>Submit a Formal Complaint</Title>
    <Typography.Text style={{fontSize:18,color:"#49607b"}}>
    Your feedback helps us improve civic services. Please provide accurate information to ensure your request is processed efficiently.
    </Typography.Text>
    </div>

    <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:24}}>

    <div>

    <Card style={{borderRadius:16,background:"#eff4ff",marginBottom:20}}>
    <Typography.Text strong>ℹ Submission Rules</Typography.Text>
    <ul style={{paddingLeft:20,color:"#49607b"}}>
    <li>Provide valid contact details.</li>
    <li>Use a clear complaint title.</li>
    <li>Upload relevant evidence.</li>
    </ul>
    </Card>

    <Card style={{borderRadius:16,background:"#002046",height:160}}>
    <Title level={4} style={{color:"#fff"}}>Secured</Title>
    </Card>

    </div>


    <Card style={{borderRadius:16,boxShadow:"0 4px 20px rgba(27,54,93,.08)"}} styles={{padding:30}}>

    <Form layout="vertical" onFinish={onFinish}>

    <Form.Item label="Full Name" name="complainant_name" rules={[{required:true,message:"Enter your name"}]}>
    <Input size="large" placeholder="Your full name"/>
    </Form.Item>

    <Form.Item label="Email Address" name="complainant_email" rules={[{required:true,type:"email",message:"Enter valid email"}]}>
    <Input size="large" placeholder="you@example.com"/>
    </Form.Item>

    <Form.Item label="Phone" name="complainant_phone">
    <Input size="large" placeholder="Optional"/>
    </Form.Item>

    <Form.Item label="Complaint Title" name="title" rules={[{required:true,max:150}]}>
    <Input size="large" placeholder="Brief summary of the issue"/>
    </Form.Item>

    <Form.Item label="Detailed Description" name="description" rules={[{required:true,min:20,message:"Minimum 20 characters"}]}>
    <TextArea rows={6} placeholder="Describe your issue"/>
    </Form.Item>

    <Form.Item label="Supporting Documents" name="file">

    <Upload
    fileList={fileList}
    onChange={({fileList})=>setFileList(fileList)}
    beforeUpload={()=>false}
    maxCount={3}
    >

    <Button size="large" icon={<UploadOutlined/>}>
    Upload File
    </Button>

    </Upload>

    </Form.Item>


    <Button
    type="primary"
    htmlType="submit"
    loading={loading}
    block
    size="large"
    style={{background:"#002046",borderColor:"#002046",borderRadius:10}}
    >
    Submit Complaint
    </Button>

    </Form>

    </Card>

    </div>

    </div>
    </div>
    );

}