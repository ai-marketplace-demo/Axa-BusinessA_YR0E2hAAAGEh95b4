import React, {useState, useEffect} from "react";
import {Link, Switch, Route} from "react-router-dom";
import {Container, Row, Col,Spinner} from "react-bootstrap";
import {If, Then, Else} from "react-if";
import * as Icon from "react-bootstrap-icons";
import {toast} from "react-toastify";
import useClient from "../../api/client";
import getUserRoleInTenant from "../../api/Tenant/getUserRoleInTenant";
import listTenantAdministrators  from "../../api/Tenant/listTenantAdministrators";
import TenantAdminListItem from "./TenantAdminListItem";
import MainButton from "../../components/MainActionButton/MainButton";
import removeTenantAdmin  from "../../api/Tenant/removeTenantAdmin";

const TenantAdminList = (props)=>{
    let client= useClient();

    let [userRoleInTenant, setUserRoleInTenant] = useState('NoPermissions');
    let [tenantAdmins,setTenantAdmins] = useState({
        count:0,
        page:1,
        pages:1,
        hasNext: false,
        hasPrevious : false,
        nodes:[]
    })

    let [search, setSearch] = useState('');
    let [ready, setReady] = useState(false);

    const fetchUserRoleInTenant =async ()=>{
        const response = await client.query(getUserRoleInTenant());
        if (!response.errors){
            setUserRoleInTenant(response.data.getUserRoleInTenant)
        }else {
            toast(`Could not fetch user role in tenant, received ${response.errors[0].message}`)
        }
    }

    const handleSearch=async (e)=>{
        if (e.key === 'Enter') {
            if (tenantAdmins.page>1){
                setTenantAdmins({...tenantAdmins, page:1})
            }else {
                await fetchItems();
            }
        }

    }
    const fetchItems = async()=>{

        const response = await client.query(listTenantAdministrators({
            page: tenantAdmins.page,
            pageSize: 4,
            term : search
        }));
        if (!response.errors){
            setTenantAdmins({...response.data.listTenantAdministrators})
        }else {
            toast(`Could not retrieve admins, received ${response.errors[0].message}`)
        }
    }

    const fetchData = async()=>{
        await fetchUserRoleInTenant();
        await fetchItems();
        setReady(true);
    }

    const nextPage=()=>{
        if (tenantAdmins.hasNext){
            setTenantAdmins({...tenantAdmins, page:tenantAdmins.page+1})
        }
    }
    const previousPage=()=>{
        if (tenantAdmins.hasPrevious){
            setTenantAdmins({...tenantAdmins, page:tenantAdmins.page-1})
        }
    }

    const removeAdministrator=async(userName)=>{

        const response = await client.mutate(removeTenantAdmin(userName));
        if (!response.errors){
            toast(`Removed ${userName} from Tenant administrators`)
            if (tenantAdmins.page!=1){
                setTenantAdmins({...tenantAdmins,page:1})
            }else{
                await fetchItems() ;
            }
        }else{
            toast(`Could not removed ${userName} from tenant Administrators, received ${response.errors[0].message}`)
        }

    }
    useEffect(()=>{
        if (client){
            fetchData();
        }

    },[client, tenantAdmins.page])
    return <Container>
        <If condition={ready}>
            <Then>

                <Row>
                    <Col xs={10}>
                        <h3><Icon.PersonCheck/> Tenant administrators</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4}>
                        Found {tenantAdmins.count} admins
                    </Col>
                    <Col xs={6}>
                        <Row>
                            <Col className={`pt-2 text-right`} xs={1}>
                                <Icon.ChevronLeft onClick={previousPage}/>
                            </Col>
                            <Col className={`text-center`} xs={3}>
                                Page {tenantAdmins.page}/{tenantAdmins.pages}
                            </Col>
                            <Col className={`pt-2 text-left`} xs={3}>
                                <Icon.ChevronRight onClick={nextPage}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={2}>
                            <MainButton>
                                <Link style={{outline:'none'}} to={`/tenant-administrators/new-tenant-admin`}>
                                Add Admin
                                </Link>
                            </MainButton>
                    </Col>
                </Row>
                <Row className={`mt-2`}>
                    <Col xs={12}>
                        <input onKeyDown={handleSearch} value={search} onChange={(e)=>{setSearch(e.target.value)}} className={`form-control`}/>
                    </Col>

                </Row>
                <Row>
                    <Col xs={12}>
                        <table className={`table table-hover table-borderless table-sm`}>
                            <tr>
                                <th>
                                    Username
                                </th>
                                <th>
                                    Role
                                </th>
                                <th></th>
                            </tr>
                            <tbody>
                            {
                                tenantAdmins.nodes.map((tenantAdmin)=>{
                                    return <TenantAdminListItem
                                        onRemove={removeAdministrator}
                                        userRoleInTenant={userRoleInTenant}
                                        tenantAdmin={tenantAdmin}/>
                                })
                            }
                            </tbody>
                        </table>

                    </Col>
                </Row>

            </Then>
            <Else>
                 <Spinner animation={`border`} variant={`primary`}/>
            </Else>
        </If>


    </Container>
}


export default TenantAdminList;
