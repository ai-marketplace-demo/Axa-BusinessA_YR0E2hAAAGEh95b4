import React,{useEffect,useState} from "react";
import {Row, Col, Spinner, Container} from "react-bootstrap";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import * as Icon from "react-bootstrap-icons";
import {useParams, useHistory} from "react-router";
import {If , Then, Case, Else} from "react-if";
import getAuthorSession from "../../api/Dashboard/getDashboardAuthorSession";
import getReaderSession  from "../../api/Dashboard/getDashboardReaderSession";
import useClient from "../../api/client";
import {toast} from "react-toastify";
const QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");


const Embedded=(props)=>{
    const dashboardRef = React.createRef();
    const embed = () => {
        const options = {
            url: props.sessionUrl,
            container: dashboardRef.current,
            scrolling: "no",
            height: "700px",
            width: "1000px",
            locale: "en-US",
            footerPaddingEnabled: true
        };
        QuickSightEmbedding.embedDashboard(options);
    };
    useEffect(()=>{
        embed();
    })
    if (!props.sessionUrl){
        return <div/>
    }
    return <div ref={dashboardRef}/>
}


const QuicksightDesigner =(props)=>{
    const[sessionUrl, setSessionUrl] = useState();
    const client = useClient();
    const params = useParams();
    const handle = useFullScreenHandle();

    const [fs,setFs] = useState(false)

    const fetchUrl= async ()=>{
        //toast.info(`Retrieving session url for dashboard ${params.uri}`);
        const response = await client.query(getReaderSession(params.uri));
        if (!response.errors){
            //toast.info(response.data.getReaderSession);
            setSessionUrl(response.data.getReaderSession);
        }else {
            toast.error(`Failed to retrieve session url, received ${response.errors[0].message}`);
        }

    }
    React.useEffect(() => {
        if (client){
            fetchUrl();
        }
    },[client]);

    if (!sessionUrl){
        return <Spinner className={`mt-4`} variant={`primary`} animation={`border`}> </Spinner>
    }

    return <FullScreen style={{backgroundColor:'white'}} handle={handle}>
        <Container className={`bg-white`}>
            <Row className={`mt-4`}>
                <Col xs={10}></Col>
                <Col xs={2}>
                    <If condition={!fs}>
                        <Then>
                            <Icon.Fullscreen onClick={()=>{
                                setFs(true);
                                handle.enter()
                            }}/>
                        </Then>
                        <Else>
                            <Icon.FullscreenExit onClick={()=>{
                                setFs(false);
                                handle.exit()
                            }}/>

                        </Else>
                    </If>
                </Col>
            </Row>
        <Row className={`mt-4`}>
            <Col className={`bg-white`} xs={12}>
                <Embedded sessionUrl={sessionUrl}/>
                {/**<a target={`_blank`} href={sessionUrl}>Quicksight Session</a>**/}
            </Col>
        </Row>
    </Container>
    </FullScreen>
}

export default QuicksightDesigner;
