import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';
import useAuth from '../../hooks/useAuth';
import styled from "styled-components";
import * as Dropdown from "../dropdown";


const Circle=styled.div`
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  background-color: dodgerblue;
  color: white;
  display: grid;
  place-items: center;
  padding: 5px;
    
`
const UserMenu=(props)=>{
    const [userInfo, setUserInfo] = useState(null);
    const auth = useAuth();

    const signOut = async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
    };


    const fetchUserInfo = () => {
        setUserInfo(auth);
    };

    useEffect(() => {
        if (!userInfo) {
            fetchUserInfo();
        }
    }, [auth]);
    return <Dropdown.Dropdown width={'100%'}>
        <Dropdown.DropdownTitle>
            <div style={{display:'grid', placeItems:'center',columnGap:'7px',gridTemplateColumns:'0.2fr 1fr'}}>
                <Circle>{userInfo && userInfo.email[0]}</Circle>
                <div>{userInfo && userInfo.email}</div>
            </div>
        </Dropdown.DropdownTitle>
        <Dropdown.DropdownMenuItem eventKey={"k1"}>
            <div onClick={signOut}>Signout</div>
        </Dropdown.DropdownMenuItem>

    </Dropdown.Dropdown>
}


export default UserMenu;
