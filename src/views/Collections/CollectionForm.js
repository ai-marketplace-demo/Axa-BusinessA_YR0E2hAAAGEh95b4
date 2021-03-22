import {useState} from "react";
import {Grid, GridElement} from "../../components/cssgrid/Grid";
import {Link, useHistory} from "react-router-dom";
import {CreateForm, FormFieldTypes} from "../../components/form";
import * as Text from "../../components/Text";
import * as BsIcon from "react-icons/bs";
import {Button, Form, Message, Select} from "semantic-ui-react";
import useGroups from "../../api/useGroups";
import useClient from "../../api/client";
import createOrganization from "../../api/Organization/createOrganization";
import TagEditor from "../../components/TagEditor/TagEditor";

const __OrganizationForm = () => {
    const [ready, setReady] = useState(false);
    const client = useClient();
    const history = useHistory();
    const groups = useGroups();
    const redirect = () => {
        history.goBack()
    }
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];

    const [formData, setFormData] = useState({
        label: '',
        description: '',
        group: "",
        tags: []
    });

    const submit = async () => {
        const response = await client.mutate(createOrganization({
            label: formData.label,
            description: formData.description,
            SamlGroupName: formData.group,
            tags: formData.tags
        }))
        if (!response.errors) {

        }
    }

    return (
        <div style={{margin: '3rem', width: `100%`, height: '1fr'}}>
            <div>
                {JSON.stringify(formData)}
            </div>
            <Grid
                style={{margin: '1rem', width: '100%'}}
                spacing={{y: '1rem'}}
                rows={'0.1fr 1fr'}
            >
                <GridElement
                    style={{width: '', borderBottom: '1px solid lightgrey'}}>
                    <Link to={`/organizations`}>
                        <small>{`<`} back to organizations</small>
                    </Link>
                    <Text.Title icon={<BsIcon.BsHouse/>} title={`Create org`}
                                breadcrumbs={`onboarding/organization/create`}/>
                </GridElement>
                <div style={{padding: '2rem', backgroundColor: 'rgba(0,0,0,0.03)', width: '40%'}}>
                    <Form error>
                        <Form.Field>
                            <label>Name</label>
                            <input placeholder=' Name'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Description</label>
                            <input placeholder='Description'/>
                        </Form.Field>
                        <Form.Field>
                            <label>Admin</label>
                            <Select placeholder='Select admin group' options={groupOptions}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Tags</label>
                            <TagEditor/>
                        </Form.Field>
                        <Message
                            error
                            header='Action Forbidden'
                            content='You can only sign up for an account once with a given e-mail address.'/>
                        <div>
                            <Button primary>Save</Button>
                            <Button secondary onClick={redirect}>Cancel</Button>
                        </div>
                    </Form>

                </div>
            </Grid>
        </div>
    );
};


const CollectionForm = () => {
    const client = useClient();
    const groups = useGroups();
    const groupOptions = groups ? groups.map((g) => {
        return {value: g, foo: g, label: g}
    }) : [];

    const saveit = async () => {
        return new Promise(function (resolve) {
            setTimeout(resolve.bind(null, {}), 1000)
        });
    }


    const create = async ({formData, success, fail}) => {
        /**
         const response = await client.mutate(createOrganization({
            label : formData.label,
            description : formData.description,
            tags:formData.tags,
            SamlGroupName:formData.SamlGroupName.value
        }))
         **/
        const response = await saveit();
        if (!response.errors) {
            success({
                header: `Created collection  ${formData.label}`,
                content: `Successfully created collection`
            })
        } else {
            fail({
                header: "Could not save collection",
                content: `Error`
            })
        }
    }
    return <CreateForm
        ready={true}
        onSubmit={create}
        breadcrumbs={`| collections/create`}

        backLink={{
            label: '< back to collections',
            link: '/collections'
        }}
        icon={<BsIcon.BsHeart/>}
        title={`Create Collection`}
        submit={create}
        initialValues={{
            label: 'My new collection',
            description: 'Describe collection',
            SamlGroupName: groupOptions[0],
            tags: [],
        }}
        fields={[
            {
                type: FormFieldTypes.Input,
                label: 'Name',
                name: 'label',
                required: true,
            },
            {
                type: FormFieldTypes.TextArea,
                required: true,
                label: 'Description',
                name: 'description',
                width: 16,
            },

            {
                type: FormFieldTypes.Select,
                required: true,
                label: 'Admins',
                name: 'SamlGroupName',
                options: groupOptions
            },
            {
                type: FormFieldTypes.Tags,
                label: 'Tags',
                name: 'tags'
            }
        ]}
    />
}
export default CollectionForm;
