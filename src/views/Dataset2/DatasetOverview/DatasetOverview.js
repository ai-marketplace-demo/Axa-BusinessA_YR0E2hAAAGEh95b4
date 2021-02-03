import React  ,{useState} from "react";
import {If,Then,Else} from "react-if";
import {Container,Row,Col} from "react-bootstrap";
import FormSection  from "../../../components/FormSection/FormSection";
import useClient from "../../../api/client";
import {useParams} from "react-router-dom";
import styled from "styled-components";
import UserProfileLink from "../../Profile/UserProfileLink";
import General from "./General";
import Ownership from "./Ownership";
import Metadata from "./Metadata";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import {Classifications} from "../../../constants/Classifications";
import {Languages} from "../../../constants/Languages";
import {Topics} from "../../../constants/Topics";
import updateDataset from "../../../api/Dataset/updateDataset";
import {toast} from "react-toastify";

dayjs.extend(relativeTime);

const DatasetOverview=(props)=>{

    let client = useClient();
    let params= useParams();
    let [hasChanged, setHasChanged] = useState(false);
    let [details, setDetails]=useState({
        label : props.dataset.label,
        businessOwnerEmail: props.dataset.businessOwnerEmail,
        businessOwnerDelegationEmails: props.dataset.businessOwnerDelegationEmails?props.dataset.businessOwnerDelegationEmails.map((e)=>{
            return {label :e , value:e}
        }):[],
        topics:props.dataset.topics?props.dataset.topics.map((t)=>{ return {label:t, value:t}}):[],
        description : props.dataset.description,
        language:{label:props.dataset.language, value:props.dataset.language},
        confidentiality:{label:props.dataset.confidentiality, value:props.dataset.confidentiality},
        tags: props.dataset.tags
    })
    let canEdit = ['Creator','Admin','BusinessOwner','DataSteward'].indexOf(props.dataset.userRoleForDataset)!=-1;

    const handleEdit=(field)=>{
        console.log("handleEdit handleEdit handleEdit : ", field)
        return (value)=>{
            setDetails({...details,[field]:value});
            setHasChanged(true);
        }
    }


    const selectLanguage=(selectOption)=>{
        setDetails({...details, language: selectOption})
        setHasChanged(true);
    }

    const selectClass=(selectOption)=>{
        setDetails({...details, confidentiality: selectOption})
        setHasChanged(true);
    }

    const selectTopic=(selectoOption)=>{
        setDetails({...details, topics:selectoOption});
        setHasChanged(true);
    }
    const setTags=(tags)=>{
        setDetails({...details, tags:tags});
        setHasChanged(true);
    }
    const selectStewardEmails=(selectOption)=>{
        console.log("===>",selectOption);
        setDetails({...details, businessOwnerDelegationEmails:selectOption});
        setHasChanged(true);
    }



    const saveDetails=async ()=>{
        const response = await client.mutate(
            updateDataset({
                datasetUri:props.dataset.datasetUri,
                input:{
                    label :details.label,
                    tags: details.tags,
                    description: details.description,
                    language : details.language.value,
                    businessOwnerDelegationEmails: details.businessOwnerDelegationEmails ? details.businessOwnerDelegationEmails.map((s)=>{return s.value}): [],
                    businessOwnerEmail: details.businessOwnerEmail,
                    confidentiality:details.confidentiality.value,
                    topics: details.topics?details.topics.map((t)=>{return t.value}):[]
                }
            })
        );
        if (!response.errors){
            toast(`Saved dataset changes`)
        }else {
            toast(`Could not save dataset changes, received ${response.errors[0].message}`);
        }
    }

    const ownership=<Ownership
                            {...props}
                             businessOwnerDelegationEmails={details.businessOwnerDelegationEmails}
                              selectStewardEmails={selectStewardEmails}
                              canEdit={canEdit}
                              handleEdit={handleEdit}/>
    const general = <General {...props}
                             setHasChanged={setHasChanged}
                             canEdit={canEdit}
                             handleEdit={handleEdit}/>
    const metadata=<Metadata
        {...props}
        {...details}
        canEdit={canEdit}
        details={details}
        handleEdit={handleEdit}
        Languages={Languages}
        Classifications={Classifications}
        Topics={Topics}
        selectLanguage={selectLanguage}
        selectClass={selectClass}
        selectTopic={selectTopic}
        setTags={setTags}
    />

    return <Container fluid>
        <Row>
            <Col xs={10}/>
            <Col xs={2}>
                <If condition={hasChanged}>
                    <Then>
                        <div onClick={saveDetails} className={`mt-1 mb-2 btn btn-primary btn-sm rounded-pill`}>
                            Save
                        </div>
                    </Then>
                </If>

            </Col>
        </Row>
        <FormSection open={true} section={`general`} content={general}/>
        <FormSection section={`ownership`} content={ownership}/>
        <FormSection section={`metadata`} content={metadata}/>
    </Container>
}


export default DatasetOverview
