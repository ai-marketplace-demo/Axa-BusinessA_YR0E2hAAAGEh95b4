import React, { useState, useEffect } from 'react';
import {
    Container, Table, Row, Badge, Col, Spinner
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import styled from 'styled-components';
import * as Icon from 'react-bootstrap-icons';
import Select from 'react-select';
import {
    Link, useParams, useLocation, useHistory
} from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import useClient from '../../../api/client';
import createEnvironment from '../../../api/Environment/createEnvironment';
import checkEnvironment from '../../../api/Environment/verifyEnvironment';
import getTrustAccount from '../../../api/Environment/getTrustAccount';
import { AwsRegionsSelect as AwsRegion } from '../../../components/AwsRegions/AwsRegionSelect';

const PageStyled = styled.div`
height: 100vh;
`;

const FormStyled = styled.div`
border: 1px lightgrey solid;
height:23em;
border-radius: 0px Opx 5px 5px;
border-left:  4px solid #24a8c9;
padding: 3em;
margin-bottom: 12%;
width:100%;
box-shadow: 0px 1px 2px 2px whitesmoke;
`;

const NewEnvironmentForm = (props) => {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const client = useClient();
    const [ready, setReady] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const options = [
        { value: 'Data', label: 'Data' },
        { value: 'Compute', label: 'Compute' }
    ];
    const [formData, setFormData] = useState({
        label: 'myenv',
        description: '',
        SamlGroupName: '',
        AwsAccountId: '727430407563',
        region: { value: 'eu-west-1', label: 'Europe (Ireland)' },
        type: options[0]
    });

    const [trustAwsAccountId, setTrustAwsAccountId] = useState('111111111111');

    const getTrustAwsAccountId = async () => {
        const response = await client.query(getTrustAccount());
        if (!response.errors) {
            setTrustAwsAccountId(response.data.getTrustAccount);
        } else {
            toast('Could not retrieve trust account');
        }
    };

    const checkEnv = async () => {
        const EnvironmentInput = { AwsAccountId: formData.AwsAccountId, region: formData.region.value };
        const response = await client.query(checkEnvironment(EnvironmentInput));
        if (!response.errors) {
            // toast(`Aws account and region have been validated. (${response.data.checkEnvironment})`)
            return response.data.checkEnvironment;
        }
        toast(`aws://${formData.AwsAccountId}:${formData.region} was not correctly bootstrapped`);
        return null;
    };
    const submitForm = async () => {
        setIsSubmitting(true);
        const preCheck = await checkEnv();
        if (!preCheck) {
            return;
        }
        const res = await client.mutate(createEnvironment({
            organizationUri: params.uri,
            label: formData.label,
            region: formData.region.value,
            SamlGroupName: formData.SamlGroupName,
            AwsAccountId: formData.AwsAccountId
        }));
        if (!res.errors) {
            toast('Created Environment', {
                hideProgressBar: true,
                onClose: () => {
                    history.goBack();
                }
            });
        } else {
            toast.warn('Something went wrong');
        }
        setIsSubmitting(false);
    };
    const handleInputChange = ((e) => setFormData({ ...formData, [e.target.name]: e.target.value }));

    useEffect(() => {
        if (client) {
            getTrustAwsAccountId();
        }
    }, [client]);

    return (
        <PageStyled>
            <Container>
                <Row className={'mt-3'}>
                    <Col xs={11}>
                        <h3><Icon.Cloud className={'mr-3'} />Link Environment <b className={'text-primary text-capitalize'}>{formData.label}</b> </h3>
                    </Col>
                </Row>

                <Row className={'mt-3 p-3'}>
                    <Col xs={12}>
                        <div className="bg-light p-3" role="alert">
                            Before linking an AWS Account and region to datahub, please make sure:
                            <p><b> 1. You have bootsraped your account using the <a href={'https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install'}> aws cdk cli  </a></b></p>
                            <code>
                                cdk bootstrap  --trust {trustAwsAccountId} -c @aws-cdk/core:newStyleStackSynthesis=true --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://{formData.AwsAccountId}/{formData.region.value}
                            </code>
                            <p><b>
                                2. You have created an IAM Role called datahubPivotRole on your account
                               </b>
                            </p>
                            <p><b>3. The role must trust the account <code>{trustAwsAccountId}</code></b></p>
                        </div>
                    </Col>
                </Row>
                <FormStyled className={'mt-0'}>
                    <If condition={isSubmitting}>
                        <Then>
                            <Row>
                                <Col xs={2}>
                                    <Spinner variant={'primary'} animation={'border'} />
                                </Col>
                            </Row>
                        </Then>
                    </If>

                    <Row className={''}>
                        <Col className="pt-2" xs={3}><h6><b>Name</b></h6></Col>
                        <Col xs={6}>
                            <input
                                className={'form-control'}
                                name="label"
                                value={formData.label}
                                onChange={handleInputChange}
                                placeholder={'enter environment name'}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                    <Row className={'mt-1'}>
                        <Col className="pt-2" xs={3}><h6><b>Group Name </b></h6></Col>
                        <Col xs={6}>
                            <input
                                className={'form-control'}
                                name="SamlGroupName"
                                value={formData.SamlGroupName}
                                onChange={handleInputChange}
                                placeholder={'enter SAML Group Name'}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                    <Row className={'mt-1'}>
                        <Col className="pt-2" xs={3}><h6><b>AWS</b></h6></Col>
                        <Col xs={6}>
                            <input
                                className={'form-control'}
                                value={formData.AwsAccountId}
                                name={'AwsAccountId'}
                                onChange={handleInputChange}
                                placeholder={'Account Id'}
                                style={{ width: '100%' }}
                            />
                        </Col>
                    </Row>
                    <Row className={'mt-2'}>
                        <Col className="pt-2" xs={3}><h6><b>Region</b></h6></Col>
                        <Col xs={6}>
                            <AwsRegion
                                value={formData.region}
                                selectRegion={(selectOption) => { setFormData({ ...formData, region: selectOption }); }}
                            />
                        </Col>
                    </Row>
                    <Row className={'mt-3'}>
                        <Col xs={3} />
                        <Col xs={2}>
                            <If condition={!isSubmitting}>
                                <Then>
                                    <div onClick={submitForm} className={'btn btn-sm btn-info'}>
                                        Submit
                                    </div>
                                </Then>
                                <Else>
                                    <div className={'btn disabled btn-sm btn-info'}>
                                        Submit
                                    </div>
                                </Else>
                            </If>
                        </Col>
                        <Col xs={2}>
                            <If condition={!isSubmitting}>
                                <Then>
                                    <Link

                                        to={{
                                            state: location.state,
                                            pathname: `/organization/${params.uri}/environments`
                                        }}
                                    >
                                        <div className={'btn btn-sm btn-primary'}>
                                            Cancel
                                        </div>

                                    </Link>
                                </Then>
                                <Else>
                                    <div className={'btn disabled btn-sm btn-primary'}>
                                        Cancel
                                    </div>
                                </Else>
                            </If>

                        </Col>
                    </Row>
                </FormStyled>
            </Container>
        </PageStyled>
    );
};


export default NewEnvironmentForm;
