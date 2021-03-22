import React, {useState, useEffect}  from "react";
import useClient from "../../../api/client";
import createAirflowProject from "../../../api/AirflowCluster/createAirflowProject";
import {Button, Form, Header, Icon, Input, Message, Modal} from "semantic-ui-react";
const ProjectForm = (workflow, fetchItems, setShowProjectForm) => {
    const client = useClient();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({"packageName":""});
    const submitForm = async () => {

                    fetchItems()
                    setShowProjectForm(false)


    };
    const handleChange = (e) => {
        setFormData({
            "packageName": e.target.value
        });
    }
    return <div>
        {error && <Message negative>
            <Message.Header>{error.header}</Message.Header>
            <p>{error.content}</p>
        </Message>
        }
        <Form>
            <Form.Field>
                <label>Package Name (lower case with no special characters)</label>
                <input placeholder='myproject' name={'packageName'} value={formData.packageName} onChange={(e)=>handleChange(e)}/>
            </Form.Field>

            <Form.Button
                type={'submit'}
                color={'blue'}
                onClick={submitForm}
                basic size={`mini`}
            >Create</Form.Button>
        </Form>

    </div>
};
export default ProjectForm;
