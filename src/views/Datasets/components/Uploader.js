import {useState,useEffect} from "react";
import * as ReactIf from "react-if";
import {Form,Loader,Message,Progress,Label,Button,Input} from "semantic-ui-react";
import { InputFile } from 'semantic-ui-react-input-file'
import getDatasetPresignedUrl from "../../../api/Dataset/getDatasetPresignedUrl";
import startGlueCrawler from "../../../api/Dataset/startGlueCrawler";
import axios, { post } from 'axios';

const Uploader = ({dataset,client})=>{
    const [ready, setReady] = useState(false);
    const [messages, setMessages] = useState([

    ]);
    const [prefix, setPrefix] = useState("RAW/");
    const [file, setFile]= useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);


    useEffect(()=>{
        if (client){
            setReady(true);
        }
    },[client])
    if (!dataset){
        return <div>Loading</div>
    }

    const runCrawler=async ()=>{
        setMessages([...messages, {label:'Starting Crawler',positive:true}]);
        const response= await client.mutate(startGlueCrawler({
            datasetUri:dataset.datasetUri,
            input:{prefix:prefix}}
        ));
        if (!response.errors){
            setMessages([...messages, {label:'Started Crawler',positive:true}]);

        }else {
            setMessages([...messages, {label:'Could not start Crawler',negative:true}]);
        }
    }

    const fileUpload =async ()=>{
        setMessages([...messages, {label:'Starting upload',positive:true}]);
        const response = await client.query(getDatasetPresignedUrl({
            datasetUri:dataset.datasetUri,
            input:{
                fileName:file.name,
                prefix:prefix
            }
        }))
        if (!response.errors){
            const presignedUrlResponse= JSON.parse(response.data.getDatasetPresignedUrl);
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
            setMessages([...messages, {label:'Completed Upload',positive:true}]);

            const startCrawlerResponse = await runCrawler();

        } else {
            setMessages([...messages, {label:'Could not start upload',negative:true}]);
        }

    }
    const onChange=(e)=> {
        setFile(e.target.files[0]);
    }
    const onFormSubmit= (e)=>{
        e.preventDefault() // Stop form submit
        fileUpload(file);
    }
    const clearMessage=(i)=>{
        setMessages(messages.filter((msg,index)=>{return index!==i}));
    }
    let hiddenInput = null;
    return <div style={{width:'95%'}}>
        <ReactIf.If condition={isUploading}>
            <ReactIf.Then>
                <Progress
                    success
                    progress
                    size={`small`}
                    percent={progress}
                />
            </ReactIf.Then>
        </ReactIf.If>
        <Form size={`small`}>
            {
                messages.map((message,msgindex)=>{
                    return <Message {...message}>
                        <p>{message.label}</p>
                        <Button size={`mini`} onClick={()=>{clearMessage(msgindex)}}>Close</Button>
                    </Message>
                })
            }
            <Form.Field>
                <Input label={`s3://${dataset.S3BucketName}/`}
                       value={prefix}
                       onChange={(e)=>{setPrefix(e.target.value)}}
                />
            </Form.Field>
            <ReactIf.If condition={!file}>
                <ReactIf.Then>
                    <Form.Field>
                    <Input value={``} action>
                        <input disabled={true}/>
                        <input
                            ref={el => {
                                hiddenInput = el;
                            }}
                            type='file'
                            hidden
                            onChange={onChange}
                            id={`file`}/>
                        <Button
                            onClick={() => hiddenInput.click()}
                        >
                        Select</Button>
                    </Input>
                    </Form.Field>
                </ReactIf.Then>
                <ReactIf.Else>
                    <Form.Field>
                    <Input action>
                        <input value={file&&file.name}/>
                        <Button
                            positive
                            onClick={onFormSubmit}
                        >
                            Upload
                        </Button>
                        <Button

                            onClick={()=>{setFile(null)}}>
                            Cancel
                        </Button>
                    </Input>
                    </Form.Field>
                </ReactIf.Else>


            </ReactIf.If>
        </Form>

</div>
}


export default Uploader
