import React, {useEffect, useState} from "react";
import {TableContainer} from "../../../components/table";
import useClient from "../../../api/client";
import createAirflowProject from "../../../api/AirflowCluster/createAirflowProject";
import listAirflowProjects from "../../../api/AirflowCluster/listClusterProjects";
import {PagedResponseDefault} from "../../../components/defaults";
import {Button, Form, Header, Icon, Input, Message, Modal} from "semantic-ui-react";
import * as ReactIf from "react-if";

const ProjectList = ({workflow, projects, setProjects}) => {
    const client = useClient();
    const [items, setItems] = useState(projects ? projects : PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [projectInput, setProjectInput] = useState({
        packageName:'',
    });
    const fetchItems = async () => {
        const response=await client.query(listAirflowProjects({
            clusterUri:workflow.clusterUri,
            filter : {
                page : items.page,
                pageSize: 25,
            }
        }));
        if (!response.errors){
            setItems({...response.data.listAirflowClusterProjects});
            setProjects && setProjects({...response.data.listAirflowClusterProjects});
        }
        setLoading(false);
    }
    const handleChange = (e) => {
        setProjectInput({
            "packageName": e.target.value
        });
    }
    const submitForm=async ()=>{
        const response = await client.mutate(createAirflowProject({
            clusterUri : workflow.clusterUri,
            input:projectInput
        }));
        if (!response.errors) {
            fetchItems()
            setProjectInput({
                packageName:'',
            })
            setShowProjectForm(false)
        } else {
            setError({
                header: `Airflow Project`,
                content: `Failed to create Airflow project due to: ${response.errors[0].message}`
            })
       }

    };

    useEffect(() => {
        if (client) {
            if (!projects) {
                fetchItems();
            }
        }
    }, [client])

    return <div>
        <Button size='small' name={`url`} onClick={() => setShowProjectForm(true)} disabled={false} loading={false}
                icon labelPosition='left'>
            <Icon name='plus circle'/>
            Create Project
        </Button>
        <TableContainer
        loading={loading}
        columns={[
            {label: "Uri", key: 'projectUri'},
            {label: "Project", key: "packageName"},
            {label: "CodeCommit", key: "codeRepositoryName"},
            {label: "CodePipeline", key: "codePipelineName"},
        ]}
        rows={items.nodes.map((node) => {
            return {
                ...node,
                packageName: node.packageName,
                codeRepositoryName: (<b><a href={node.codePipelineLink} style={{color:`#1f9bcf`}} target="_blank" rel="noopener noreferrer">
                    {node.codePipelineName}
                </a></b>),
                codePipelineName: (<b><a href={node.codePipelineLink} style={{color:`#1f9bcf`}} target="_blank" rel="noopener noreferrer">
                    {node.codePipelineName}
                </a></b>),
            }
        })}
    /><ReactIf.If condition={showProjectForm}>
        <ReactIf.Then>
            <Modal
                centered={false}
                onClose={() => setShowProjectForm(false)}
                onOpen={() => setShowProjectForm(true)}
                open={() => setShowProjectForm(true)}
                size='small'
                trigger={<span/>}
            >
                <Modal.Header>
                    <b>Create Python project</b>
                </Modal.Header>
                <Modal.Content>
                    {error && <Message negative>
                        <Message.Header>{error.header}</Message.Header>
                            <p>{error && error.content}</p>
                        </Message>
                    }
                    <Form>
                        <Form.Field>
                            <label>Package Name (lower case with no special characters)</label>
                            <input placeholder='myproject' name={'packageName'} value={projectInput.packageName} onChange={(e)=>handleChange(e)}/>
                        </Form.Field>
                        <Button
                            type={'button'}
                            color={'grey'}
                            onClick={() => setShowProjectForm(false)}
                            basic size={`mini`}
                        >Cancel</Button>
                        <Button
                            type={'submit'}
                            color={'blue'}
                            onClick={submitForm}
                            basic size={`mini`}
                        >Create</Button>
                    </Form>
                </Modal.Content>
            </Modal>
        </ReactIf.Then>
    </ReactIf.If></div>
}

export default ProjectList;
