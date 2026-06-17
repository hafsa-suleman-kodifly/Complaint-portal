import { useState } from "react";
import { Button, Card, Form, Input, Typography, message, Result } from "antd";
import api from "../services/api";

const { Title } = Typography;

export default function TrackComplaint() {

  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [notFound, setNotFound] = useState(false);


  const onFinish = async (values) => {

    setLoading(true);

    // reset previous state
    setComplaint(null);
    setNotFound(false);

    try {

      const response = await api.get(
        "/complaints/track/",
        {
          params: {
            ref: values.reference_number,
            email: values.email
          }
        }
      );


      setComplaint(response.data);

      message.success("Complaint found");


    } catch (error) {

      if (error.response?.status === 404) {

        setNotFound(true);
        message.error("Complaint not found");

      } else {

        message.error("Something went wrong");

      }

    } finally {

      setLoading(false);

    }

  };


  if (complaint) {

    return (
      <Card style={{ maxWidth:480, margin:"0 auto" }}>

        <Result
          status="success"
          title="Complaint Found"
          subTitle={
            <>
              Reference:
              <br />
              <b>{complaint.reference_number}</b>

              <br />

              Status:
              <br />
              <b>{complaint.status}</b>

              <br />

              Created:
              <br />
              <b>
                {
                  complaint.created_at
                    ? new Date(
                        complaint.created_at
                      ).toLocaleString()
                    : "N/A"
                }
              </b>

              <br />

              Updated:
              <br />
              <b>
                {
                  complaint.updated_at
                    ? new Date(
                        complaint.updated_at
                      ).toLocaleString()
                    : "N/A"
                }
              </b>

              {
                complaint.resolved_at && (
                  <>
                    <br />

                    Resolved:
                    <br />

                    <b>
                      {new Date(
                        complaint.resolved_at
                      ).toLocaleString()}
                    </b>
                  </>
                )
              }

            </>
          }

          extra={
            <Button
              type="primary"
              onClick={()=>{
                setComplaint(null);
              }}
            >
              Track Another
            </Button>
          }

        />

      </Card>
    );
  }


  if (notFound) {

    return (
      <Card style={{ maxWidth:480, margin:"0 auto" }}>

        <Result
          status="error"
          title="Complaint Not Found"
          subTitle="Check your reference number and email"

          extra={
            <Button
              type="primary"
              onClick={()=>{
                setNotFound(false);
              }}
            >
              Try Again
            </Button>
          }

        />

      </Card>
    );
  }


  return (

    <Card
      style={{
        maxWidth:480,
        margin:"0 auto"
      }}
    >

      <Title level={3}>
        Track Your Complaint
      </Title>


      <Form
        layout="vertical"
        onFinish={onFinish}
      >


        <Form.Item
          label="Reference Number"
          name="reference_number"
          rules={[
            {
              required:true,
              message:"Enter reference number"
            }
          ]}
        >

          <Input placeholder="CMP-2026-0001"/>

        </Form.Item>



        <Form.Item
          label="Email"
          name="email"
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



        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
        >
          Track
        </Button>


      </Form>


    </Card>

  );
}