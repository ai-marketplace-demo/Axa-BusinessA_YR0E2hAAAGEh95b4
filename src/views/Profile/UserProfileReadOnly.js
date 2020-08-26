import React, {useState, useEffect} from "react";
import {Spinner,Row, Col,Container,Badge} from "react-bootstrap";
import styled from "styled-components";
import {toast} from "react-toastify";
import ReactTagInput from "@pathofdev/react-tag-input";
import {Route, Switch, Link} from "react-router-dom";
import useClient from "../../api/client";
import getUserProfileByName from "../../api/UserProfile/getUserProfile";

const UserProfileReadOnly = (props)=>{
    let client = useClient();


    let [profile, setProfile] = useState({
        username:'', b64EncodedAvatar:'', bio:'', tags:[]
    })


    const fetchUserProfile=async ()=>{
        const response = await client.query(getUserProfile());
        if (!response.errors){
            let data=response.data.getUserProfile;
            setProfile({username:data.username,tags:data.tags, bio:data.bio,created:data.created,updated:data.updated})
        }else{
            toast(`Could not retrieve your profile, received ${response.errors.message}`)
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
                            About you
                        </Link>
                    </Col>
                </Row>
            </Col>
            <Col xs={10}>
                <Switch>

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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <b>Interests</b>
                                    </Col>
                                    <Col xs={12}>
                                        <ReactTagInput
                                            tags={profile.tags}
                                        />
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
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Route>
                </Switch>

            </Col>
        </Row>
    </Container>

}


export default UserProfileReadOnly;
