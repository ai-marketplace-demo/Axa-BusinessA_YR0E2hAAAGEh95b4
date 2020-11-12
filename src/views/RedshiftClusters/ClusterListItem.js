import React ,{useState, useEffect} from "react";
import {Row, Col, Badge, Spinner, Button, Modal} from "react-bootstrap";
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
import UserProfileLink from "../Profile/UserProfileLink";
import LinkSpan from "../../components/Link/LinkSpan";
dayjs.extend(relativeTime);

const Styled=styled.div`
transition: transform 0.3s ease-in-out;
&:hover{
  transform: translateY(-5px);
  box-shadow: 0px 3px 2px lightgrey;
}
height:18.7rem;
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





const RedshiftClusterListItem = (props)=> {
    const client = useClient();
    let [consoleUrl, setConsoleUrl]=useState();
    let history = useHistory();
    let [isLoadingConsoleUrl,setIsLoadingConsoleUrl] = useState(false);
    const [isLoadingCluster, setIsLoadingCluster] = useState(false);
    const [isStartingCluster, setIsStartingCluster] = useState(false);
    const [isStoppingCluster, setIsStoppingCluster] = useState(false);
    const [isDeletingCluster, setIsDeletingCluster] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    useEffect(()=>{},[client, props.cluster]);


    return <Styled>
        <Row className={``}>
            <Col xs={9}>
                <Link to={`/redshiftcluster/${props.cluster.clusterUri}`}>
                    <p>
                        <Avatar className={`mr-1`} size={32} round={true} name={props.cluster.label}/> <b className={"text-capitalize"}>{props.cluster.label}</b>
                    </p>
                </Link>
            </Col>
            <Col xs={3}>
                <CardAction
                    type="button"
                    onClick={getRedshiftCluster}>
                    <If condition={isLoadingCluster}>
                        <Then>
                            <span style={{ marginRight: '1px', marginTop: '.5rem!important'}}>
                                <Spinner size={`sm`} variant={`primary`} animation={`grow`}/>
                            </span>
                        </Then>
                    </If>
                    <Badge pill variant={statusColor(cluster.status)} className={`text-uppercase`}> {cluster.status}</Badge>
                </CardAction>
            </Col>
        </Row>
        <Row>
            <Col xs={12}>
                Created by <UserProfileLink username={props.cluster.owner}/> {dayjs(props.cluster.created).fromNow()}
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <Icon.People size={22}/>
            </Col>
            <Col xs={8}>
                <Link className={`text-primary`} to={`/organization/${cluster.organization.organizationUri}`}>
                    {props.cluster.organization.name}
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <Icon.Cloud size={22}/>
            </Col>
            <Col xs={8}>
                <Link className={`text-primary`} to={`/playground/${cluster.environment.environmentUri}`}>
                    {props.cluster.environment.name}
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={1}>
                <Icon.PersonCheck size={22}/>
            </Col>
            <Col xs={4}>
                <Badge pill variant={`primary`} className={`mt-1 text-uppercase`}>
                    {cluster.userRoleForCluster}
                </Badge>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={1}>
                <Icon.Link size={22}/>
            </Col>
            <Col xs={11}>
                <LinkSpan onClick={generateRedirectUrl}>{cluster.name}</LinkSpan>
            </Col>
        </Row>
        <Row className={`mt-1`}>
            <Col xs={1} className={`mt-1`}>
                <FontAwesomeIcon icon={faNetworkWired}/>
            </Col>
            <Col xs={11}>
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
        <Row className={`mt-2 border-top mb-2 justify-content-center`}>
            <span className={`mt-2 mr-2`}>
                <If condition={isLoadingConsoleUrl}>
                    <Then>
                        <Spinner size={`sm`} variant={`primary`} animation={`grow`}/>
                    </Then>
                </If>
                <Button style={{ fontSize: '0.7rem' }} variant={'secondary'} className={'rounded-pill'} onClick={()=>generateRedirectUrl()}>
                    <b><FontAwesomeIcon icon={faAws}/> Console</b>
                </Button>
            </span>
            <span className={`mt-2 mr-2`}>
                <Button style={{ fontSize: '0.7rem' }} variant={'primary'} className={'rounded-pill'} onClick={()=> goToClusterDatasets()}>
                    <b><FontAwesomeIcon icon={faFolderPlus}/> Datasets</b>
                </Button>
            </span>
            <span className={`mt-2 mr-2`}>
                <Button style={{ fontSize: '0.7rem' }} variant={'info'} className={'rounded-pill'} onClick={()=> goToClusterCreds()}>
                    <b><FontAwesomeIcon icon={faKey}/> Credentials</b>
                </Button>
            </span>
            <span className={`mt-2`}>
                <If condition={isDeletingCluster}>
                    <Then>
                        <Spinner size={`sm`} variant={`primary`} animation={`grow`}/>
                    </Then>
                </If>
                <Button style={{ fontSize: '0.7rem' }} variant={'danger'} className={'rounded-pill'} onClick={()=>openDeleteModal()}>
                    <b><Icon.Trash/> Delete</b>
                </Button>
            </span>
        </Row>
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Redshift Cluster</Modal.Title>
            </Modal.Header>
            <Modal.Body>Confirm Amazon Redshift cluster <b><i>{cluster.label}</i></b> deletion ?</Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" className={'rounded-pill'} onClick={closeDeleteModal}>
                    Close
                </Button>
                <Button variant="outline-danger" className={'rounded-pill'} onClick={deleteCluster}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    </Styled>

};


export default RedshiftClusterListItem;

