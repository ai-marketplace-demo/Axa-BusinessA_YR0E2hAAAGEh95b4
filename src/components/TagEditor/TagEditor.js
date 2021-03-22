import  {useState,useEffect} from "react";
import * as ReactIf from "react-if";
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
const createOption = (label) =>{
    return {
        label,
        value: label,
    }
};
const TagList = ({name,tags,disabled,onChange})=>{
    const [state,setState]=useState({
        inputValue:''
    });

    const components = {
        DropdownIndicator: null,
    };

    const handleChange = (value, actionMeta) => {
        onChange({target:{name:name,value:value.map(v=>v.label)}});
    };

    const handleInputChange = (inputValue) => {
        setState({...state,inputValue:inputValue});
    };

    const handleKeyDown = (event) => {
        if (!state.inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                onChange({target:{name:name,value:[...tags, state.inputValue]}});
                setState({inputValue: ''});
                event.preventDefault();
        }
    };
    return <CreatableSelect
            components={components}
            inputValue={state.inputValue}
            isDisabled={disabled}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type something and press enter..."
            value={tags ? tags.map(t=>createOption(t)) : []}
        />
}

export default TagList;
