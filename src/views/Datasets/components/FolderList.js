import {Button, Form, Header, Icon, Message, Modal} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import {TableContainer} from "../../../components/table";
import listDatasetStorageLocations from "../../../api/Dataset/listDatasetStorageLocations";
import addDatasetStorageLocation from "../../../api/Dataset/addDatasetStorageLocation";
import useClient from "../../../api/client";
import React, {useEffect, useState} from "react";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";
import * as BsIcons from "react-icons/bs";
import * as ReactIf from "react-if";


const FolderList = ({dataset, folders, setFolders}) => {
    const client = useClient();
    const [items, setItems] = useState(folders ? folders : PagedResponseDefault);
    const [loading, setLoading] = useState(true);
    const [showFolderForm, setShowFolderForm] = useState(false);
    const [error, setError] = useState(null);
    const [folderInput, setFolderInput] = useState({
        prefix:'',
        label:''
    });
    const fetchItems = async () => {
        const response = await client.query(listDatasetStorageLocations(dataset.datasetUri));
        if (!response.errors) {
            setItems({...response.data.getDataset.locations});
            setFolders && setFolders({...response.data.getDataset.locations});
            setLoading(false);

        }
        else {
                setError({
                    header: `Dataset Folder`,
                    content: `Failed to retrieve folders: ${response.errors[0].message}`
                })
        }
    }
    const handleChange = (field,e) => {
        setFolderInput({
            ...folderInput, [field]: e.target.value
        });
    }
    const submitForm=async ()=>{
        console.log(folderInput);
        const response = await client.mutate(addDatasetStorageLocation({ datasetUri: dataset.datasetUri, input: folderInput }));
        if (!response.errors) {
            fetchItems()
            setFolderInput({
                prefix:'',
                label: '',
            })
            setShowFolderForm(false)
        } else {
            setError({
                header: `Folder Creation`,
                content: `Failed to create folder: ${response.errors[0].message}`
            })
        }

    };


    useEffect(() => {
        if (client) {
            if (!folders) {
                fetchItems();
            }
        }
    }, [client])
    return <div>
        <Button size='small' name={`url`} onClick={() => setShowFolderForm(true)} disabled={false} loading={false}
                icon labelPosition='left'>
            <Icon name='folder outline'/>
            New Folder
        </Button>
        <TableContainer
        loading={loading}
        columns={[
            {label: "Name", key: "label"},
            {label: "AWS Account", key: "AwsAccountId"},
            {label: "Region", key: "region"},
            {label: "S3 Prefix", key: "S3Prefix"},
            {label: 'Description', key: "description"},
            {label: 'Created', key: "created"},
            {label: 'Path', key: "path"},
        ]}
        rows={
            items.nodes.map((folder) => {
                return {
                    ...folder,
                    AwsAccountId: <code>{dataset.AwsAccountId}</code>,
                    region: <code>{dataset.region}</code>,
                    path: <small>{`s3://${dataset.S3BucketName}/${folder.S3Prefix}`}</small>,
                    label: (<Header as='h4' image>
                        <Icon name='folder outline'/>
                        <Header.Content>
                            {folder.name}
                            <Header.Subheader>
                                <Link to={`/folder/${folder.locationUri}`}>{folder.locationUri}</Link>
                            </Header.Subheader>
                        </Header.Content>
                    </Header>)
                }
            })
        }
    />
        <ReactIf.If condition={showFolderForm}>
            <ReactIf.Then>
                <Modal
                    centered={false}
                    onClose={() => setShowFolderForm(false)}
                    onOpen={() => setShowFolderForm(true)}
                    open={() => setShowFolderForm(true)}
                    size='large'
                    trigger={<span/>}
                >
                    <Modal.Header>
                        <b>Create Folder</b>
                    </Modal.Header>
                    <Modal.Content>
                        {error && <Message negative>
                            <Message.Header>{error.header}</Message.Header>
                            <p>{error && error.content}</p>
                        </Message>
                        }
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <input placeholder='My Folder' name={'label'} value={folderInput.label} onChange={(e)=>handleChange('label',e)}/>
                            </Form.Field>
                            <Form.Field>
                                <label>Prefix on S3 (without trailing slash !)</label>
                                <input placeholder='raw/version1' name={'prefix'} value={folderInput.prefix} onChange={(e)=>handleChange('prefix',e)}/>
                            </Form.Field>
                            <Button
                                type={'button'}
                                color={'grey'}
                                onClick={() => setShowFolderForm(false)}
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
        </ReactIf.If>
    </div>
}

export default FolderList;
