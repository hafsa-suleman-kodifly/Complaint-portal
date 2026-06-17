import { useState } from "react";
import { Button, Card, Form, Input, Typography, message, Result } from "antd";
import { Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import api from "../services/api";

const { Title } = Typography;
const { TextArea } = Input;


export default function SubmitComplaint() {

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [fileList, setFileList] = useState([]); 

  const onFinish = async (values) => {

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("complainant_name", values.complainant_name);
      formData.append("complainant_email", values.complainant_email);
      formData.append("complainant_phone", values.complainant_phone || "");
      formData.append("title", values.title);
      formData.append("description", values.description);


      if (fileList.length > 0) {
        formData.append(
          "file",
          fileList[0].originFileObj
        );
      }


      const response = await api.post(
        "/complaints/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Complaint submitted successfully");

      setSubmitted(response.data);

    } catch (error) {

      message.error(
        error.response?.data?.detail ||
        "Failed to submit complaint"
      );

    } finally {
      setLoading(false);
    }
  };


  if (submitted) {
    return (
      <Result
        status="success"
        title="Complaint Submitted"
        subTitle={
          <>
            Your reference number is:
            <br />
            <b>{submitted.reference_number}</b>
          </>
        }
      />
    );
  }


  return (
    <Card style={{ maxWidth: 640, margin: "0 auto" }}>

      <Title level={3}>
        Submit a Complaint
      </Title>


      <Form
        layout="vertical"
        onFinish={onFinish}
      >


        <Form.Item
          label="Full Name"
          name="complainant_name"
          rules={[
            {
              required:true,
              message:"Enter your name"
            }
          ]}
        >
          <Input placeholder="Your full name"/>
        </Form.Item>



        <Form.Item
          label="Email"
          name="complainant_email"
          rules={[
            {
              required:true,
              type:"email",
              message:"Enter valid email"
            }
          ]}
        >
          <Input placeholder="you@example.com"/>
        </Form.Item>



        <Form.Item
          label="Phone"
          name="complainant_phone"
        >
          <Input placeholder="Optional"/>
        </Form.Item>



        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required:true,
              max:150
            }
          ]}
        >
          <Input placeholder="Complaint title"/>
        </Form.Item>



        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required:true,
              min:20,
              message:"Minimum 20 characters"
            }
          ]}
        >
          <TextArea
            rows={5}
            placeholder="Describe your issue"
          />
        </Form.Item>
        <Form.Item label="Attachment" name="file">
        <Upload
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          maxCount={1}
        >
              <Button icon={<UploadOutlined />}>
                Upload File
              </Button>
            </Upload>
          </Form.Item>



        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Submit Complaint
        </Button>


      </Form>

    </Card>
  );
}