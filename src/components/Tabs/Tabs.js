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
                                        //zIndex:1,
                                        //borderBottom:'none!',
                                        //height:'2rem',
                                        fontFamily:'Calibri',
                                        borderTop:'1px solid lightgrey',
                                        borderLeft:'1px solid lightgrey',
                                        borderRight:'1px solid lightgrey',
                                        borderRadius:'5px 5px 0px 0px',
                                        paddingTop:'0.5rem',
                                        marginTop:'2px',
                                        backgroundColor:'white',
                                        borderBottom:'5px solid white',
                                        marginBottom:'-4px',
                                        width:'110',
                                        textAlign:'center',
                                        boxShadow:'2px -2px 1px  rgb(0,0,0,0.05)',
                                        fontWeight:'bold',
                                        fontSize:'1rem',
                                        color :'#0394fc',
                                        display:'inline-block'
                                    }}>
                                    <b>{tab}</b>
                                </div>
                            </Then>
                            <Else>
                                <Link to ={tab}>
                                    <div
                                        className={`text-capitalize`}
                                        style={{
                                            //borderBottom:'1px solid lightgrey',
                                            fontFamily:'Calibri',
                                            textAlign:'center',
                                            paddingTop:'0.5rem',
                                            color:'rgb(0,0,0,0.8)',
                                            borderTop:'1px solid lightgrey',
                                            borderLeft:'1px solid lightgrey',
                                            borderRight:'1px solid lightgrey',
                                            borderRadius:'6px 6px 0px 0px',
                                            //background:' linear-gradient(to bottom, rgb(0,0,0,0.02) 30%,white)',
                                            //background:' linear-gradient(to bottom, rgb(0,0,0,0.02) 30%,rgb(0,0,0,0.01))',
                                            fontSize:'0.8rem',
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
