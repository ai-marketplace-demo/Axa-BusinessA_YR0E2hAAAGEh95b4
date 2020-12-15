import React, {useState, useEffect} from "react";
import {Container,Row,Col, Badge, Spinner} from "react-bootstrap";
import {If, Then, Else,Case, Switch, Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import useClient from "../../../api/client";
import getDatasetPresignedUrl from "../../../api/Dataset/getDatasetPresignedUrl";
import startGlueCrawler from "../../../api/Dataset/startGlueCrawler";
import getCrawlerStatus from "../../../api/Dataset/getCrawlerStatus";
import ReactTooltip from 'react-tooltip';
import {toast} from "react-toastify";
import axios, { post } from 'axios';

const DatasetUpload = (props)=>{
    const client = useClient();
    const [ready, setReady] = useState(false);
    const [prefix, setPrefix] = useState("RAW/");
    const [file, setFile]= useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileUpload =async ()=>{
        const response = await client.query(getDatasetPresignedUrl({
            datasetUri:props.dataset.datasetUri,
            input:{
                fileName:file.name,
                prefix:prefix
            }
        }))
        if (!response.errors){
            const presignedUrlResponse= JSON.parse(response.data.getDatasetPresignedUrl);

            console.log("presignedUrlResponse");
            console.log(presignedUrlResponse);
            const url = presignedUrlResponse.url;
            const fields=presignedUrlResponse.fields;
            const formData = new FormData();
            Object.keys(fields).forEach((formFieldName)=>{
                console.log("adding field", formFieldName, "to form data", fields[formFieldName]);
              formData.append(formFieldName, fields[formFieldName]);
            })
            formData.append('file',file);

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    //'Access-Control-Allow-Origin': '*',
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"

                },
                withCredentials: false,
                onUploadProgress:(e)=>{
                    console.log("axios-> ",e.loaded,e.total,Math.round( (e.loaded * 100) / e.total ));
                    setProgress(Math.round( (e.loaded * 100) / e.total ));
                }
            }
            setIsUploading(true);
            await axios.post(url, formData,config);
            setTimeout(()=>{
                setIsUploading(false)
                setFile(null);
            },1000);

            const startCrawlerResponse = await runCrawler();

        } else {
            toast(`Could not upload file, received ${response.errors[0].message}`);
        }

    }

    const runCrawler=async ()=>{
        const response= await client.mutate(startGlueCrawler({
            datasetUri:props.dataset.datasetUri,
            input:{prefix:prefix}}
        ));
        if (!response.errors){
            toast(`Started Crawler`)
        }else {
            toast(`Could not start crawler, received  ${response.errors[0].message}`)
        }
    }


    const onFormSubmit= (e)=>{
        e.preventDefault() // Stop form submit
        fileUpload(file);
    }

    const onChange=(e)=> {
        toast("Set file");

        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    useEffect(()=>{
        if (client){
            setReady(true);
        }
    },[client])
    if (!ready){
        return <Container>
            <Row>
                <Col xs={12}>
                    <Spinner variant={`primary`} animation={`border`} size={`sm`}/>
                </Col>
            </Row>
        </Container>


    }

    return <Container fluid>
        <Row className={`mt-2`}>
            <Col xs={8}>
                <Icon.Bucket className={`pb-2`} size={24}/> {`s3://${props.dataset.S3BucketName}/${prefix}`}

            </Col>

        </Row>

        <Row>
            <Col xs={12}>
                <If condition={isUploading}>
                    <Then>
                        <div className="progress">
                            <div className="progress-bar bg-success"
                            style={{width:`${progress}%`}}>
                                {progress}%
                            </div>
                        </div>
                    </Then>
                </If>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col className={`pt-1 pb-1`} xs={12}>
                <b>Target Path</b>
                <Icon.InfoCircle size={22} className={`pl-2`} data-tip="S3 Prefix (must end with /)"/>
                <ReactTooltip place="right" type="info" effect="solid"/>
            </Col>
            <Col xs={12}>
                <input className="form-control" value={prefix} onChange={(e)=>{setPrefix(e.target.value)}}/>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={12}>
                <b>Select File</b>
                <Icon.InfoCircle size={22} className={`pl-2`} data-tip="Supported formats csv, parquet, gzip"/>
                <ReactTooltip place="right" type="info" effect="solid"/>
            </Col>
            <Col xs={12}>
                <div class="input-group">
                <div class="custom-file">
                    <input
                         onChange={onChange}
                           type="file" className="custom-file-input rounded-pill"/>
                        <label className="custom-file-label" for="inputGroupFile01">
                            <If condition={file}>
                                <Then>
                                    {file&&file.name}
                                </Then>
                                <Else>
                                    Choose file
                                </Else>
                            </If>
                        </label>
                </div>
            </div>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={2}>
                <div onClick={onFormSubmit} className={`btn btn-sm btn-success rounded-pill`}>
                    Upload
                </div>
            </Col>
        </Row>

    </Container>
}


export default DatasetUpload;
