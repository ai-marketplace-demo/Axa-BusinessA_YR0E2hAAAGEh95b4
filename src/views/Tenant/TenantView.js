import React, { useState, useEffect } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import useClient from '../../api/client';
import getUserRoleInTenant from '../../api/Tenant/getUserRoleInTenant';
import listTenantAdministrators from '../../api/Tenant/listTenantAdministrators';
import TenantAdminList from './TenantAdminList';
import NewTenantAdminForm from './NewTenantAdminForm';

const TenantView = (props) => (
    <Switch>
        <Route path={'/tenant-administrators/new-tenant-admin'}>
            <NewTenantAdminForm />
        </Route>
        <Route path={'/tenant-administrators'}>
            <TenantAdminList />
        </Route>
    </Switch>
);


export default TenantView;
