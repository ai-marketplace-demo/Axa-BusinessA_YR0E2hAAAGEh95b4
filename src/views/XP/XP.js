import React, {useState}  from "react";
import {Container, Row, Col} from "react-bootstrap";
import {If, Then, Else,Switch,Case,Default} from "react-if";
import * as Icon from "react-bootstrap-icons";
import ReactMarkdown from 'react-markdown';
import styled from "styled-components";



const DescriptionTab =(props)=>{

    return <Row>
        <Col xs={12}>
            <ReactMarkdown children={props.markdown} />
        </Col>
    </Row>
}

const ColumnTab =(props)=>{
    return <Row>
        <table className={`table`}>
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Column</th>
                <th scope="col">Type</th>
                <th scope="col">Description</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <th scope="row">1</th>
                <td>ID</td>
                <td>String</td>
                <td>xxxxxxxxxxxxxxxxxxxxxxxxx</td>
            </tr>
            </tbody>
        </table>
    </Row>
}



const XP=(props)=>{

    const [current,setCurrent]= useState(0);
    const [tab, setTab] = useState(0);

    const tabs=["Description","Columns","Preview","Data Quality","Metrics"]
    const tables=[
        "demographics",
        "people",
        "products",
    ]
    const descriptions={
        demographics:'# demographics table',
        people:'# people table',
        products:'# productstable'
    }
    return <Container className={`mt-4`} fluid>
        <Row className={`mt-4`}>
            <Col xs={12}><h4>Dataset</h4></Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Row>
                    <Col xs={12}>
                        <h4>Tables</h4>
                    </Col>
                </Row>
                {
                    tables.map((t,i)=>{
                        return <Row onClick={()=>{setCurrent(i)}}>
                            <Col xs={1}><Icon.Table/></Col>
                            <Col xs={8}><small>{t}</small></Col>
                        </Row>
                    })
                }

            </Col>
            <Col xs={10}>
                <Row>
                    <Col xs={12}>
                        <h4>{tables[current]}</h4>
                    </Col>
                </Row>
                <div className={`border-bottom`} style={{display:"flex"}}>
                    {
                        tabs.map((t,i)=>{
                            return <div style={{marginRight:"5ch"}}>
                                <If condition={tab==i}>
                                    <Then>
                                        <div className={`border-bottom border-primary text-primary`}> {t}</div>
                                    </Then>
                                    <Else>
                                        <div onClick={()=>{setTab(i)}}  className={`text-dark`}> {t}</div>
                                    </Else>
                                </If>
                            </div>
                        })
                    }

                </div>
                <Row className={`mt-4`}>
                    <Switch>
                        <Case condition={tab==0}>
                            <Col xs={12}>
                                <DescriptionTab markdown={descriptions[tables[current]]}/>
                            </Col>
                        </Case>
                        <Case condition={tab==1}>
                            <Col xs={12}>
                                <ColumnTab markdown={descriptions[tables[current]]}/>
                            </Col>
                        </Case>
                    </Switch>
                </Row>
            </Col>
        </Row>
    </Container>
}

export default XP;
