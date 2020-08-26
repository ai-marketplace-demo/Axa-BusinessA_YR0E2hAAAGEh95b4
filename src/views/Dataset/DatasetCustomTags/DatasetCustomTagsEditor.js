import React, {useState,useEffect} from "react";
import styled from "styled-components";
import {Row, Col, Container} from "react-bootstrap";
import {If,Then,Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import useClient from "../../../api/client";
import updataDataset from "../../../api/Dataset/updateDataset";
import {toast} from "react-toastify";

const Styled=styled.div`
height:100vh;
`

const DatasetCustomTagEditor = (props)=>{
    const client = useClient();
    const [customTags, setCustomTags]=useState(props.dataset.customTags);

    const [canEdit, setCanEdit] = useState(['BusinessOwner','Admin','DataSteward','Creator'].indexOf(props.dataset.userRoleForDataset)!=-1);

    const removeTag=(Id)=>{
        setCustomTags(customTags.filter((kv)=>{return kv.Id!=Id}))
    }

    const addTag =()=>{
        setCustomTags(customTags.concat({Id:customTags.length+1,Key:'New Attr', Value:'New Value'}));
    }

    const actionFormatter=(cell, row)=>{
        return <If condition={canEdit}>
            <Then>
                <Icon.XSquare onClick={()=>{removeTag(row.Id)}} className={`pt-2`} size={22}/>
            </Then>
        </If>
    }
    const columns=[
        {
            dataField: 'Key',
            text: 'Key'
        },

        {
            dataField: 'Value',
            text: 'Value'

        }

    ]

    if (canEdit){
        columns.push({
            dataField:'Id',
            formatter:actionFormatter,
            editable:false,
            text:'Drop'
        })
    }
    const handleEdit=(oldValue, newValue, row, column)=>{
        setCustomTags(customTags.map((kv)=>{
            if (kv.Id!=row.Id){
                return kv
            }else{
                return {...row, [column]:newValue, Id:kv.Id};
            }
        }))
    }


    const saveTags=async ()=>{
        const response = client.mutate(updataDataset({
            datasetUri : props.dataset.datasetUri,
            input:{
                customTags:JSON.stringify(customTags)
            }
        }));
        if (!response.errors){
            toast(`Saved tags`)
        }else {
            toast(`Could not save custom tags, received ${response.errors[0].message}`)
        }
    }

    useEffect(()=>{},[client])

    return <Styled>
        <Container>
            <Row>
                <Col xs={12}>
                    <h4> <Icon.Tag size={32}/> Custom Tags for <b className={`text-primary`}>{props.dataset.label}</b> </h4>
                </Col>

            </Row>
            <Row>
                <If condition={canEdit}>
                    <Then>

                    </Then>
                    <Else>

                    </Else>
                </If>
                <Col xs={12}>
                    <BootstrapTable
                        bordered={false}
                        condensed
                        keyField="Id"
                        data={ customTags }
                        columns={ columns }
                        afterSaveCell={handleEdit}
                        cellEdit={ cellEditFactory({ mode: 'click' }) }
                    />
                </Col>
            </Row>
            <If condition={canEdit}>
                <Then>
                    <Row>
                        <Col xs={8}>
                            <div className={`btn-group`}>
                                <div onClick={addTag} style={{wIdth:'10ch'}} className={`btn btn-sm btn-primary`}>Add Tag</div>
                                <div onClick={saveTags} style={{wIdth:'10ch'}}  className={`ml-1 btn btn-sm btn-success`}>Save</div>

                            </div>
                        </Col>
                    </Row>
                </Then>
            </If>

        </Container>
    </Styled>
}


export default DatasetCustomTagEditor;
