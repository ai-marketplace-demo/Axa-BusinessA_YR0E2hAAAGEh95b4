import {Form,Button,Placeholder,TextArea,Dimmer,Loader,Segment,Message} from "semantic-ui-react";
import {If,Then,Else,Switch,Case,Default} from "react-if";
import React, {useState} from "react";
import {FormLayout,FormTitleLayout} from "./styles";
import {Link,useHistory} from "react-router-dom";
import CreateFormField from "./FormField";

const CreateForm = ({icon,breadcrumbs,onSubmit,backLink,title,fields,initialValues,ready,messages})=>{
    const history = useHistory();
    const [state,setState] = useState({
        submitting:false,
        hasFailed:false,
        hasSucceeded:false,
        success: {header:null, content:null},
        error: {header:null, content:null}
    });
    const fail=(error)=>{
         setState({...state,submitting:false,hasSucceeded:false,hasFailed:true,error:error});
    }
    const success= (response)=>{
        setState({...state,submitting:false,hasFailed:false,hasSucceeded:true,success:response})
    }
    const [formData,setFormData]= useState(initialValues);

    const save=(e)=>{
        setState({...state,submitting: true})
        onSubmit({formData,fail,success})
    };
    const back=()=>{
        history.push(backLink.link);
    }


    const handleChange= (e)=>{
        console.log("received", e.target.name,e.target.value);
        setFormData({...formData,[e.target.name]: e.target.value})
    }
    if (!ready){
        return <Loader active/>
    }
    return <div>
        <FormLayout>
            <If condition={!ready}>
                <Then>
                    <Dimmer active>
                        <Loader />
                    </Dimmer>
                </Then>
                <Else>
                    <div>
                        <Link style={{color:'blue'}} to={backLink.link}>
                            {backLink.label}
                        </Link>
                    </div>
                    <FormTitleLayout>
                        {icon}
                        <div style={{color:'dodgerblue',fontSize:'xx-large'}}><b>{title}</b></div>
                        <div style={{fontWeight:'lighter',fontSize:'small'}}>{breadcrumbs}</div>

                    </FormTitleLayout>
                    {(messages &&
                        <div style={{
                            padding:'1rem'}}>{messages}</div>
                    )}
                    <div
                        style={{
                            padding:'1rem'}}>
                        <Form
                            loading={state.submitting}
                            error={state.error}>
                            <Switch>
                                <Case condition={state.error.header}>
                                    <Message
                                        error={state.hasFailed}
                                        header={state.error&&state.error.header}
                                        content={state.error&&state.error.content}
                                        list={state.error&&state.error.list}
                                    />
                                </Case>
                                <Case condition={state.hasSucceeded}>
                                    <Message
                                        positive={state.hasSucceeded}
                                    >
                                        <Message.Header>{state.success&&state.success.header}</Message.Header>
                                        <p>{state.success&&state.success.content}</p>
                                        <Button success onClick={back}>
                                            {backLink.label}
                                        </Button>
                                    </Message>
                                </Case>
                            </Switch>

                            {
                                fields.map((field)=>{
                                    if (!field.items){
                                        return <CreateFormField
                                            {...field}
                                            value={field.value?field.value(formData):formData[field.name]}
                                            disabled={state.hasSucceeded?true:field.disabled?true:false}
                                            onChange={handleChange}
                                        />
                                    }else {
                                        return <Form.Group>
                                            {
                                                field.items.map((item)=>{
                                                    return <CreateFormField
                                                        {...item}
                                                        disabled={state.hasSucceeded?true:item.disabled?true:false}
                                                        readOnly={item.readOnly}
                                                        value={item.value?item.value(formData):formData[item.name]}
                                                        onChange={handleChange}
                                                        required={item.required}
                                                    />
                                                })
                                            }
                                        </Form.Group>
                                    }
                                })
                            }


                        </Form>
                        <div style={{marginTop:'1rem'}}>
                            <If condition={!state.hasSucceeded}>
                                <Then>
                                    <Button type={`submit`} onClick={save} primary>
                                        Save
                                    </Button>
                                </Then>
                            </If>

                            <Button  onClick={back}>
                                Cancel
                            </Button>
                        </div>
                    </div>


                </Else>
            </If>
        </FormLayout>
    </div>
}


export default CreateForm;
