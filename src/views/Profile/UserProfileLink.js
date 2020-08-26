import React from "react";
import {Link} from "react-router-dom";


const UserProfileLink = (props)=>{
    return <Link style={{color:`blue`}} to={{
        state:{
            username:props.username
        },
        pathname:`/profile`
    }}>{props.username}</Link>
}

export default UserProfileLink;
