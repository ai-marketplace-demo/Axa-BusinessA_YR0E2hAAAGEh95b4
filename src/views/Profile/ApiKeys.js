import React, {useState, useEffect} from "react";
import {Container, Row, Col} from "react-bootstrap";
import {toast} from "react-toastify";
import {If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import useClient from "../../api/client";
import listApiKeys from "../../api/ApiKeys/listApiKeys";
import createApiKey from "../../api/ApiKeys/createApiKey";
import deleteApiKey from "../../api/ApiKeys/deleteApiKey";
import MainActionButton from "../../components/MainActionButton/MainButton";


const ApiKeyList = (props)=>{
    let client = useClient();
    let [keys, setKeys] = useState({count:0, nodes:[]});

    let [newKey, setNewKey] = useState({ApiKeyId:'',ApiKeySecret:'',expires:''})

    const createNewApiKey=async ()=>{
        const response= await client.mutate(createApiKey());
        if (!response.errors){
            setNewKey({...response.data.createApiKey});
            await fetchApiKeys();
        }else{
            toast(`Could not create new API key, received ${response.errors[0].message}`)

        }
    }

    let displayQuotaMessage=()=>{
        toast.info(`Quota Met. You already have 2 API Keys. `, {hideProgressBar:true});
    }

    let deleteExistingApiKey= async (ApiKeyId)=>{
        const response= await client.mutate(deleteApiKey(ApiKeyId));
        if (!response.errors){
            toast(`Deleted existing Api Key `);
            await fetchApiKeys();
        }else{
            toast(`Could not delete existing API key, received ${response.errors[0].message}`)
        }
    }
    let fetchApiKeys=async ()=>{
        const response = await client.query(listApiKeys());
        if (!response.errors){
            setKeys({...response.data.listApiKeys});
        }else{
            toast(`Could not retrieve API keys, received ${response.errors[0].message}`)
        }
    }

    useEffect(()=>{
        if (client){
            fetchApiKeys();
        }
    },[client])

    return <Container>
        <Row>
            <Col xs={8}>
                <h4>Api Keys</h4>
            </Col>
            <If condition={keys.count<2}>
                <Then>
                    <Col xs={4}>
                        <div onClick={createNewApiKey}>
                            <MainActionButton>Create</MainActionButton>
                        </div>
                    </Col>
                </Then>
                <Else>
                    <div onClick={displayQuotaMessage} className={`btn btn-secondary disabled`} > Create</div>
                </Else>
            </If>

        </Row>
        <Row className={`mt-3`}>
            <If condition={keys.count}>
                <Then>
                    <table className={`table table-sm`}>
                        <tr>
                            <th>
                                ApiKeyId
                            </th>

                            <th>
                                Expires
                            </th>
                            <th>
                            </th>
                        </tr>
                        <tbody>
                        {
                            keys.nodes.map((key)=>{
                                return <tr>
                                    <td>{key.ApiKeyId}</td>
                                    <td>{key.expires}</td>
                                    <td>
                                        <div onClick={()=>{deleteExistingApiKey(key.ApiKeyId)}} className={`btn bg-white btn-sm border`}>Delete</div>
                                    </td>
                                </tr>

                            })
                        }
                        </tbody>
                    </table>
                </Then>
                <Else>
                    <p> You dont have any API key yet</p>
                </Else>
            </If>
        </Row>
        <Row>
            <Col xs={12}>
                <If condition={newKey.ApiKeySecret}>
                    <Then>
                        <Col xs={12}>
                            <h5><Icon.InfoCircle color={`red`}/> Copy information below as it is not saved on our side.</h5>
                        </Col>
                        <Col xs={12}><b>ApiKeyId</b></Col>
                        <Col xs={12}><code>{newKey.ApiKeyId}</code></Col>
                        <Col xs={12}><b>ApiKeySecret</b></Col>
                        <Col xs={12}><code>{newKey.ApiKeySecret}</code></Col>
                        <Col xs={12}><b>Expires</b></Col>
                        <Col xs={12}>{newKey.expires}</Col>
                    </Then>
                </If>
            </Col>
        </Row>
    </Container>
}


export default ApiKeyList;
