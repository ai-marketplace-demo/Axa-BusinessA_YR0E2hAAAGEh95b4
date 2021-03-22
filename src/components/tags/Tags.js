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
const TagList = (props)=>{
    const [state,setState] = useState({
        inputValue: '',
        value: props.tags?props.tags.map((tag)=>{createOption(tag)}):[]
    });

    const components = {
        DropdownIndicator: null,
    };
    const handleChange = (value, actionMeta) => {
        console.log("handleChange = ", value);
        setState({...state, value:value});
    };
    const handleInputChange = (inputValue) => {
        console.log("handleInputChange = ", inputValue);
        setState({...state,inputValue: inputValue})
    };


    const handleKeyDown = (event) => {
        console.log("handleKeyDown", event.key)
        if (!state.inputValue) return;
        console.log("switch");
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                setState({
                    inputValue: '',
                    value: [...state.value, createOption(state.inputValue)],
                });
                event.preventDefault();
        }
    };
    return   <CreatableSelect
        components={components}
        inputValue={state.inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Type something and press enter..."
        value={state.value}
    />
}


export default TagList;
