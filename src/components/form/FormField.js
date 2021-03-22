import FormFieldTypes from "./FormFieldTypes";
import {Form} from "semantic-ui-react";
import TagEditor from "../TagEditor/TagEditor";
import TermEditor from "../glossaryeditor/GlossaryTermEditor";
import Select from "react-select";
//import CreatableSelect  from "react-select";
import Creatable from 'react-select/creatable';
import React from "react";

const CreateFormField = ({options,readOnly,icon,required,disabled,width,type,placeholder,onChange,label,name, value,client})=>{
    if (type===FormFieldTypes.Input){
        return <Form.Input
            fluid
            border={`none`}
            size={`small`}
            icon={icon}
            iconSize={`small`}
            iconPosition={`left`}
            label={label}
            name={name}
            readOnly={readOnly}
            placeholder={placeholder}
            disabled={disabled}
            width={width?width:'16'}
            value={value}
            onChange={onChange}
            required={required}
        />

    }else if(type===FormFieldTypes.TextArea){
        return <Form.Field
            icon={icon}
            iconSize={`small`}
            iconPosition={`left`}
            readOnly={readOnly}
            disabled={disabled}
            required={required}
            width={width}>
            <label>{label}</label>
            <textarea
                style={{resize:'none',height:'3rem'}}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                placeholder={placeholder}
            />
        </Form.Field>

    }else if(type===FormFieldTypes.Tags){
        return <Form.Field width={width}>
            <label>{label}</label>
            <TagEditor disabled={readOnly} name={name} tags={value} onChange={(e)=>{console.log("rcvd ", e); onChange(e)}}/>
        </Form.Field>
    }else if (type===FormFieldTypes.Select){
        return <Form.Field disabled={disabled}  required={required} width={width}>
            <label>{label}</label>
            <Select isDisabled={readOnly}
                    value={value}
                    name={name}
                    options={options}
                    onChange={(e)=>{onChange({target:{name:name, value:e}})}}/>
        </Form.Field>

    }else if (type==FormFieldTypes.MultiSelect){
        console.log(">",FormFieldTypes.MultiSelect)
        return <Form.Field disabled={disabled}  required={required} width={width}>
            <label>{label}</label>
            <Creatable
                isClearable
                isDisabled={readOnly}
                isMulti
                name={name}
                options={options}
                value={value}
                onChange={(s)=>{
                    onChange({target:{name:name, value:s}})}
                }/>
        </Form.Field>
    }else if (type===FormFieldTypes.Term){
        return <Form.Field>
            <label>{label}</label>
            <TermEditor
            name={name}
            isDisabled={readOnly}
            terms={value}
            client={client}
            onChange={onChange}
        />
        </Form.Field>
    }

}

export default CreateFormField;
