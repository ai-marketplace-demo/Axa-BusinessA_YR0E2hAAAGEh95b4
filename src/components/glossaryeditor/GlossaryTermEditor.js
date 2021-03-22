import {useEffect, useState} from "react";
import AsyncSelect from 'react-select/async';
import searchGlossary from "../../api/Glossary/searchGlossary";
import useClient from "../../api/client";

const customStyles = {
    option: (provided, state) => {
        return {
            ...provided,
            paddingLeft: `${state.data.nodePath.split("/").length}ch`
        }
    }
}
const createOption = (t) => {
    return {label: t.label, nodeUri: t.nodeUri, value: t.nodeUri}
}
const TermEditor = ({terms, name,client, isDisabled,onChange}) => {
    const promiseTerms = (inputValue) => {
        return new Promise(resolve => {
            const response = client.query(searchGlossary());
            response.then((result)=>{
                if (result.data.searchGlossary && result.data.searchGlossary.nodes.length > 0) {
                    const selectables = result.data.searchGlossary.nodes.map((node) => {
                        if(node) {
                            return {
                                label: node.label,
                                value: node.nodeUri,
                                nodeUri: node.nodeUri,
                                disabled: node.__typename == "Term" ? false : true,
                                nodePath: node.path
                            }
                        }
                    })
                    resolve(selectables);
                }
            })
        })
    }
    const handleChange = (s, action) => {
        onChange && onChange({target: {name:name,value: s}});
    }
    return       <AsyncSelect
        isMulti
        cacheOptions
        isDisabled={isDisabled}
        styles={customStyles}
        onChange={handleChange}
        value={terms.map(t => createOption(t))}
        isOptionDisabled={opt => opt.disabled}
        defaultOptions
        loadOptions={promiseTerms}
    />
    return    <AsyncSelect
        //onChange={handleChange}
        isMulti
        cacheOptions
        defaultOptions
        //styles={customStyles}
        //value={terms.map(t => createOption(t))}
        //isOptionDisabled={opt => opt.disabled}
        loadOptions={promiseTerms}
    />

}

const Example = ()=>{
    const [ready, setReady]= useState(false);
    const [terms, setTerms] = useState([{value:'a',label:'a'}])
    const client = useClient();

    const onChange=(e)=>{
        setTerms(e.target.value);
    }

    useEffect(()=>{
        if (client){
            setReady(true)
        }
    },[client])
    if (!ready){
        return <div></div>
    }
    return <TermEditor onChange={onChange} terms={terms} name={`terms`} client={client}/>
}
export default TermEditor;
