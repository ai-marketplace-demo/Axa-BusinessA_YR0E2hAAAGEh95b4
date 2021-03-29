import React, { useEffect, useState, useRef } from 'react';
import {Link, useParams, useHistory} from "react-router-dom";
import { Auth } from 'aws-amplify';
import useAuth from '../../hooks/useAuth';
import styled from "styled-components";
import * as Dropdown from "../dropdown";
import {Badge} from "@material-ui/core";
import useClient from "../../api/client";
import countUnreadNotifications from "../../api/Notification/countUnreadNotifications";


const Circle=styled.div`
  border-radius: 50%;
  width: 2.8rem;
  height: 2.8rem;
  background-color: dodgerblue;
  color: white;
  display: grid;
  place-items: center;
  padding: 5px;
    
`
const UserMenu=(props)=>{
    const auth = useAuth();
    const client = useClient();
    const mounted = useRef();
    const history = useHistory();
    const [countNotifications, setCountNotifications]= useState(1);
    const [time, setTime]= useState(null);
    const [userInfo, setUserInfo] = useState(null);


    const fetchUserInfo = () => {
        setUserInfo(auth);
    };

    const fetchCountNotifications = async () => {
        const response = await client.query(countUnreadNotifications());
        if (!response.errors) {
            setCountNotifications(response.data.countUnreadNotifications)
        }
        setTime((new Date()).getTime());
    };
    //FIXME: client not loaded yet
    useEffect(() => {
        if (!userInfo) {
            fetchUserInfo();
        }
        //fetchCountNotifications();
    }, [auth, client]);

    return <Dropdown.Dropdown width={'100%'}>
        <Dropdown.DropdownTitle>
            <div onClick={() =>{history.push('/profile/notifications')}} style={{display:'grid', placeItems:'center',columnGap:'7px',gridTemplateColumns:'0.2fr 1fr'}}>
                <Badge anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',

                }}color={'error'} variant={'dot'} badgeContent={countNotifications}><Circle>{userInfo && userInfo.email[0]}</Circle></Badge>
                <div>{userInfo && userInfo.email}</div>
            </div>
        </Dropdown.DropdownTitle>
    </Dropdown.Dropdown>
}


export default UserMenu;
