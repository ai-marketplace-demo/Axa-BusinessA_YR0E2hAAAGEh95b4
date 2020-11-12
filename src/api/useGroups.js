import React, {useState,useEffect} from "react";
import { Auth } from 'aws-amplify';
import config from "../config";
const useGroups=()=>{
    let [groups, setGroups] = useState(null);
    const fetchGroups= async()=>{
        //let session = await Auth.currentSession();
        const user =  await Auth.currentAuthenticatedUser();
        setGroups(user.signInUserSession.accessToken.payload["cognito:groups"])
    };


    useEffect(()=> {
        if (!groups){
            fetchGroups();
        }
    });
    return groups;
};

export default useGroups;
