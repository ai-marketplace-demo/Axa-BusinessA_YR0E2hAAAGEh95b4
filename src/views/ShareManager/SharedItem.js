import React,{useState} from "react";
import {If, Then ,Else} from "react-if";
import {Badge, Col} from "react-bootstrap";
import ShareStatusBadge from "../../components/ShareStatusBadge/ShareStatusBadge";

const SharedItem = (props)=>{
    const [enabled,setEnabled] = useState(true);
    const item = props.item;
    return <tr>
        <td>{item.itemName}</td>
        <td>{item.itemType}</td>
        <td>
            <ShareStatusBadge status={item.status}/>
        </td>
        <td>
            <If condition={item.status!="PendingApproval"}>
                <Then>
                <If condition={enabled}>
                    <Then>
                        <Col xs={6}>
                            <div onClick={()=>{setEnabled(false);props.remove(item)}}
                             className={`btn btn-sm btn-danger rounded-pill`}>
                                Remove
                            </div>
                        </Col>
                    </Then>
                    <Else>
                        <div  className={`btn disabled btn-sm btn-secondary rounded-pill`}>
                            Remove
                        </div>
                    </Else>
                </If>
                </Then>
                <Else>
                    <Col xs={4}>
                        <div style={{width:`4rem`}} className={`btn disabled btn-sm btn-secondary rounded-pill`}>
                            Remove
                        </div>
                    </Col>
                </Else>
            </If>
        </td>
    </tr>
}


export default SharedItem;
