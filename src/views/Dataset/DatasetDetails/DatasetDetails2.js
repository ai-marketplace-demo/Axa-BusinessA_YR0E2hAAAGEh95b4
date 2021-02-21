import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import updateDatasetStack from "../../../api/Dataset/updateDatasetStack";
import generateDatasetAccessToken from "../../../api/Dataset/generateDatasetAccessToken";
import getDatasetAdminConsoleUrl from "../../../api/Dataset/getDatasetAdminConsoleUrl";
import getDatasetETLCredentials from "../../../api/Dataset/getDatasetETLCredentials";
import FormSection from "../../../components/FormSection/FormSection";
import DatasetAccount from "./Account";
import DatasetAwsResources from "./Resources";
import DatasetConnect from "./Connect";


const DatasetDetails= (props)=>{

    let client = useClient();
    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    }

    let [credentials,setCredentials]=useState()
    let [consoleUrl,setConsoleUrl]=useState()
    let [etlCredentials, setEtlCredentials] = useState();
    let [isLoadingSessionCredentials, setIsLoadingSessionCredentials] = useState(false);
    let [isLoadingConsoleUrl,setIsLoadingConsoleUrl] = useState(false);
    let [isLoadingETLCredentials, setIsLoadingETLCredentials] = useState(false)

    const generateSessionCredentials=async ()=>{
        setIsLoadingSessionCredentials(true);
        const response = await client.mutate(generateDatasetAccessToken(props.dataset.datasetUri));

        if (!response.errors){
            setCredentials(response.data.generateDatasetAccessToken)
        }else{
            toast(`Could not retrieve Access Token, received ${response.errors[0].message}`)
        }
        setIsLoadingSessionCredentials(false);
    }

    const  generateETLCredentials = async()=>{
        setIsLoadingETLCredentials(true);
        const response = await client.query(getDatasetETLCredentials(props.dataset.datasetUri));

        if (!response.errors){
            toast(`${response.data.getDatasetETLCredentials}`)
            setEtlCredentials(response.data.getDatasetETLCredentials);
        }else{
            toast(`Could not retrieve ETL credentials, received ${response.errors[0].message}`)
        }
        setIsLoadingETLCredentials(false);
    }

    const generateRedirectUrl =async ()=>{
        setIsLoadingConsoleUrl(true);
        const response = await client.query(getDatasetAdminConsoleUrl(props.dataset.datasetUri));

        if (!response.errors){
            setConsoleUrl(response.data.getDatasetAssumeRoleUrl)
        }else{
            toast(`Could not retrieve URL , received ${response.errors[0].message}`)
        }
        setIsLoadingConsoleUrl(false);

    };
    const updateStack=async ()=> {
        const response = await client.mutate(updateDatasetStack(props.dataset.datasetUri));

        if (!response.errors) {
            toast(`Dataset CloudFormation stack update started`)
        } else {
            toast(`Failed to start CloudFormation stack update, received ${response.errors[0].message}`)
        }
    };

    useEffect(()=>{},[client])

    const account=<DatasetAccount {...props} copy={copy}/>
    const resources=<DatasetAwsResources {...props} copy={copy} updateStack={updateStack}/>
    const connect=<DatasetConnect
        {...props}
        isLoadingConsoleUrl={isLoadingConsoleUrl}
        isLoadingSessionCredentials={isLoadingSessionCredentials}
        isLoadingETLCredentials={isLoadingETLCredentials}
        setIsLoadingConsoleUrl={setIsLoadingConsoleUrl}
        setIsLoadingETLCredentials={setIsLoadingETLCredentials}
        setIsLoadingSessionCredentials={setIsLoadingSessionCredentials}
        generateRedirectUrl={generateRedirectUrl}
        generateETLCredentials={generateETLCredentials}
        generateSessionCredentials={generateSessionCredentials}
        credentials={credentials}
        etlCredentials={etlCredentials}
        consoleUrl={consoleUrl}
        copy={copy}/>


    return <Container fluid className={`mt-4`}>
        <FormSection section={`Account`} content={account}/>
        <FormSection section={`AWS Resources`} content={resources}/>
        <FormSection section={`Connections & Integrations`} content={connect}/>
    </Container>
}


export default DatasetDetails;
