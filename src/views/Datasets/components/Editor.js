import React, {useState} from "react";
import * as Form from "../../../components/form"
import FormFieldTypes from "../../../components/form/FormFieldTypes";
import TopicsData from "../../../components/topics/TopicsData";
import updateDatataset from "../../../api/Dataset/updateDataset";


const Editor = ({dataset, client,editable}) => {

    const resolveBusinessOwners = () => {
        const bos = [];
        dataset.businessOwnerDelegationEmails.map((s) => {
            bos.push({label:s, value:s})
        })
        return bos;
    }

    const [businessOwnerDelegationEmails, setBusinessOwnerDelegationEmails] = useState(resolveBusinessOwners());

    const onSubmit = async ({formData, success, fail}) => {
        console.log(">>>>>>>>>>", formData)
        const input = {
                label: formData.label,
                description: formData.description,
                tags: formData.tags,
                topics: formData.topics.map((t) => {
                    return t.value
                }),
                terms:formData.terms.map(t=>t.value),
                businessOwnerDelegationEmails: formData.businessOwnerDelegationEmails ? formData.businessOwnerDelegationEmails.map((s) => {
                    return s.value
                }) : [],
                businessOwnerEmail: formData.businessOwnerEmail,

            }
        const response = await client.mutate(updateDatataset({
            datasetUri: dataset.datasetUri,
            input
        }))
        if (!response.errors) {
            success({
                header: 'Success',
                content: `Successfully updated dataset ${dataset.datasetUri}`
            })
        } else {
            fail({
                header: 'Failed updating',
                content: `Could not update dataset, received ${response.errors[0].message}`
            })
        }

    }


    const resolveEnvironment = (formData) => {
        if (formData) {
            return formData.environment.label;
        } else {
            return "";
        }
    }
    const resolveOrganization = (formData) => {
        if (formData.environment && formData.environment.organization) {
            return formData.environment.organization.label
        } else {
            return ""
        }
    }



    const resolveRegion = (formData) => {
        if (formData.environment && formData.environment.region) {
            return formData.environment.region
        } else {
            return ""
        }
    }

    const isEditable = (d) => {
        if (!d) {
            return false
        } else {
            if (["Creator", "Admin", "Owner", "BusinessOwner"].indexOf(d.userRoleForDataset) != -1) {
                return true
            } else {
                return false
            }
        }

    }

    return <div>{businessOwnerDelegationEmails && <Form.EditForm
        onSubmit={onSubmit}
        client={isEditable(dataset)}
        editable={true}
        initialValues={
            {...dataset, businessOwnerDelegationEmails}
        }

        fields={[

            {
                items: [
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'userRoleForDataset',
                        label: "Role",
                        width: 4,
                        icon: 'shield'

                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        width: '4',
                        name: 'owner',
                        label: "Created by",
                        icon: 'user'
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        width: '4',
                        name: 'created',
                        label: "Created",
                        icon: 'calendar'
                    },
                    {
                        type: Form.FormFieldTypes.Input,
                        editable: false,
                        name: 'SamlAdminGroupName',
                        label: "Admins",
                        width: '4',
                        readOnly: true,
                        icon: 'group'
                    },


                ]
            },
            {
                items: [
                    {
                        type: FormFieldTypes.Input,
                        label: 'Environment',
                        width: "6",
                        value: resolveEnvironment,
                        readOnly: true,
                        icon: 'cloud'
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Region',
                        name: 'region',
                        width: '6',
                        readOnly: true,
                        value: resolveRegion,
                        icon: 'globe'
                    },
                    {
                        type: FormFieldTypes.Input,
                        label: 'Organization',
                        name: 'organization',
                        width: '6',
                        readOnly: true,
                        icon: 'boxes',
                        value: resolveOrganization
                    },
                ]
            },
            {
                items: [
                    {
                        type: FormFieldTypes.Input,
                        label: 'Business Owner',
                        name: 'businessOwnerEmail',
                        width: 8,
                        editable: true,
                    },

                    {
                        type: FormFieldTypes.MultiSelect,
                        label: 'Stewards',
                        width: 8,
                        options: businessOwnerDelegationEmails,
                        name: 'businessOwnerDelegationEmails',
                        editable:true
                    },

                ]
            },
            {
                type: Form.FormFieldTypes.Input,
                name: 'label',
                label: "Name",
                icon: 'info',
                editable: true,
            },
            {
                type: Form.FormFieldTypes.TextArea,
                name: 'description',
                label: "Description",
                editable: true,
                icon: 'info'
            },
            {
                type: Form.FormFieldTypes.Term,
                editable: true,
                name: 'terms',
                width: 8,
                label: "Terms"
            },
            {
                items: [
                    {
                        type: Form.FormFieldTypes.Tags,
                        editable: true,
                        name: 'tags',
                        width: 8,
                        label: "Tags"
                    },
                    {
                        type: FormFieldTypes.MultiSelect,
                        label: 'Topics',
                        width: '8',
                        name: 'topics',
                        editable: true,
                        options: TopicsData

                    },


                ]
            }
        ]}
    />}</div>
}

export default Editor;
