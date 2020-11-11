import React ,{useState, useEffect} from "react";
import {Row, Col, Badge, Spinner, Button} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {
    faSyncAlt, faGlobeEurope, faNetworkWired, faPlayCircle, faPauseCircle,
    faTrashAlt, faLockOpen, faIdCard, faHome, faCloud, faUserCog, faFolderPlus, faKey
} from "@fortawesome/free-solid-svg-icons";
import { faAws } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import Avatar from "react-avatar";
import useClient from "../../api/client";
import {If, Then} from "react-if";
import {CopyToClipboard} from "react-copy-to-clipboard";
import {toast} from "react-toastify";
import getCluster from "../../api/RedshiftCluster/getCluster";
import pauseRedshiftCluster from  "../../api/RedshiftCluster/pauseCluster";
import resumeRedshiftCluster from  "../../api/RedshiftCluster/resumeCluster";
import deleteRedshiftCluster from  "../../api/RedshiftCluster/deleteCluster";
import getClusterConsoleAccess from "../../api/RedshiftCluster/getClusterConsoleAccess";
import SpanZoomer from "../../components/Zoomer/SpanZoomer";
import {Link, useHistory} from "react-router-dom";
dayjs.extend(relativeTime);

const Styled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:19rem;
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
}
`;
const CardAction=styled.div`
transition: transform 0.2s ease-in-out;
&:hover{
   transform: translateY(-3px);
  }
