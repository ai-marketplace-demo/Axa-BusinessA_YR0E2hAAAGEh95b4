import React, { useState, useEffect } from 'react';
import {
    Container, Spinner, Row, Col, Badge
} from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';

import * as Icon from 'react-bootstrap-icons';
import {
    Link, Router, Switch, Route, useLocation, useHistory, useParams
} from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const ProjectRelationshipListItem = (props) => {
    const { trust } = props;
    let canChange = true;
    if (['Owner', 'Admin'].indexOf(props.project.userRoleInProject) == -1) {
        canChange = false;
    }


    const remove = async () => {
        await props.removeTrust({ trustUri: props.trust.trustUri });
    };
    return (
        <tr>
            <td>{trust.IAMPrincipalArn}</td>
            <td>{trust.label}</td>
            <td>{dayjs(trust.created).fromNow()}</td>
            <td>
                {
                    (canChange) ? (
                        <div onClick={remove} className={'btn-sm btn btn-warning'}>Remove</div>

                    ) : (
                        <div></div>
                    )

                }
            </td>
        </tr>
    );
};


export default ProjectRelationshipListItem;
