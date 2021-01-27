import React ,{useState, useEffect} from "react";
import {
    Row,
    Col,
    Badge,
    Alert,
    Modal,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import {BrowserRouter, Route,Link, Switch} from "react-router-dom";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
import BasicCard from "../../components/Card/BasicCard";
import {If, Then} from "react-if";
import deleteDataset from "../../api/Dataset/deleteDataset";
import archiveDataset from "../../api/Dataset/archiveDataset";
import {toast} from "react-toastify";
import useClient from "../../api/client";
dayjs.extend(relativeTime);




const Header=(props)=>{
    return <Row>
        <Col xs={9}>
            <Link to={`/dataset/${props.dataset.datasetUri}/overview`}>
                <b className={"text-capitalize"}>{props.dataset.label}</b>
            </Link>
        </Col>
        <Col xs={1}>
            <If condition={props.canEdit}>
                <Then>
                    <Link to={"#"}>
                        <Icon.Archive  onClick={props.openArchiveModal} className={`text-primary`}/>
                    </Link>
                </Then>
            </If>
        </Col>
        <Col xs={1}>
            <If condition={props.canEdit}>
                <Then>
                    <Link to={"#"}>
                        <Icon.Trash  onClick={props.openDeleteModal} className={`text-danger`}/>
                    </Link>
                </Then>
            </If>
        </Col>
    </Row>
}
const Body=(props)=>{
    return <div className={`mt-3`}>
        <Row>
            <Col xs={2}>
                <Icon.House size={18}/>
            </Col>
            <Col xs={8}>
                <small><b>{props.dataset.organization.label.toUpperCase()}</b></small>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.Cloud size={18}/>
            </Col>
            <Col xs={10}>
                <small>{props.dataset.environment.label}({props.dataset.environment.AwsAccountId}/{props.dataset.environment.region})</small>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.PersonCheck size={18}/>
            </Col>
            <Col xs={8}>
                <Badge pill className={`pb-1 text-white bg-info`}>
                    {props.dataset.userRoleForDataset}
                </Badge>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.People size={18}/>
            </Col>
            <Col xs={8}>
                <small>{props.dataset.SamlAdminGroupName}</small>
            </Col>
        </Row>

        <Row>
            <Col xs={2}>
                <Icon.Table/>
            </Col>
            <Col xs={4}>
                <Link className={`text-primary`}
                      to={{
                          pathname:`/dataset/${props.dataset.datasetUri}/tables`,
                          state:{dataset:props.dataset}
                      }}>
                    <small>
                        {props.dataset.statistics.tables} Tables
                    </small>
                </Link>
            </Col>
        </Row>
        <Row>
            <Col xs={2}>
                <Icon.Folder/>
            </Col>
            <Col xs={4}>
                <Link className={`text-primary`}
                      to={{
                          pathname:`/dataset/${props.dataset.datasetUri}/locations`,
                          state:{dataset:props.dataset}
                      }}>
                    <small> {props.dataset.statistics.locations} Folders</small>
                </Link>
            </Col>
        </Row>
    </div>

}

const DatasetListItem = (props)=> {
    const client = useClient();
    let [regions, setRegions] = useState([
        {label: 'US East (Ohio)', value: 'us-east-2'},
        {label: 'US East (N. Virginia)', value: 'us-east-1'},
        {label: 'US West (N. California)', value: 'us-west-1'},
        {label: 'US West (Oregon)', value: 'us-west-2'},
        {label: 'Africa (Cape Town)', value: 'af-south-1'},
        {label: 'Asia Pacific (Hong Kong)', value: 'ap-east-1'},
        {label: 'Asia Pacific (Mumbai)', value: 'ap-south-1'},
        {label: 'Asia Pacific (Osaka-Local)', value: 'ap-northeast-3'},
        {label: 'Asia Pacific (Seoul)', value: 'ap-northeast-2'},
        {label: 'Asia Pacific (Singapore)', value: 'ap-southeast-1'},
        {label: 'Asia Pacific (Sydney)', value: 'ap-southeast-2'},
        {label: 'Asia Pacific (Tokyo)', value: 'ap-northeast-1'},
        {label: 'Canada (Central)', value: 'ca-central-1'},
        {label: 'China (Beijing)', value: 'cn-north-1'},
        {label: 'China (Ningxia)', value: 'cn-northwest-1'},
        {label: 'Europe (Frankfurt)', value: 'eu-central-1'},
        {label: 'Europe (Ireland)', value: 'eu-west-1'},
        {label: 'Europe (London)', value: 'eu-west-2'},
        {label: 'Europe (Milan)', value: 'eu-south-1'},
        {label: 'Europe (Paris)', value: 'eu-west-3'},
        {label: 'Europe (Stockholm)', value: 'eu-north-1'},
        {label: 'Middle East (Bahrain)', value: 'me-south-1'},
        {label: 'South America (São Paulo)', value: 'sa-east-1'},
        {label: 'AWS GovCloud (US-East)', value: 'us-gov-east-1'},
        {label: 'AWS GovCloud (US)', value: 'us-gov-west-1'},
    ]);
    const dataset = props.dataset;
    let [isHovered, setHovered] = useState(false);
    let [menuState, setMenu] = useState({
        visibility: "hidden",
        zIndex: 0
    })
    let canEdit=['BusinessOwner','Creator',].indexOf(dataset.userRoleForDataset)!=-1;
    const toggle = (state) => {
        console.log("hovered");
        setHovered(state)
    }
    const [isArchivingDataset, setIsArchivingDataset] = useState(false);
    const [isDeletingDataset, setIsDeletingDataset] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const openDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };
    const openArchiveModal = () => {
        setShowArchiveModal(true);
    };

    const closeArchiveModal = () => {
        setShowArchiveModal(false);
    };

    const removeDataset = async () => {
        setIsDeletingDataset(true);
        const response = await client.mutate(deleteDataset(dataset.datasetUri));
        if (response.errors) {
            toast.error(`Could not delete dataset, ${response.errors[0].message}`, {hideProgressBar: true})
        } else {
            toast(`Deleting dataset ${dataset.label}`);
            props.reloadDatasets();
        }
        setIsDeletingDataset(false);
    };

    const storeDataset = async () => {
        setIsArchivingDataset(true);
        const response = await client.mutate(archiveDataset(dataset.datasetUri));
        if (response.errors) {
            toast.error(`Could not archive dataset, ${response.errors[0].message}`, {hideProgressBar: true})
        } else {
            toast(`Archiving dataset ${dataset.label}`);
            props.reloadDatasets();
        }
        setIsArchivingDataset(false);
    };


    const header = <Header regions={regions}
                           canEdit={true}
                           openDeleteModal={openDeleteModal}
                           openArchiveModal={openArchiveModal}
                           {...props}/>;
    const body = <Body {...props}/>;

    return <div>
        <BasicCard
            label={dataset.label}
            tags={dataset.tags || []}
            owner={dataset.owner}
            header={header}
            body={body}
            created={dataset.created}
            description={dataset.description}
        />
        <Modal show={showArchiveModal} onHide={closeArchiveModal}>
            <Modal.Header closeButton>
                <Modal.Title>Archive Dataset</Modal.Title>
            </Modal.Header>
            <Modal.Body><b>Archiving Dataset <i>{dataset.label}</i> will not remove AWS resources linked to the dataset on your AWS account.
                Confirm action ?</b>
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col xs={6}>
                        <div className={`btn-group`}>
                            <div onClick={storeDataset} className={`btn btn-sm btn-warning`}>Archive</div>
                            <div className={`pl-2 btn btn-sm  btn-primary`} onClick={closeArchiveModal}>Cancel</div>
                        </div>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
        <Modal show={showDeleteModal} onHide={closeDeleteModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Dataset</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Alert><b>Deleting Dataset <i>{dataset.label}</i> will remove all AWS resources linked to the dataset on your AWS account.
                    Confirm action ?</b>
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Row>
                    <Col xs={6}>
                        <div className={`btn-group`}>
                            <div onClick={removeDataset} className={`btn btn-sm btn-danger`}>Delete</div>
                            <div className={`pl-2 btn btn-sm  btn-primary`} onClick={closeDeleteModal}>Cancel</div>
                        </div>
                    </Col>
                </Row>
            </Modal.Footer>
        </Modal>
    </div>

};

export default DatasetListItem;

