import React, {useState} from "react";
import {Row,Col,Tab,Container,Nav} from "react-bootstrap";
import styled from "styled-components";
import {Link,useRouteMatch} from "react-router-dom";

const TabStyled=styled.div`
a{
    font-size: 0.8em;
    margin-top: 0;
    outline: 0;
}
a{
  color :black;
}
a:hover, a:link, a:visited{
    text-decoration:none;
    color :black;
}

`


const TabLink=styled.div`
__position : fixed;
__width : 100%;
width : ${props=>(100/props.tabs.length)+"%"};
text-align: center;
padding-bottom: 15px;
border-bottom: ${props=>props.active?"3px lightblue solid":""};
font-weight: ${props=>props.active?"bolder":""};

&:hover{
  font-weight: bolder;
}
a{
    font-size: 1.1em;
    margin-top: 0;
    outline: 0;
}
a{
  color :black;
}
a:hover, a:link, a:visited{
    text-decoration:none;
    color :black;
}


`




const Tabs = (props)=>{
    let [current, setCurrent] = useState(0);
    let { path, url } = useRouteMatch();
    return <Container>
        <Row>
            <Col xs={11}>
                <Row>
            {
                props.tabs.map((tabName,tabIndex)=>{
                    return <TabLink key={`${tabName}-${tabIndex}`} tabs={props.tabs} active={(tabName==props.tabs[current])?true:false}>
                            <Link onClick={()=>{setCurrent(tabIndex)}} to={`${url}/${tabName.toLowerCase()}`}>
                                {tabName}
                            </Link>
                    </TabLink>
                })
            }
                </Row>
            </Col>
        </Row>
    </Container>

}


export default Tabs;

