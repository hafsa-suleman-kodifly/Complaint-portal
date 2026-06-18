import { Layout, Card, Table, Tag, Button, Input, Select, DatePicker, Space, Typography, Statistic, Row, Col, Grid, message } from "antd";
import { SearchOutlined, EyeOutlined, MoreOutlined, FilterOutlined, FileExcelOutlined, ClockCircleOutlined, TeamOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../services/api";

const { Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

export default function AdminDashboard(){

  const screens = useBreakpoint();
  const mobile = !screens.md;
  const [complaints,setComplaints] = useState([]);
  const [loading,setLoading] = useState(false);

  const fetchComplaints = async()=>{

    try{
      setLoading(true);
      const res = await api.get("/admin/complaints/");
      setComplaints(res.data.results || res.data);
    }catch{
      message.error("Failed loading complaints");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{fetchComplaints();},[]);

  const updateStatus = async(id,status)=>{

    try{

      await api.patch(`/admin/complaints/${id}/`,{status});
      message.success("Status updated");
      fetchComplaints();

    }catch{
      message.error("Update failed");
    }
  };


  const columns=[

    {
      title:"ID",
      dataIndex:"reference_number",
      render:v=><Text strong style={{color:"#002046"}}>#{v}</Text>
    },

    {
      title:"Complaint",
      render:(_,r)=>
      <div>
        <Text strong>{r.title}</Text><br/>
        <Text type="secondary">{r.category || "General"}</Text>
      </div>
    },

    {
      title:"Complainant",
      render:(_,r)=>
      <div>
        <div>{r.complainant_name}</div>
        <Text type="secondary">{r.complainant_email}</Text>
      </div>
    },

    {
      title:"Date",
      dataIndex:"created_at",
      render:d=>new Date(d).toLocaleDateString()
    },

    {
      title:"Status",
      dataIndex:"status",

      render:(status,r)=>(

        <Select
          value={status}
          size={mobile?"small":"middle"}
          style={{width:mobile?100:130}}
          onChange={v=>updateStatus(r.id,v)}
        >

          <Select.Option value="open">
            <Tag color="blue">OPEN</Tag>
          </Select.Option>

          <Select.Option value="in_progress">
            <Tag color="orange">IN PROGRESS</Tag>
          </Select.Option>

          <Select.Option value="resolved">
            <Tag color="green">RESOLVED</Tag>
          </Select.Option>

          <Select.Option value="closed">
            <Tag color="red">CLOSED</Tag>
          </Select.Option>

        </Select>
      )
    },

    {
      title:"Actions",
      align:"right",
      render:()=>(
        <Space>
          <Button size="small" type="text" icon={<EyeOutlined/>}/>
          <Button size="small" type="text" icon={<MoreOutlined/>}/>
        </Space>
      )
    }

  ];


  return (

    <Layout style={{minHeight:"100vh",background:"#f8f9ff"}}>

      <Content style={{padding:mobile?12:32}}>

        <Row justify="space-between" align="middle" wrap gutter={[16,16]}>

          <Col xs={24} md={16}>

            <Text type="secondary">COMPLAINT OVERVIEW</Text>

            <Title level={mobile?3:2} style={{marginBottom:0}}>
              Management Console
            </Title>

          </Col>


          <Col xs={24} md="auto">

            <Button block={mobile} icon={<FileExcelOutlined/>}>
              Export
            </Button>

          </Col>

        </Row>


        <Card style={{marginTop:24,marginBottom:24,borderRadius:16}}>

          <Row gutter={[12,12]}>


            <Col xs={24} md={8}>

              <Input placeholder="Search complaints" prefix={<SearchOutlined/>}/>

            </Col>


            <Col xs={24} md={6}>

              <Select placeholder="Status" style={{width:"100%"}}>

                <Select.Option value="open">Open</Select.Option>
                <Select.Option value="resolved">Resolved</Select.Option>

              </Select>

            </Col>


            <Col xs={24} md={6}>
              <DatePicker style={{width:"100%"}}/>
            </Col>


            <Col xs={24} md={4}>

              <Button block type="primary" icon={<FilterOutlined/>}>
                Apply
              </Button>

            </Col>

          </Row>

        </Card>


        <Card style={{borderRadius:16}}>

          <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={complaints}
            scroll={mobile?{x:700}:{x:900}}
            pagination={{pageSize:mobile?3:5}}
          />

        </Card>


        <Row gutter={[16,16]} style={{marginTop:24}}>

          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Average Resolution Time" value="4.2 Days" prefix={<ClockCircleOutlined/>}/>
            </Card>
          </Col>


          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Resolution Rate" value="94.8%" prefix={<CheckCircleOutlined/>}/>
            </Card>
          </Col>


          <Col xs={24} md={8}>
            <Card>
              <Statistic title="Active Admin Agents" value="18" prefix={<TeamOutlined/>}/>
            </Card>
          </Col>

        </Row>

      </Content>


      <Footer style={{background:"#fff",textAlign:"center",padding:16}}>
        © 2024 CivicResolve Complaint Portal
      </Footer>

    </Layout>

  );

}