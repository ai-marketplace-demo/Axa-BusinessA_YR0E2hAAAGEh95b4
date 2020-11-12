import React, {useState, useEffect} from "react";
import Select from 'react-select';
import useGroups from "../../api/useGroups";
import * as Icon from "react-bootstrap-icons";

const SelectGroup = (props)=>{
    const groups = useGroups();

    return <Select
        value={props.value}
        onChange={props.onChange}
        options={(groups&&groups||[]).map((g)=>{return {value:g, label:<div className={`text-capitalize`}><Icon.PeopleFill className={`pr-1`}/> {g}</div>}})}
    />
}

export default SelectGroup
