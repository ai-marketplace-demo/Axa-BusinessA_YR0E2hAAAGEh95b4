import React, {useState} from "react";
import * as ReactIf from "react-if";

const Editable=({content,onSave,onChange})=>{
    const [isEditMode, setIsEditMode] = useState(false);
    const handleKeyPress=(e)=>{
        if(e.key === 'Enter'){
            setIsEditMode(false);
            onSave&&onSave();
        }
    }

    return <ReactIf.If condition={isEditMode}>
        <ReactIf.Then>
            <input
                style={{border:'none',borderBottom:'1px solid lightgrey'}}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                value={content}
            />
        </ReactIf.Then>
        <ReactIf.Else>
            <div onClick={()=>{setIsEditMode(true)}}>{content}</div>
        </ReactIf.Else>
    </ReactIf.If>
}


export default Editable;
