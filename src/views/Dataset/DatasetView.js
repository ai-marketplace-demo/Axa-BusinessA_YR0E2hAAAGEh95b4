import React, { useState, useEffect, Component } from 'react';
import {
    Container, Spinner, Row, Col, Tabs, Tab, Badge
} from 'react-bootstrap';
import Loader from 'react-loaders';
import * as Icon from 'react-bootstrap-icons';
import {
    If, Then, Else, Switch, Case, Default
} from 'react-if';
import { useParams } from 'react-router-dom';
import useClient from '../../api/client';
import getDataset from '../../api/Dataset/getDataset';
import RoutableTabs from '../../components/Tabs/Tabs';
import DatasetTables from './DatasetTables/DatasetTables';
import DatasetOverview from './DatasetOverview/DatasetOverview';
import DatasetDetails from './DatasetDetails/DatasetDetails2';
import DatasetSummary from './DatasetSummary/DatasetSummary';
import DatasetFolderList from './DatasetFolders/DatasetFolderList';
import DatasetShareList from './DatasetShares/DatasetShareList';
import DatasetUpload from './DatasetUpload/DatasetUpload';
import ItemViewHeader from '../../components/ItemViewHeader/ItemViewHeader';
import DatasetQualityRulesList from './DatasetQualityRules/DatasetQualityRulesList';


const DatasetAdminView = (props) => {
    const client = useClient();
    const params = useParams();
    const [info, setInfo] = useState({});
    const [canEdit, setCanEdit] = useState(false);
    const [ready, setReady] = useState(false);
    const [key, setKey] = useState(params.tab || 'overview');


    const fetchDataset = async () => {
        const response = await client.query(getDataset(params.uri));
        if (!response.errors) {
            setInfo(response.data.getDataset);
            setReady(true);
            setCanEdit(['Creator', 'Admin'].indexOf(response.data.getDataset.userRoleForDataset) != -1);
        }
    };


    useEffect(() => {
        if (client) {
            fetchDataset();
        }
    }, [client, params.tab]);


    if (!ready) {
        return (
            <Container>
                <Row>
                    <Col style={{ marginTop: '24%', marginLeft: '43%' }} xs={4}>
                        <Loader color={'lightblue'} type="ball-scale-multiple" />
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container
            __style={{
                marginTop: '1rem',
                borderTop: '1px lightgrey solid',
                borderLeft: '1px lightgrey solid',
                borderRight: '1px lightgrey solid',
                borderTopLeftRadius: '12px ',
                borderTopRightRadius: '12px ',
            // boxShadow:' 0px -5px 5px  #f7f7f7',
            // backgroundColor:'#f7f7f7',
            }}
            fluid
        >
            <ItemViewHeader
                label={info.label}
                owner={info.owner}
                status={info.stack.status}
                role={info.userRoleForDataset}
                region={info.region}
                created={info.created}
                itemIcon={<Icon.Folder size={32} />}
            />
            <Row className={'mt-2'}>
                <Col xs={12}>
                    <RoutableTabs
                        tabs={[
                            'overview',
                            'summary',
                            'details',
                            'tables',
                            'folders',
                            'shares',
                            'upload',
                            'Data Quality'
                        ]}
                    />
                </Col>
            </Row>
            <Row className={'mt-1'}>
                <Col className={'pl-1 '} xs={12}>
                    <Switch>
                        <Case condition={params.tab == 'tables'}>
                            <If condition={ready}>
                                <Then>
                                    <DatasetTables dataset={info} />
                                </Then>
                            </If>
                        </Case>
                        <Case condition={params.tab == 'folders'}>
                            <DatasetFolderList dataset={info} />
                        </Case>
                        <Case condition={params.tab == 'shares'}>
                            <DatasetShareList dataset={info} />
                        </Case>
                        <Case condition={params.tab == 'details'}>
                            <If condition={ready}>
                                <Then>
                                    <DatasetDetails dataset={info} />
                                </Then>
                            </If>
                        </Case>
                        <Case condition={params.tab == 'summary'}>
                            <If condition={ready}>
                                <Then>
                                    <DatasetSummary dataset={info} />
                                </Then>
                            </If>
                        </Case>
                        <Case condition={params.tab == 'upload'}>
                            <DatasetUpload dataset={info} />
                        </Case>

                        <Case condition={params.tab === 'Data Quality'}>
                            <DatasetQualityRulesList
                                client={client}
                                dataset={info}
                            />
                        </Case>
                        <Default>
                            <If condition={ready}>
                                <Then>
                                    <DatasetOverview dataset={info} />
                                </Then>
                            </If>
                        </Default>
                    </Switch>
                </Col>
            </Row>
        </Container>
    );
};


export default DatasetAdminView;
