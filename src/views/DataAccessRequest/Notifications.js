import React, {useState,useEffect} from "react";
import {Row,Col, Container} from "react-bootstrap"
import * as Icon from "react-bootstrap-icons";
import Zoom from "../../components/Zoomer/Zoom"
import {Link,Switch, Route} from "react-router-dom";
import styled from "styled-components";
import useClient from "../../api/client";
import Inbox from "./Inbox"
import Outbox from "./Outbox"


const BG = styled.div`
a{
outline: 0;
text-decoration: none;
}
`

const FullScreen=styled.div`
#position : fixed;
#top : 1%;
z-index: 10;
#width: 76%;
margin-left: 0%;
__border : 1px solid black;
#background-color: white;
height: 100vh;
a:link, a:visited{
    text-decoration:none;
}
a{
 outline: 0;
}`




const Notifications= (props)=>{

    let client = useClient();


    return <FullScreen>
            <Container>
            <Row className={`m-3 p-3 border-top border-bottom`}>
                <Col className={`border-right `}xs={3}>
                    <h3> <Icon.Bell/> Notifications </h3>
                </Col>

            </Row>
            <Row className={`mt-3 mb-3 pt-1 pb-1`}>
                <Col xs={2}>
                    <Row>
                        <Col xs={12}>
                            <Zoom>
                            <Link to= {"/notifications/inbox"}
                                  style={{color:"black"}}>
                              Inbox
                            </Link>
                            </Zoom>
                        </Col>
                    </Row>
                    <Row className={``}>
                        <Col xs={12}>
                            <Zoom>
                            <Link to={"/notifications/outbox"}
                                  style={{color:"black"}}>
                                Outbox
                            </Link>
                            </Zoom>
                        </Col>
                    </Row>
                </Col>
                <Col xs={10}>
                    <Switch>
                        <Route path={`/notifications/outbox`}>
                           <Outbox/>
                        </Route>
                        <Route path={`/notifications/inbox`}>
                            <Inbox/>
                        </Route>
                        <Route path={`/notifications`}>
                            <Inbox/>
                        </Route>
                    </Switch>
                </Col>
            </Row>
            </Container>
        </FullScreen>


}


export default Notifications;
