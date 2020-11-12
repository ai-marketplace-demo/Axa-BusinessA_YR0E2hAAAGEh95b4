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
const RoutableTabs=(props)=>{
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
                                <div className="nav-link active text-primary text-capitalize"><b>{tab}</b></div>
                            </li>
                        </Then>
                        <Else>
                            <li className="nav-item">
                                <Link to ={tab} className="text-dark text-capitalize nav-link" >{tab}</Link>
                            </li>
                        </Else>
                    </If>

                })
            }
            </ul>
        </Col>
    </Row>
}


export default RoutableTabs;
