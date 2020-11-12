import React, {useState, useEffect} from "react";
import {Container, Row, Col, Spinner, Badge} from "react-bootstrap";
import {Switch, Case, Default, If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {Auth} from 'aws-amplify';
import {
    ReactiveBase,
    ReactiveList,
    SelectedFilters,
    MultiList,
    CategorySearch,
    DataSearch
} from "@appbaseio/reactivesearch"
import ColoredCircle from "../../components/ColoredCircle/ColoredCircle";
import TagPill from "../../components/TagPill/TagPill";
import styled from "styled-components";
import HumandReadableDate from "../../components/HumanReadableDate/HumanReadableDate";
import {Link} from "react-router-dom";
import config from "../../config";
import useClient from "../../api/client";
import useToken from "../../api/token";

const FacetStyled = styled.div`
height: auto !important;
min-height: 100vh;
margin-bottom: 20%;
& .facet{
  font-size: 0.6rem;
  margin-top: 0;
  margin-bottom: 0;
  color : black;
}
& .facet-title{
  font-weight: bolder;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}
& .facet-list{
  margin: 0;
  padding: 0;
}

& .facet-input{
  height:1rem;
}

& .facet-btn{
  a{
    height:0.8rem;
    background-color: white;
    font-size: 0.8rem;
    color:lightskyblue;
  }
}

`

const CardDetail = styled.div`
font-size: 0.8rem;
small{
  font-weight: lighter;
  color: darkslategrey;
  font-style: oblique;
}

`

const HitStyled = styled.div`
min-height: 15rem;
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-3px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:14rem;
margin-top: 7px;
padding: 1em;
border : 1px solid gainsboro;
border-radius: 8px;

a{
  color :black;
  outline: 0;
}
a:hover, a:link, a:visited{
  text-decoration:none;
  color :black;
}
`


const Hit=(props)=>{
    const hit = props.hit;
    return <HitStyled>

        <Row className={`mt-3`}>

            <Col xs={1}>
                <Switch>
                    <Case condition={hit.datahubKind == "dataset"}>
                        <Icon.Folder size={18}/>
                    </Case>
                    <Case condition={hit.datahubKind == "table"}>
                        <Icon.Table size={18}/>

                    </Case>
                    <Case condition={hit.datahubKind == "folder"}>
                        <Icon.Files size={18}/>
                    </Case>
                </Switch>
            </Col>
            <Col className={``} xs={11}>
                <Row>
                    <Col xs={9}>
                        <Row>
                            <Col xs={1}>
                                <ColoredCircle label={hit.label}>{hit.label[0].toUpperCase()}</ColoredCircle>
                            </Col>
                            <Col xs={10}>
                                <Link to={`/dataset/${hit._id}/overview`}>
                                    <b>{hit.label.toUpperCase()}</b>
                                </Link>
                            </Col>
                        </Row>
                        <Row className={`mt-2`}>
                            <Col xs={11}>
                                <small>Created <HumandReadableDate d={hit.created}/> by <Icon.Person size={"15"}/> <a href={`¶`}>{hit.owner}</a></small>
                            </Col>
                        </Row>
                        <Row className={`mt-2`}>
                            <Col xs={10}>
                                <i style={{color:"blue", fontSize:"1.1rem"}}>{hit.description}</i>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={4}>
                                <small><Icon.Globe2/> {hit.region}</small>
                            </Col>
                            <Col xs={4}>
                                <small><Icon.House/> {hit.organizationName}</small>
                            </Col>
                            <Col xs={4}>
                                <small><Icon.People/> {hit.environmentName}</small>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={3}>
                        <Row>
                            <Col xs={12}>
                                <Link
                                    target="_blank"
                                    style={{color: 'white'}}

                                    to={{
                                        pathname: `/dataset/${hit._id}/shares`
                                    }}>
                                    <div style={{width: "7rem"}} className={"btn btn-sm btn-white border rounded-pill"}>
                                        Get It
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                        <Row className={`pt-1`}>
                            <Col xs={12}>
                                <Link
                                    target="_blank"
                                    style={{color: 'white'}}

                                    to={{
                                        pathname: `/dataset/${hit._id}/summary`
                                    }}>
                                    <div style={{width: "7rem"}} className={"btn btn-sm btn-white border rounded-pill"}>
                                        README
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                        <Row className={`pt-1`}>
                            <Col xs={12}>
                                <Link
                                    target="_blank"
                                    style={{color: 'white'}}

                                    to={{
                                        pathname: `/dataset/${hit._id}/tables`
                                    }}>
                                    <div style={{width: "7rem"}} className={"btn btn-sm btn-white border rounded-pill"}>
                                        DICT
                                    </div>
                                </Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>

            </Col>
        </Row>
        <Row className={`mt-3`}>
            <Col xs={1}/>
            <Col xs={1}>
                <Icon.TagsFill/>
            </Col>
            <Col xs={9}>
                <If condition={hit.topics}>
                    <Then>
                        {
                            (hit.topics && hit.topics.length && hit.topics || []).map((t) => {
                                return <Badge clasName={`border ml-1`} pill variant={`secondary`}
                                              size={`sm`}>{t}</Badge>
                            })
                        }
                    </Then>
                </If>
            </Col>
        </Row>
        <Row className={`mt-2`}>
            <Col xs={1}/>
            <Col  xs={1}>
                <Icon.Tags/>
            </Col>
            <Col  xs={9}>
                <If condition={hit.topics}>
                    <Then>
                        {
                            (hit.tags && hit.tags.length && hit.tags || []).map((t) => {
                                return <Badge clasName={`border ml-1`} pill variant={`info`}
                                              size={`sm`}>{t}</Badge>
                            })
                        }
                    </Then>
                </If>
            </Col>

        </Row>

    </HitStyled>
}



const ES = (props) => {
    //const client = useClient();
    //const [token,setJwtToken] = useState(null);
    const token = useToken();
    const transformRequest = (request) => {
        console.log("inputRequest");
        console.log(request);
        const transformedRequest = {...request};
        console.log("here ")
        transformedRequest.url = config.apiGateway.ESURL


        console.log('transformedRequest');
        console.log(transformedRequest);

        return {
            ...request,
            url: transformedRequest.url,
            credentials: {token},
            headers: {
                AccessControlAllowOrigin: '*',
                AccessControlAllowHeaders: '*',
                'access-control-allow-origin': '*',
                Authorization: token,
                AccessKeyId: 'None',
                SecretKey: 'None',
                //username: 'moshirm@amazon.fr', //this is for local development only
            }
        }
    }
    const fetchToken = () => {
        //let session = await Auth.currentSession();
        //const token = session.getIdToken().getJwtToken();
        //setJwtToken(token);
        //console.log(">>>>",client.__token);
        //setJwtToken(client.__token)
        //setJwtToken(clientToken);

    }


    if (!token) {
        return <Spinner variant={`primary`} size={`sm`} animation={`border`}/>
    }
    return <FacetStyled>
        <Container fluid className={"mt-4"}>
            <Row>
                <Col xs={8}>
                    <h3> <Icon.Folder2Open/> Discover </h3>
                </Col>

            </Row>

            <Row className={`mt-3`}>
                <Col xs={12}>


                    <ReactiveBase
                        app={`datahub-index`}
                        enableAppbase={false}
                        //credentials={""}
                        url={config.apiGateway.ESURL}

                        transformRequest={transformRequest}
                    >
                        <Row>
                            <Col xs={12}>
                                <DataSearch
                                    //autosuggest={false}
                                    className={`bg-white border-0`}
                                    innerClass={{input: `form-control bg-white rounded-pill`}}
                                    componentId="SearchSensor"
                                    dataField={[
                                        "label",
                                        "uri",
                                        "id",
                                        "name",
                                        "owner",
                                        "description",
                                        "owner",
                                        "topics",
                                        "tags",
                                        "created",
                                        "updated",
                                        "region",
                                        "datahubKind",
                                        "organizationName",
                                        "organizationUri",
                                        "environmentName",
                                        "environmentUri",
                                    ]}
                                    placeholder="Search anything"
                                />
                            </Col>
                            <Col xs={12}>
                                <SelectedFilters/>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={3}>

                                <Row>
                                    <Col xs={12}>
                                        <MultiList
                                            innerClass={{
                                                input: `facet-input  facet text-sm bg-white border-0 `,
                                                title: `facet-title`,
                                                checkbox: `form-control`,
                                                label: `facet`,
                                                list: `facet-list facet-btn`,
                                                count: `facet  `
                                            }}

                                            showLoadMore={true}
                                            showMissing={true}
                                            showFilter={true}
                                            renderNoResults={() => <p>No Results Found</p>}
                                            componentId="KindSensor"
                                            dataField="datahubKind"
                                            title="Type"
                                        />
                                    </Col>

                                    <Col xs={12}>
                                        <MultiList
                                            innerClass={{
                                                input: `facet-input  facet text-sm bg-white border-0 `,
                                                title: `facet-title`,
                                                checkbox: `form-control`,
                                                label: `facet`,
                                                list: `facet-list facet-btn`,
                                                count: `facet  `
                                            }}
                                            showLoadMore={true}
                                            showMissing={true}
                                            showFilter={true}
                                            renderNoResults={() => <p>No Results Found</p>}
                                            componentId="TagSensor"
                                            dataField="tags"
                                            title="Tags"
                                        />
                                    </Col>

                                    <Col xs={12}>
                                        <MultiList
                                            innerClass={{
                                                input: `facet-input  facet text-sm bg-white border-0 `,
                                                title: `facet-title`,
                                                checkbox: `form-control`,
                                                label: `facet`,
                                                list: `facet-list facet-btn`,
                                                count: `facet  `
                                            }}

                                            showLoadMore={true}
                                            showMissing={true}
                                            showFilter={true}
                                            renderNoResults={() => <p>No Results Found</p>}
                                            componentId="TopicSensor"
                                            dataField="topics"
                                            title="Topics"
                                        />
                                    </Col>
                                    <Col xs={12}>
                                        <MultiList
                                            innerClass={{
                                                input: `facet-input  facet text-sm bg-white border-0 `,
                                                title: `facet-title`,
                                                checkbox: `form-control`,
                                                label: `facet`,
                                                list: `facet-list facet-btn`,
                                                count: `facet  `
                                            }}
                                            showLoadMore={true}
                                            //showMissing={true}
                                            //showFilter={true}
                                            renderNoResults={() => <p>No Results Found</p>}
                                            componentId="Region"
                                            dataField="region"
                                            title="Regions"
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={9}>
                                <ReactiveList
                                    react={{
                                        and: ['Region', 'SearchSensor', 'TagSensor', 'TopicSensor', 'KindSensor'],
                                    }}
                                    infiniteScroll={true}
                                    componentId="SearchResult"
                                    loader={<Spinner className={`m-2`} animation={`border`} variant={`success`}
                                                     size={`sm`}/>}

                                    renderItem={(hit) => {
                                        return <Hit hit={hit}/>
                                    }}
                                />

                            </Col>
                        </Row>


                    </ReactiveBase>


                </Col>
            </Row>
        </Container>
    </FacetStyled>

}

export default ES;

