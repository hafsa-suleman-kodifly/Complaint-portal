import { useEffect, useState } from "react";
import { Table, Card, Tag, message, Row, Col, Select } from "antd";
import api from "../services/api";


export default function AdminDashboard(){

 
  const [complaints,setComplaints] = useState([]);
  const [loading,setLoading] = useState(false);

  const fetchComplaints = async()=>{

    try{

      setLoading(true);

      const res = await api.get(
        "/admin/complaints/"
      );

      setComplaints(
        res.data.results || res.data
      );

    }
    catch(err){

      message.error(
        "Failed to load complaints"
      );

    }
    finally{
      setLoading(false);
    }
  };


  useEffect(()=>{
    fetchComplaints();
  },[]);



  const updateStatus = async(id,status)=>{

    try{

      await api.patch(
        `/admin/complaints/${id}/`,
        {
          status: status
        }
      );


      message.success(
        "Status updated"
      );


      fetchComplaints();


    }catch(error){

      message.error(
        "Failed to update status"
      );

    }

  };



  const columns=[

    {
      title:"Reference",
      dataIndex:"reference_number",
    },


    {
      title:"Name",
      dataIndex:"complainant_name",
    },


    {
      title:"Email",
      dataIndex:"complainant_email",
    },


    {
      title:"Title",
      dataIndex:"title",
    },


    {
      title:"Status",
      dataIndex:"status",

      render:(status, record)=>(

        <Select
          value={status}
          style={{
            width:140
          }}

          onChange={(value)=>
            updateStatus(record.id,value)
          }
        >

          <Select.Option value="open">
            <Tag color="blue">
              Open
            </Tag>
          </Select.Option>


          <Select.Option value="in_progress">
            <Tag color="orange">
              In Progress
            </Tag>
          </Select.Option>


          <Select.Option value="resolved">
            <Tag color="green">
              Resolved
            </Tag>
          </Select.Option>


          <Select.Option value="closed">
            <Tag color="red">
              Closed
            </Tag>
          </Select.Option>


        </Select>

      )
    },


    {
      title:"Created",
      dataIndex:"created_at",

      render:(date)=>(
        new Date(date).toLocaleString()
      )
    }

  ];



  return (

    <Row justify="center">

      <Col
        xs={24}
        sm={24}
        md={22}
        lg={20}
        xl={18}
      >

        <Card title="Admin Complaint Dashboard">


          <Table

            rowKey="id"

            loading={loading}

            columns={columns}

            dataSource={complaints}

            scroll={{
              x:900
            }}

            pagination={{
              pageSize:10
            }}

          />


        </Card>

      </Col>

    </Row>

  );
}