import React ,{useState} from "react";
import {Row,Col,Container, Button,Spinner} from "react-bootstrap";
import * as Icon  from "react-bootstrap-icons";
import styled from "styled-components";
import Select from 'react-select'

const Background=styled.div`
__height: 25vh;
margin-top: 6px;
border-radius: 0px;
background-color: white;
border : 1px solid lightgrey;
box-shadow: 0px 1px 2px 2px whitesmoke;
padding: 16px;
`



const DatasetContributor= (props)=>{
    const options = [
        { value: 'admin', label: 'Admin' },
        { value: 'contributor', label: 'Contributor' },
        { value: 'viewew', label: 'Viewer' }
    ]
    return <Row className={"mt-2"}>
        <Col className="" xs={1}>
                <Icon.Person size={22}/>
        </Col>
        <Col xs={4}>
            <b>{props.username}</b>
        </Col>
        <Col xs={3}>
            <Select defaultValue={options[0]} options={options} />
        </Col>
        <Col xs={2}>
            <Button size={"sm"} variant={'primary'}>Save</Button>
        </Col>
        <Col xs={2}>
            <Button size={"sm"} variant={'warning'}>Remove</Button>
        </Col>
    </Row>
}
const DatasetContributorList =(props)=>{

    let [contributors, setContributors] = useState([]);
    setTimeout(()=>{
        setContributors([
            {username:"elmallem@", role:"admin"},
            {username:"decleckk@", role:"admin"}
        ])
    },600)

    return <Background><Container className={"ml-1 p-0"}>
        {(!contributors.length)?(
            <Spinner variant={"primary"} animation={"border"}/>
        ):(
            <Row>
                <Col xs={11}>
                    {
                        contributors.map((contributor)=>{
                            return <DatasetContributor {...contributor}/>
                        })}
                </Col>
            </Row>

        )}

    </Container>
    </Background>
}


export default DatasetContributorList;
