import React,{useState} from "react";
import {If, Then ,Else} from "react-if";
import {Badge} from "react-bootstrap";

const SharedItem = (props)=>{
    const [enabled,setEnabled] = useState(true);
    const item = props.item;
    return <tr>
        <td>{item.itemName}</td>
        <td>{item.itemType}</td>
        <td>
            <Badge pill className={`border bg-secondary`}>
                {item.status}
            </Badge>
        </td>
        <td>
            <Badge pill className={`border bg-secondary`}>
                {item.action}
            </Badge>
        </td>
        <td>
            <If condition={item.status!="PendingApproval"}>
                <Then>
                <If condition={enabled}>
                    <Then>
                        <div onClick={()=>{setEnabled(false);props.remove(item)}} style={{width:`4rem`}} className={`btn btn-sm btn-secondary rounded-pill`}>
                            Remove
                        </div>
                    </Then>
                    <Else>
                        <div style={{width:`4rem`}} className={`btn disabled btn-sm btn-secondary rounded-pill`}>
                            Remove
                        </div>
                    </Else>
                </If>
                </Then>
                <Else>
                    <div style={{width:`4rem`}} className={`btn disabled btn-sm btn-secondary rounded-pill`}>
                        Remove
                    </div>
                </Else>
            </If>
        </td>
    </tr>
}


export default SharedItem;
