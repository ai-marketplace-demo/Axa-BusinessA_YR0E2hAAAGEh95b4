import React, {useEffect,useState} from "react";
import Search from "../Search/Search";
import Zoom from "../Zoomer/Zoom";
import {Link} from "react-router-dom";
import {Row, Col} from "react-bootstrap"
import Avatar from 'react-avatar';
import useClient from "../../api/client";
import { Auth } from 'aws-amplify';
import * as Icon from "react-bootstrap-icons";
const Header=(props)=>{
    const [userInfo, setUserInfo] = useState(null);
    let email=(userInfo)?userInfo.attributes['email']:"";
    let name=(userInfo)?userInfo.username:"";
    let client = useClient();
    console.log("CLIENT HEADER", client);
    const fetchUserInfo = async()=>{
        if(!userInfo){
            let currentUser = await Auth.currentUserInfo();
            setUserInfo(currentUser);
        }
    };
    console.log("USERINFO", fetchUserInfo)
    useEffect(() => {
        if(!userInfo){
            fetchUserInfo();
        }
    }, [userInfo]);

    const signOut = () => {
        Auth.signOut()
            .then(data => console.log(data))
            .catch(err => console.log(err));
    };

    return <Row>
        <Col xs={3}>
            <Row>
                <Col xs={12}><h3>[d]atahub</h3></Col>
                <Col xs={12}>
                    <p>simplified cloud analytics</p>
                </Col>
            </Row>
        </Col>
        <Col className={"pt-2"} xs={4}>
            <Search placeholder={'search anything'}/>
        </Col>
        <Col className={"pt-2"} xs={1}>
            <Link to={`getstarted`}>
                <Zoom origin={"center"} color={`blue`} scale={1.1}>
                    <Avatar textMarginRatio={0.41} color={"lightblue"} size={32} round="50%" value={"+"}></Avatar>
                </Zoom>
            </Link>
        </Col>
        <Col xs={3} className={"pt-2 text-4xl"} >
            <Zoom color={`blue`}>
                {/**<Avatar color={"lightblue"} size={36} round="50%" name={userInfo.email||'un'}></Avatar>**/}
                <Link to={`/profile`}>
                    {email}
                </Link>
            </Zoom>
        </Col>
        <Col xs={1} className={"pt-3 text-3xl"}>
            <Icon.ArrowBarRight size={22} onClick={signOut}/>
        </Col>
    </Row>
};

export default Header;
