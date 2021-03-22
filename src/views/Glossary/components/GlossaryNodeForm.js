import {useState, useEffect} from "react";
import {Button,Form,Message,Icon} from "semantic-ui-react";
import * as BsIcon from "react-icons/bs"
import {If, Then, Else} from "react-if";
import updateCategory from "../../../api/Glossary/updateCategory";
import updateTerm from "../../../api/Glossary/updateTerm";
import updateGlossary from "../../../api/Glossary/updateGlossary";
import addCategory from "../../../api/Glossary/addCategory";
import addTerm from "../../../api/Glossary/addTerm";


const GlossaryNodeForm = ({client,data,isNew,cancel,nodeType, refresh})=>{
    const [formData, setFormData] = useState(data);
    const [loading, setLoading] = useState(false);
    const [editMode,setEditMode] = useState(true);
    const [isEditForm,setIsEditForm] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(()=>{
        setFormData(data);
        setIsEditForm(!isNew)
    },[data,nodeType,isNew]);

    const closeForm=()=>{
        cancel&&cancel();
    }

    const handleChange=(e)=>{
        setFormData({...formData,[e.target.name] : e.target.value})
    }


    const closeMessages=()=>{
        setError(null);
        setSuccess(null);
        cancel&&cancel();
        refresh&&refresh();
    }

    const save=async ()=>{
        setLoading(true);
        let mutation;
        let response;
        if (isEditForm){
            if (data.__typename=="Term"){
                mutation= updateTerm;

            }else if (data.__typename=="Category"){
                mutation = updateCategory;
            }else if (data.__typename=="Glossary"){
                mutation = updateGlossary;
            }
             response = await client.mutate(mutation({
                nodeUri : data.nodeUri,
                input:{
                    label : formData.label,
                    readme: formData.readme
                }
            }))
        }else {
            if (nodeType==="Term"){
                mutation = addTerm;
            }else if (nodeType==="Category"){
                mutation = addCategory
            }
            response = await client.mutate(mutation({
                parentUri: data.nodeUri,
                input:{
                    label : formData.label,
                    readme : formData.readme
                }
            }))
        }
        if (!response.errors){
            setSuccess({message:"Successfully modified glossary node"})
        }else {
            setError({
                message: "Failed modifying glossary node"
            })
        }
        setLoading(false);
        refresh&&refresh();
    }

    return <div style={{borderRight:'1px'}}>
        <h5>{nodeType}</h5>
        <Form loading={loading}>
        <If condition={error}>
            <Then>
                <Message negative>
                    <Message.Header>We're sorry we can't apply that discount</Message.Header>
                    <p>That offer has expired</p>
                    <Button onClick={closeMessages}> Close</Button>
                </Message>
            </Then>
        </If>
        <If condition={success}>
            <Then>
                <Message positive>
                    <Message.Header>Success</Message.Header>
                    <p>Successfully ... node</p>
                    <Button onClick={closeMessages}> Close</Button>
                </Message>
            </Then>
        </If>
                <div>
                    <If condition={formData.__typename=="Term"}>
                        <Then>
                            <Icon name={`file alternate outline`}/>
                        </Then>
                    </If>
                </div>


                <Form.Field disabled={!editMode} required>
                    <label>Name</label>
                    <input name={"label"} onChange={handleChange} value={formData.label} placeholder={formData.label} />
                </Form.Field>
                <Form.Field  disabled={!editMode} required>
                    <label>Readme</label>
                    <textarea name={"readme"} onChange={handleChange} value={formData.readme} placeholder={formData.readme} />
                </Form.Field>
                <Button primary onClick={save}>Save</Button>
                <Button onClick={closeForm}>Cancel</Button>
            </Form>
    </div>

}

export default GlossaryNodeForm;
