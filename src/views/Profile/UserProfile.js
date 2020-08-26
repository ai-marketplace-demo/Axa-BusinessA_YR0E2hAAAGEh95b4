import React, {useState, useEffect} from "react";
import {Spinner,Row, Col,Container,Badge} from "react-bootstrap";
import styled from "styled-components";
import {toast} from "react-toastify";
import * as Icon from "react-bootstrap-icons";
import {If, Then,Else} from "react-if";
import Select from "react-select";
import ReactTagInput from "@pathofdev/react-tag-input";
import EasyEdit, {Types} from 'react-easy-edit';
import {Route, Switch, Link, useLocation} from "react-router-dom";
import Tag from "../../components/Tag/Tag";
import useClient from "../../api/client";
import getUserProfile from "../../api/UserProfile/getUserProfile";
import updateUserProfile from "../../api/UserProfile/updateUserProfile";
import ApiKeyList from "./ApiKeys";

const UserProfile = (props)=>{
    let location = useLocation();
    let client = useClient();
    let [editModeEnabled, setEditModeEnabled]= useState(false);

    let [profile, setProfile] = useState({
        username:'', b64EncodedAvatar:'', bio:'', tags:[]
    })

    let [readyOnly, setReadOnly] = useState(true);
    let [changed, setChanged] = useState(false);

    const setTags=(tags)=>{
        setChanged(true);
        setProfile({...profile, tags:tags});
    }


    const saveUserProfile= async ()=>{
        const response = await client.mutate(updateUserProfile({
            bio : profile.bio, tags:profile.tags
        }));
        if (!response.errors){
            toast(`Saved profile`);
        }else{
            toast(`Could not retrieve your profile, received ${response.errors.message}`)
        }
    }
    const fetchUserProfile=async ()=>{
        let response ;
        if (location&&location.state&&location.state.username){
            response = await client.query(getUserProfile(location.state.username))            ;
        }else{
            response = await client.query(getUserProfile());
            setReadOnly(false);
        }
        if (!response.errors){
            let data=response.data.getUserProfile;
            setProfile({username:data.username,tags:data.tags, bio:data.bio,created:data.created,updated:data.updated})
        }else{
            toast(`Could not retrieve  profile, received ${response.errors.message}`)
        }
    }

    useEffect(()=>{
        if (client){
            fetchUserProfile()
        }
    },[client])

    return <Container>
        <Row>
            <Col xs={2}>
                <Row>
                    <Col xs={12}>
                        <Link style={{outline:'none', color:'black'}}
                              to={"/profile"}>
                            My Profile
                        </Link>
                    </Col>
                </Row>
                <If condition={!readyOnly}>
                    <Then>
                        <Row>
                            <Col xs={12}>
                                <Link style={{outline:'none', color:'black'}}
                                      to={"/profile/apikeys"}>
                                    Api Keys
                                </Link>
                            </Col>
                        </Row>
                    </Then>
                </If>
            </Col>
            <Col xs={10}>
                <Switch>
                    <Route path={`/profile/apikeys`}>
                        <If condition={!readyOnly}>
                            <Then>
                                <ApiKeyList/>
                            </Then>
                        </If>
                    </Route>
                    <Route path={`/profile`}>
                        <Row>
                            <Col xs={8}>
                                <Row>
                                    <Col xs={12}>
                                        <b>Public email</b>
                                    </Col>
                                    <Col xs={8}>
                                        <h4>{profile.username}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <b>Bio</b>
                                    </Col>
                                    <Col xs={12}>
                                        <If condition={!readyOnly&&editModeEnabled}>
                                            <Then>
                                                <div onClick={()=>{setEditModeEnabled(false)}} className={``}>close</div>
                                                <textarea
                                                    rows="5"
                                                    value={profile.bio}
                                                    onChange={(e)=>{setChanged(true); setProfile({...profile, bio:e.target.value})}}
                                                    style={{
                                                        width:'100%',
                                                        paddingLeft:'1ch',
                                                        fontSize:'2ch',
                                                        border:'0',
                                                        borderLeft:'1px solid gray',
                                                        resize: "none"}}
                                                    className={``}>
                                                </textarea>
                                            </Then>
                                            <Else>
                                                <If condition={!readyOnly}>
                                                    <Then>
                                                        <div onClick={()=>{setEditModeEnabled(true)}} className={``}>edit</div>
                                                    </Then>
                                                </If>
                                                <textarea
                                                    rows="5"
                                                    value={profile.bio}
                                                    disabled={true}
                                                    style={{
                                                        backgroundColor:`white`,
                                                        width:'100%',
                                                        fontSize:'2ch',
                                                        border:'0',
                                                        resize: "none"}}
                                                    className={``}>
                                                </textarea>
                                            </Else>
                                        </If>

                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <b>Interests</b>
                                    </Col>
                                    <Col xs={12}>
                                        <If condition={readyOnly}>
                                            <Then>
                                                {
                                                    profile.tags.map((tag)=>{
                                                        return <Tag tag={tag}/>
                                                    })
                                                }

                                            </Then>
                                            <Else>
                                                <ReactTagInput
                                                    tags={profile.tags}
                                                    onChange={setTags}
                                                />
                                            </Else>
                                        </If>

                                    </Col>
                                </Row>

                            </Col>
                            <Col xs={4}>
                                <Row>
                                    <Col xs={12}>
                                        <div style={{
                                            maxHeight:'2em',
                                            height:'2em',
                                            maxWidth:'2em',
                                            borderRadius:'1em',
                                            paddingTop:'0.35em',
                                            backgroundColor:'lightblue',
                                            fontSize:'3rem',
                                            fontFamily:'Calibri',
                                            textAlign:'center',
                                            _border: '1px solid gray'
                                        }}>
                                            {profile.username&&profile.username[0].toUpperCase()}
                                        </div>
                                        {/**
                                        <Avatar
                                            style={{width: '100px', height: '100px'}}
                                            avatarStyle='Circle'
                                            {...avatarProps}
                                        />
                                         **/}
                                    </Col>
                                </Row>

                            </Col>
                        </Row>
                        <If condition={!readyOnly}>
                            <Then>
                                <Row className={`mt-5`}>
                                    <Col xs={12}>
                                        <If condition={changed}>
                                            <Then>
                                                <div className={`btn btn-primary btn-sm`} onClick={saveUserProfile}>Save Changes</div>
                                            </Then>
                                        </If>
                                    </Col>
                                </Row>
                            </Then>
                        </If>
                    </Route>
                </Switch>

            </Col>
        </Row>
    </Container>

}


export default UserProfile;
