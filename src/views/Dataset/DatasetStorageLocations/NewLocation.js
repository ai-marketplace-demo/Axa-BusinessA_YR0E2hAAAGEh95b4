import React,{useState} from "react";
import {Container,  Row, Col} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {Link, useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import addDatasetStorageLocation from "../../../api/Dataset/addDatasetStorageLocation";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);




const NewLocationForm= (props)=>{

    let client = useClient();
    let history = useHistory();

    let [formData, setFormData] = useState({
        prefix:'',
        label:'',
        description:'',
        tags:[]
    });

    const handleInputChange = (e)=>{
        setFormData({...formData, [e.target.name] : e.target.value})
    };
    const submitForm=async ()=>{
        console.log(">...",formData);
        const input = formData;
        const res = await client.mutate(
            addDatasetStorageLocation({datasetUri:props.dataset.datasetUri,input:input})
        );
        if (!res.errors){
            toast("Created new location",{hideProgressBar:true,onClose:()=>{history.goBack()}})
        }else{
            toast.error(`Could not create new location, received ${res.errors[0].message}`,{hideProgressBar:true})
        }

    };

    return <Container>
        <Row>
            <Col xs={2}>
                <Link style={{color:'black'}} to={"locations"}>
                    <h4><Icon.ChevronLeft/></h4>
                </Link>
            </Col>
            <Col xs={8}>
                <h5>Create New Storage Location</h5>
            </Col>
        </Row>
        <Row>
            <Col xs={4}>
                <b>Location path:</b>
            </Col>
            <Col xs={8}>
                <code>{`s3://${props.dataset.S3BucketName}/${formData.prefix}`}</code>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Prefix
            </Col>
            <Col xs={4}>
                <input name={`prefix`} value={formData.prefix} onChange={handleInputChange} style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Name
            </Col>
            <Col xs={4}>
                <input name={`label`} value={formData.label} onChange={handleInputChange} style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Description
            </Col>
            <Col xs={4}>
                <input name={`description`} value={formData.description} onChange={handleInputChange} style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>
                Tags
            </Col>
            <Col xs={4}>
                <input style={{width:'100%'}} />
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={2}>

            </Col>
            <Col xs={4}>
                <div onClick={submitForm} className={"btn btn-primary btn-sm"}>Add</div>
            </Col>
        </Row>
    </Container>
};


export default NewLocationForm;
