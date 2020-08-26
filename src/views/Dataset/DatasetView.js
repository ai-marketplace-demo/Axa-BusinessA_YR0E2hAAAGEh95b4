import React ,{useState} from "react";
import styled from "styled-components";
import {Row,Container, Col,ListGroup,ListGroupItem} from "react-bootstrap"
import * as Icon from "react-bootstrap-icons";
import Tabs from "../../components/Tabs/Tabs";
import QueryBrowser from "./QueryBrowser/QueryBrowser";
import DatasetOverview from "./DatasetOverview/DatasetOverview";
import DatasetDetails from "./DatasetDetails/DatasetDetails";
import DatasetContributorsList from "./DatasetContributors/DatasetContributors";
import DatasetTables from "./Tables/DatasetTables";
import DatasetQueries from "./Queries/DatasetQueries";
import {
    BrowserRouter as Router,
    Route,
    Link ,
    Switch,
    useParams,
    useRouteMatch
} from "react-router-dom";



const TabLink=styled.div`
__position : fixed;

width : 100%;
text-align: center;
border-bottom: ${props=>props.active?"3px lightblue solid":""};
&:hover{
  font-weight: bolder;
}

`


const FullScreen=styled.div`
position : fixed;
top : 1%;
z-index: 10;
width: 100%;
margin-left: 0%;
__border : 1px solid black;
background-color: white;
height: 200vh;
`


const DatasetView=(props)=>{
    let [view, selectView] = useState("overview");
    let selectTab=(name)=>{
        selectView(name);
    }
    const params = useParams()
    const datasetUri = params.uri;
    return <FullScreen>
        <Container className={"m-0 p-0"}>
        <Row className={"border-bottom"}>
            <Col xs={4}>
                <Row>
                    <Col className="pt-3" xs={2}>
                        <Icon.Folder size={32}/>
                    </Col>
                    <Col xs={10}>
                        <Row>
                            <h4>My Dataset</h4>
                        </Row>
                        <Row>
                            <p>by <a href={"#"}>@moshirm</a></p>
                        </Row>

                    </Col>
                </Row>
            </Col>
        </Row>
        <Row className={"pt-3"}>
            <Col xs={12}>
               <Tabs tabs={["Overview","Details","Contributors","Tables","Files","Queries","Integrations","Discussions"]}/>
            </Col>
        </Row>
        <Row className={"mt-2"}>
            <Col xs={12}>
                <Switch>
                    <Route exact path={`/dataset/:uri/shares`}>
                        <h1>Shares</h1>
                    </Route>
                    <Route exact path={`/dataset/:uri/Details`}>
                        <DatasetDetails/>
                    </Route>
                    <Route exact path={`/dataset/:uri/contributors`}>
                        <DatasetContributorsList/>
                    </Route>
                    <Route exact path={`/dataset/:uri/tables`}>
                        <DatasetTables/>
                    </Route>
                    <Route exact path={`/dataset/:uri/files`}>
                        <h1>Files</h1>
                    </Route>
                    <Route exact path={`/dataset/:uri/jobs`}>
                        <h1>Jobs</h1>
                    </Route>
                    <Route exact path={`/dataset/:uri/queries`}>
                        <DatasetQueries/>
                    </Route>
                    <Route exact path={`/dataset/:uri/integrations`}>
                        <h1>Integrations</h1>
                    </Route>
                    <Route exact path={`/dataset/:uri/discussions`}>
                        <h1>Discussions</h1>
                    </Route>
                    <Route  exact path={`/dataset/:uri/overview`}>
                        <DatasetOverview/>
                    </Route>
                </Switch>
            </Col>
        </Row>

    </Container>
    </FullScreen>
}



export default DatasetView;


