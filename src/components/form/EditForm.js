import {Form,Button,TextArea,Dimmer,Loader,Segment,Message} from "semantic-ui-react";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import React, {useState} from "react";
import {FormLayout,FormTitleLayout} from "./styles";
import {Link,useHistory} from "react-router-dom";
import CreateFormField from "./FormField";
import styled from "styled-components";

const EditFormLayout=styled.div`
    display:grid;
  //box-shadow: 7px 5px 3px 1px rgba(0, 0, 0, 0.03);
  //background-color: rgba(0,0,0,0.01);
  //border: 1px lightgrey solid;
    padding: 1rem;
    width:100%;
    grid-template-rows: 1fr 0.2fr;
`


const Messages=({messages})=>{

}
const EditForm = ({editable,icon,breadcrumbs,onSubmit,backLink,title,fields,initialValues,ready,client,...props})=>{
    const history = useHistory();
    const [state,setState] = useState({
        submitting:false,
        hasFailed:false,
        edit:false,
        showMessages:true,
        hasSucceeded:false,
        success: {header:null, content:null},
        error: {header:null, content:null}
    });
    const [formData,setFormData]= useState(initialValues);
    const fail=(error)=>{
         setState({...state,submitting:false,showMessages:true,hasSucceeded:false,hasFailed:true,error:error});
    }
    const success= (response)=>{
        setState({...state,submitting:false,showMessages:true,hasFailed:false,hasSucceeded:true,success:response})
    }
    const save=  async (e)=>{
        setState({...state,submitting: true});
         await onSubmit({formData,fail,success});
    };

    const handleChange= (e)=>{
        setFormData({...formData,[e.target.name]: e.target.value})
    }
    return <EditFormLayout>
        <Form
            loading={state.submitting}
            error={state.error}>
            <If condition={state.showMessages}>
                <Then>
                    <Switch>
                        <Case condition={state.error.header}>
                            <Message
                                error={state.hasFailed}
                                header={state.error&&state.error.header}
                                content={state.error&&state.error.content}
                            />
                        </Case>
                        <Case condition={state.hasSucceeded}>
                            <Message
                                positive={state.hasSucceeded}
                            >
                                <Message.Header>{state.success&&state.success.header}</Message.Header>
                                <p>{state.success&&state.success.content}</p>
                                <Button
                                    success
                                    onClick={()=>{setState({...state,showMessages: false})}}>
                                    Close
                                </Button>
                            </Message>
                        </Case>
                    </Switch>
                </Then>
            </If>

            {
                fields.map((field)=>{
                    return <If condition={!field.items}>
                        <Then>
                            <If condition={field.editable}>
                                <Then>
                                    <CreateFormField
                                        {...field}
                                        client={client}
                                        onChange={ handleChange}
                                        value={field.value?field.value(formData):formData[field.name]}
                                        readOnly={!state.edit}/>
                                </Then>
                                <Else>
                                    <CreateFormField
                                        {...field}
                                        client={client}
                                        onChange={ handleChange}
                                        value={field.value?field.value(formData):formData[field.name]}
                                        readOnly={true}/>
                                </Else>
                            </If>

                        </Then>
                        <Else>
                            <Form.Group>
                            {
                                field.items&&field.items.map((item)=>{
                                    return <If condition={item.editable}>
                                        <Then>
                                            <CreateFormField
                                                {...item}
                                                client={client}
                                                onChange={ handleChange}
                                                value={item.value?item.value(formData):formData[item.name]}
                                                readOnly={!state.edit}/>
                                        </Then>
                                        <Else>
                                            <CreateFormField
                                                {...item}
                                                client={client}
                                                onChange={ handleChange}
                                                value={item.value?item.value(formData):formData[item.name]}
                                                readOnly={true}/>
                                        </Else>

                                    </If>
                                })
                            }
                            </Form.Group>
                        </Else>
                    </If>

                })
            }
        </Form>
        <div style={{marginTop:'1rem'}}>
            <If condition={editable}>
                <Then>
                    <If condition={state.edit}>
                        <Then>
                            <Button onClick={save} primary>
                                Save
                            </Button>
                            <Button onClick={()=>{setState({...state,edit:false})}}>
                                Cancel
                            </Button>
                        </Then>
                        <Else>
                            <Button onClick={()=>{setState({...state,edit:true})}} primary>
                                Edit
                            </Button>
                        </Else>

                    </If>
                </Then>
            </If>

        </div>
        <div>
            {
                React.Children.map(props.children,(child)=>{
                    return child
                })
            }
        </div>
    </EditFormLayout>
}


export default EditForm;
