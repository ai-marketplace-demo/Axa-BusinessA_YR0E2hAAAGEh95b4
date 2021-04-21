import React, {useState, useEffect} from 'react';

import {Button, Grid, Icon, Table} from 'semantic-ui-react'
import * as Form from "../../components/form";
import FormFieldTypes from "../../components/form/FormFieldTypes";

const Stack = ({stack, update}) => {
    const resources = stack.resources ? JSON.parse(stack.resources).resources : [];
    const stackName = `stack-${stack.stackUri}`;
    return <div>
        {update && <Grid>
            <Grid.Column floated='right' width={3}>
                <Button size='small' compact onClick={update}
                        icon labelPosition='left'>
                    <Icon name='bars'/>
                    Update Stack
                </Button>
            </Grid.Column>
        </Grid>}
        <Form.EditForm
            onSubmit={()=>{}}
            editable={()=>{}}
            initialValues={{...stack, stackName}}

            fields={[

                {
                    items: [
                        {
                            type: Form.FormFieldTypes.Input,
                            readOnly: true,
                            editable: false,
                            name: 'stackName',
                            label: "Name",
                            icon: 'bars'

                        },
                        {
                            type: Form.FormFieldTypes.Input,
                            readOnly: true,
                            editable: false,
                            name: 'status',
                            label: "Status",
                            icon: 'toggle off'
                        },
                    ]
                },
                {
                    items: [
                        {
                            type: FormFieldTypes.Input,
                            label: 'Environment',
                            name: 'accountid',
                            readOnly: true,
                            editable: false,
                            icon: 'cloud'
                        },
                        {
                            type: FormFieldTypes.Input,
                            label: 'Region',
                            name: 'region',
                            readOnly: true,
                            editable: false,
                            icon: 'globe'
                        },
                    ]
                },
                {
                    type: FormFieldTypes.Input,
                    label: 'Arn',
                    name: 'stackid',
                    readOnly: true,
                    editable: false,
                    icon: 'aws'
                },
                {
                    type: FormFieldTypes.Input,
                    label: 'Console',
                    name: 'link',
                    readOnly: true,
                    editable: false,
                    icon: 'aws'
                },

            ]}
        />
        {resources && resources.length > 0 && (<div>
            <div><b>Resources</b></div>
            <Table celled compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={8}>Physical ID</Table.HeaderCell>
                        <Table.HeaderCell width={4}>Resource Type</Table.HeaderCell>
                        <Table.HeaderCell width={4}>Resource Status</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        resources.map((node)=>{
                            return <Table.Row>
                        <Table.Cell>
                            {node.PhysicalResourceId || '-'}
                        </Table.Cell>
                        <Table.Cell>
                            {node.ResourceType || '-'}
                        </Table.Cell>
                        <Table.Cell>
                            {node.ResourceStatus || '-'}
                        </Table.Cell>
                    </Table.Row>
                })}</Table.Body>
            </Table>
        </div>
        )}
    </div>
}

export default Stack;
