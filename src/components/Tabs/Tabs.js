import React ,{useState} from "react"
import {Row, Col} from "react-bootstrap";
import {If,Then, Else} from "react-if";
import {useParams} from "react-router-dom";
import {Link} from "react-router-dom";
import styled from "styled-components";


const Theme=styled.div`
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}
`
const _RoutableTabs=(props)=>{
    const params=useParams();
    const current = params.tab;
    return <Row>

        <Col xs={12}>
            <ul className="nav nav-tabs">
            {
                props.tabs.map((tab)=>{

                    return <If condition={tab==current}>
                        <Then>
                            <li className="nav-item">
                                <div className="nav-link active text-info  text-capitalize"><b>{tab}</b></div>
                            </li>
                        </Then>
                        <Else>
                            <li className="nav-item">
                                <Link to ={tab} className="text-secondary text-capitalize nav-link" >{tab}</Link>
                            </li>
                        </Else>
                    </If>

                })
            }
            </ul>
        </Col>
    </Row>
}

const RoutableTabs=(props)=>{
    const params=useParams();
    const current = params.tab;
    return <Row>
        <Col xs={12}>
            <div style={{borderBottom:'1px solid lightgrey', marginBottom:'1em',marginTop:'1em'}}>
                {
                    props.tabs.map((tab)=>{
                        return <If condition={tab==current}>
                            <Then>
                                <div
                                    className={` text-capitalize`}
                                    style={{
                                        borderLeft:'1px solid lightgrey',
                                       //borderBottom:'none!',
                                        //height:'2rem',
                                        borderTop:'1px solid lightgrey',
                                        borderRadius:'5px 5px 0px 0px',
                                        paddingTop:'0.5rem',
                                        borderBottom:'2px solid white',
                                        borderRight:'1px solid lightgrey',
                                        width:'110',
                                        textAlign:'center',
                                        fontWeight:'bold',
                                        fontSize:'1rem',
                                        color :'black',
                                        display:'inline-block'
                                    }}>
                                        {tab}
                                    </div>
                            </Then>
                            <Else>
                                <Link to ={tab}>
                                <div
                                    className={`text-capitalize`}
                                    style={{
                                        borderBottom:'1px solid lightgrey',
                                        textAlign:'center',
                                        color:'grey',
                                        fontSize:'1rem',
                                        width:'100',
                                        display:'inline-block'}}>
                                    {tab}
                                </div>
                                </Link>
                            </Else>
                        </If>

                    })
                }
            </div>
        </Col>
    </Row>
}


export default RoutableTabs;