`;

const LinkSpan=styled.span`
font-weight: 400;
color: #007bff;
text-decoration: none;
cursor: pointer;
`;



const RedshiftClusterListItem = (props)=> {
    const client = useClient();
    let [consoleUrl, setConsoleUrl]=useState();
    let history = useHistory();
    let [isLoadingConsoleUrl,setIsLoadingConsoleUrl] = useState(false);
    const [isLoadingCluster, setIsLoadingCluster] = useState(false);
    const [isStartingCluster, setIsStartingCluster] = useState(false);
    const [isStoppingCluster, setIsStoppingCluster] = useState(false);
    const [isDeletingCluster, setIsDeletingCluster] = useState(false);
    const copy=(field)=>{
        toast(`Copied ${field} to clipboard`,{hideProgressBar:true});
    };
    const [cluster, setCluster] = useState(props.cluster);
    const getRedshiftCluster = async ()=>{
        setIsLoadingCluster(true);
        const response = await client.query(getCluster(cluster.clusterUri));
        if (!response.errors){
            setCluster(response.data.getRedshiftCluster);
            toast(`Reloaded cluster ${cluster.name} data from account ${cluster.AwsAccountId}`);
        }else{
            toast.error(`Could not retrieve Cluster, ${response.errors[0].message}`,{hideProgressBar:true})
        }
        setIsLoadingCluster(false);
    };

    const startCluster = async ()=>{
        setIsStartingCluster(true);
        const response = await client.mutate(resumeRedshiftCluster(cluster.clusterUri));
        if (response.errors){
            toast.error(`Could not Resume Cluster, ${response.errors[0].message}`,{hideProgressBar:true})
        }
        else{
            toast(`Resuming Cluster ${cluster.name}`);
        }
        setIsStartingCluster(false);
    };

    const stopCluster = async ()=>{
        setIsStoppingCluster(true);
        const response = await client.mutate(pauseRedshiftCluster(cluster.clusterUri));
        if (response.errors){
            toast.error(`Could not Pause Cluster, ${response.errors[0].message}`,{hideProgressBar:true})
        }
        else{
            toast(`Pausing Cluster ${cluster.name}`);
        }
        setIsStoppingCluster(false);
    };

    const deleteCluster = async ()=>{
        setIsDeletingCluster(true);
        const response = await client.mutate(deleteRedshiftCluster(cluster.clusterUri));
        if (response.errors){
            toast.error(`Could not Delete cluster, ${response.errors[0].message}`,{hideProgressBar:true})
        }
        else{
            toast(`Deleting Cluster ${cluster.name}`);
            props.reloadClusters();
        }
        setIsDeletingCluster(false);
    };

    const generateRedirectUrl =async ()=>{
        setIsLoadingConsoleUrl(true);
        const response = await client.query(getClusterConsoleAccess(cluster.clusterUri));

        if (!response.errors){
            window.open(response.data.getRedshiftClusterConsoleAccess, '_blank');
        }else{
            toast(`Could not retrieve URL , received ${response.errors[0].message}`)
        }
        setIsLoadingConsoleUrl(false);
    };
    const goToClusterCreds = () => {
        history.push(`/redshiftcluster/${cluster.clusterUri}/redshiftcreds`);
    };
    const goToClusterDatasets = () => {
        history.push(`/redshiftcluster/${cluster.clusterUri}/datasets`);
    };
    const statusColor = (status) => {
        let color = 'primary';
        switch (status) {
            case 'available':
                color = 'success';
                break;
            case 'paused':
            case'NOTFOUND':
            case'stopping':
            case'stopped':
                color = 'danger';
                break;
            case 'resuming':
            case 'pausing':
            case 'modifying':
                color = 'warning';
                break;
            default:
                color = 'primary';
        }
        return color;
    };

    useEffect(()=>{},[client, props.cluster]);

    return <Styled>
        <Row className={'mb-3 border-bottom'}>
            <Col xs={9}>
                <span style={{ color: '#545b64', marginLeft: '3px' }}>
                    <Link to={`/organization/${cluster.organization.organizationUri}`}>
                        <FontAwesomeIcon icon={faHome} style={{ color: '#545b64' }}/> <b style={{ color: '#545b64' }} className={`text-capitalize`}>{cluster.organization.label}</b>
                    </Link>
                </span>
            </Col>
            <Col xs={3}>
                <span style={{ color: '#545b64', marginLeft: '3px' }}>
                    <Link to={`/playground/${cluster.environment.environmentUri}`}>
                        <FontAwesomeIcon icon={faCloud} style={{ color: '#545b64' }}/> <b style={{ color: '#545b64' }} className={`text-capitalize`}>{cluster.environment.label}</b>
                    </Link>
                </span>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                <p>
                    <Link to={`/redshiftcluster/${cluster.clusterUri}`}>
                        <Avatar className={`mr-1`} size={32} round={true} name={cluster.label}/> <b className={"text-capitalize"}>{cluster.label}</b>
                    </Link>
                </p>
            </Col>
        </Row>

        <Row className={`mt-1`}>
            <Col xs={9}>
                <Row>
                    <Col xs={12}>
                        <FontAwesomeIcon icon={faIdCard} style={{ color: '#545b64' }}/> <span style={{ color: '#545b64', marginLeft: '3px' }}>Identifier : </span>
                        <LinkSpan onClick={generateRedirectUrl}>{cluster.name}</LinkSpan>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FontAwesomeIcon icon={faAws} style={{ color: '#545b64' }}/> <span style={{ color: '#545b64', marginLeft: '3px' }}>Account : </span><span>{cluster.AwsAccountId}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FontAwesomeIcon icon={faGlobeEurope} style={{ color: '#545b64' }}/> <span style={{ color: '#545b64', marginLeft: '6px' }}>Region : </span><span>{cluster.region}</span>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FontAwesomeIcon icon={faNetworkWired} style={{ color: '#545b64' }}/> <span style={{ color: '#545b64', marginLeft: '3px' }}>Endpoint : </span>
                        <span>{!cluster.endpoint ?  ' -' : cluster.endpoint}</span>
                        {(cluster.endpoint &&
                            <SpanZoomer>
                                <CopyToClipboard text={`${cluster.endpoint}`}>
                                    <Icon.Clipboard onClick={()=>{copy('Endpoint')}} className={`ml-2`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12}>
                        <FontAwesomeIcon icon={faNetworkWired} style={{ color: '#545b64' }}/> <span style={{ color: '#545b64', marginLeft: '3px' }}>Port : </span>
                        <span>{`${cluster.port}`|| ' -'}</span>
                        {(cluster.port &&
                            <SpanZoomer>
                                <CopyToClipboard text={`${cluster.port}`}>
                                    <Icon.Clipboard onClick={()=>{copy('Port')}} className={`ml-2`}/>
                                </CopyToClipboard>
                            </SpanZoomer>
                        )}
                    </Col>
                </Row>
            </Col>
            <Col xs={3}>
                <Row OnClick={''}>
                    <Col className={`border-bottom mb-2`} xs={8}>
                        <CardAction
                            type="button"
                            onClick={generateRedirectUrl}>
                            <If condition={isLoadingConsoleUrl}>
                                <Then>
                                    <span style={{ marginRight: '3px'}}><Spinner size={`sm`} variant={`primary`} animation={`grow`}/></span>
                                </Then>
                            </If>
                            <FontAwesomeIcon icon={faAws} style={{ color: '#545b64', marginTop: '5px'}} size="sm"/>
                                <span style={{ color: '#545b64', marginLeft: '7px' }}>
                                    <b>Console</b>
                                </span>
                        </CardAction>
                    </Col>
                </Row>
                <Row>
                    <Col  className={`border-bottom mb-2`} xs={8}>
                        <CardAction
                            type="button"
                            onClick={goToClusterDatasets}>
                            <FontAwesomeIcon icon={faFolderPlus} style={{ color: '#545b64', marginTop: '5px'}}/>
                            <span style={{ color: '#545b64', marginLeft: '5px'}}><b>Datasets</b></span>
                        </CardAction>
                    </Col>
                </Row>
                <Row>
                    <Col  className={`border-bottom mb-2`} xs={8}>
                        <CardAction
                            type="button"
                            onClick={goToClusterCreds}>
                            <FontAwesomeIcon icon={faKey} style={{ color: '#545b64', marginTop: '5px'}}/>
                            <span style={{ color: '#545b64', marginLeft: '5px'}}><b>Credentials</b></span>
                        </CardAction>
                    </Col>
                </Row>
                {/*<Row>
                    <Col  className={`border-bottom mb-2`} xs={8}>
                        <CardAction
                            type="button"
                            onClick={startCluster}>
                            <If condition={isStartingCluster}>
                                <Then>
                                    <span style={{ marginRight: '3px'}}><Spinner size={`sm`} variant={`primary`} animation={`grow`}/></span>
                                </Then>
                            </If>
                            <FontAwesomeIcon icon={faPlayCircle} style={{ color: '#545b64', marginTop: '5px'}}/> <span style={{ color: '#545b64', marginLeft: '5px'}}><b>Resume</b></span>
                        </CardAction>
                    </Col>
                </Row>
                <Row>
                    <Col className={`border-bottom mb-2`} xs={8}>
                        <CardAction
                            type="button"
                            onClick={stopCluster}>
                            <If condition={isStoppingCluster}>
                                <Then>
                                    <span style={{ marginRight: '1px'}}><Spinner size={`sm`} variant={`primary`} animation={`grow`}/></span>
                                </Then>
                            </If>
                            <FontAwesomeIcon icon={faPauseCircle} style={{ color: '#545b64', marginTop: '5px'}}/> <span style={{ color: '#545b64', marginLeft: '5px'}}><b>Pause</b></span>
                        </CardAction>
                    </Col>
                </Row>*/}
                <Row>
                    <Col  className={`border-bottom mb-2`} xs={8}>
                        <CardAction
                            type="button"
                            onClick={deleteCluster}>
                            <If condition={isDeletingCluster}>
                                <Then>
                                    <span style={{ marginRight: '8px'}}><Spinner size={`sm`} variant={`primary`} animation={`grow`}/></span>
                                </Then>
                            </If>
                        <FontAwesomeIcon icon={faTrashAlt} style={{ color: '#545b64', marginTop: '5px'}}/> <span style={{ color: '#545b64', marginLeft: '5px'}}><b>Delete</b></span>
                        </CardAction>
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row className={`border-top mt-3`}>
            <Col xs={9}>
                <FontAwesomeIcon icon={faUserCog} style={{ color: '#545b64', marginTop: '5px'}}/>
                <span style={{ color: '#545b64', marginLeft: '5px', marginRight: '5px'}}><b>Permission</b></span>
                <Badge pill variant={`primary`} className={`text-uppercase`}> {cluster.userRoleForCluster}</Badge>
            </Col>
            <Col xs={3}>
                <CardAction
                    type="button"
                    onClick={getRedshiftCluster}>
                    <If condition={isLoadingCluster}>
                        <Then>
                            <span style={{ marginRight: '1px'}}><Spinner size={`sm`} variant={`primary`} animation={`grow`}/></span>
                        </Then>
                    </If>
                    <FontAwesomeIcon icon={faSyncAlt} style={{ color: '#545b64', marginTop: '5px'}}/>
                    <span style={{ color: '#545b64', marginLeft: '5px', marginRight: '5px'}}><b>Status</b></span>
                    <Badge pill variant={statusColor(cluster.status)} className={`text-uppercase`}> {cluster.status}</Badge>
                </CardAction>

            </Col>
        </Row>


    </Styled>
};

export default RedshiftClusterListItem

