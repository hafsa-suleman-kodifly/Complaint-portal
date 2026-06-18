import{useState}from"react";
import{Button,Card,Form,Input,Typography,message,Result}from"antd";
import api from"../services/api";

const{Title}=Typography;

export default function TrackComplaint(){

const[loading,setLoading]=useState(false),[complaint,setComplaint]=useState(null),[notFound,setNotFound]=useState(false);

const onFinish=async v=>{
setLoading(true);
setComplaint(null);
setNotFound(false);

try{
const r=await api.get("/complaints/track/",{params:{ref:v.reference_number,email:v.email}});
setComplaint(r.data);
message.success("Complaint found");
}catch(e){
if(e.response?.status===404){setNotFound(true);message.error("Complaint not found")}
else message.error("Something went wrong");
}
finally{setLoading(false)}
};


if(complaint)
return <Card style={{maxWidth:760,margin:"40px auto",borderRadius:16,boxShadow:"0 4px 20px #1b365d12"}}>
<Result
status="success"
title="Complaint Found"
subTitle={
<div style={{textAlign:"left"}}>
<p><b>Reference</b><br/>{complaint.reference_number}</p>
<p><b>Status</b><br/>{complaint.status}</p>
<p><b>Created</b><br/>{complaint.created_at?new Date(complaint.created_at).toLocaleString():"N/A"}</p>
<p><b>Updated</b><br/>{complaint.updated_at?new Date(complaint.updated_at).toLocaleString():"N/A"}</p>
{complaint.resolved_at&&<p><b>Resolved</b><br/>{new Date(complaint.resolved_at).toLocaleString()}</p>}
</div>
}
extra={<Button type="primary" onClick={()=>setComplaint(null)}>Track Another</Button>}
/>
</Card>;


if(notFound)
return <Card style={{maxWidth:760,margin:"40px auto",borderRadius:16}}>
<Result
status="error"
title="Complaint Not Found"
subTitle="Check your reference number and email"
extra={<Button type="primary" onClick={()=>setNotFound(false)}>Try Again</Button>}
/>
</Card>;


return <Card style={{maxWidth:760,margin:"40px auto",borderRadius:16,boxShadow:"0 4px 20px #1b365d12"}}>

<div style={{textAlign:"center",marginBottom:30}}>
<Title>Track Your Progress</Title>
<p>Enter your complaint details to view real-time updates.</p>
</div>

<Form layout="vertical" onFinish={onFinish}>

<Form.Item
label="Complaint Reference Number"
name="reference_number"
rules={[{required:true,message:"Enter reference number"}]}
>
<Input size="large" placeholder="CMP-2026-0001"/>
</Form.Item>

<Form.Item
label="Email Address"
name="email"
rules={[{required:true,type:"email",message:"Enter valid email"}]}
>
<Input size="large" placeholder="you@example.com"/>
</Form.Item>

<Button
type="primary"
htmlType="submit"
loading={loading}
block
size="large"
style={{borderRadius:10}}
>
Track Progress
</Button>

</Form>

</Card>;
}