import React,{useState,useEffect} from "react";
import {Container, Spinner, Row, Col, Badge} from "react-bootstrap";
import Select from "react-select";
import * as Icon from "react-bootstrap-icons";
import {Link, Router, Switch,Route,useLocation,useHistory,useParams} from "react-router-dom";
import styled from "styled-components"
import {toast} from "react-toastify";
import useClient from "../../../api/client";
import getProject from "../../../api/Project/getProject";
import listProjectContributors from "../../../api/Project/listProjectContributors";
import updateProjectContributor from "../../../api/Project/updateProjectContributor";
import removeProjectContributor from "../../../api/Project/removeProjectContributor";
import ProjectContributorListItem from "./ProjectContributorListItem";
import dayjs from "dayjs"
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);


const Styled=styled.div`
height:100vh;
`
const ProjectContributorList= (props)=>{

    console.log("ProjectContributorList project=",props.project);
    let project = props.project
    let client =useClient();

    const options=[
        {label: 'Admin',value:'Admin'},
        {label: 'ReadWrite',value:'ReadWrite'},
        {label: 'DiscoverAll',value:'ReadWrite'},
        {label: 'ReadAll',value:'ReadWrite'},
    ];

    const removeContributor = async ({userName})=>{
        const res =await client.mutate(
            removeProjectContributor({userName,projectUri:props.project.projectUri})
        )
        if (!res.errors){
            toast(`Removed ${userName}`);
            const refresh = await client.query(listProjectContributors(props.project.projectUri));
            setContributors(refresh.data.getProject.contributors)

        }else {
            toast.error(`Could not remove of ${userName}, received ${res.errors[0].message}`)
        }
    }

    const updateProjectContributorRole=async ({userName,role})=>{
        const res =await client.mutate(
            updateProjectContributor({userName,role,projectUri:props.project.projectUri})
        )
        if (!res.errors){
            toast(`Update role of ${userName} to ${role}`,{hideProgressBar:true})
        }else {
            toast.error(`Could not change role of ${userName}, received ${res.errors[0].message}`)
        }
    }


    let [contributors, setContributors] = useState({count:0, nodes:[]})

    useEffect(()=>{
        if (client){
            console.log("==> listProjectContributors ...",project.projectUri);
            client
                .query(listProjectContributors(project.projectUri))
                .then((res)=>{
                    if (!res.errors){
                        setContributors(res.data.getProject.contributors)
                    }
                })
                .catch((err)=>{
                    console.log("err = ", err);
                })

        }
    },[client,project])
    return <Styled>
        <Container>
        <Row className={``}>
            <Col xs={8}>
                <h4><Icon.Person size={32}/> Contributors</h4>
            </Col>
            <Col xs={4}>
                <Link to={`newprojectcontributor`}>
                    <div className={"btn-sm btn bg-white border"}>Add Contributor</div>
                </Link>
            </Col>
        </Row>
        <Row className={`mt-4`}>
            <Col xs={12}>
                <table className={"table table-sm"}>
                    <thead>
                    <tr>
                        <th>User name</th>
                        <th>Env Role</th>
                        <th>Permission</th>
                        <th>Granted</th>

                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        contributors.nodes.map((permission)=>{
                            return <ProjectContributorListItem
                                key={permission.userName}
                                project={props.project}
                                updateContributorRole={updateProjectContributorRole}
                                removeContributor={removeContributor}
                                permission={permission}/>
                        })
                    }
                    </tbody>
                </table>
            </Col>
        </Row>
    </Container>
    </Styled>
}


export default ProjectContributorList;
