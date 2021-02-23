import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    If, Then, Else, Switch, Case, Default
} from 'react-if';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const Message = (props) => (
    <React.Fragment>

        <tr>
            <td>
                {dayjs(props.shareObject.created).fromNow()}
            </td>
            <td>
                <Switch>
                    <Case condition={props.shareObject.principal.principalType == 'Organization'}>
                        <Link to={`/organization/${props.shareObject.principal.principalId}/users`}>
                            {props.shareObject.principal.principalName}({props.shareObject.principal.principalType})
                        </Link>
                    </Case>
                    <Case condition={props.shareObject.principal.principalType == 'Project'}>
                        <Link to={`/project/${props.shareObject.principal.principalId}/contributors`}>
                            {props.shareObject.principal.principalName}({props.shareObject.principal.principalType})
                        </Link>
                    </Case>
                    <Default>
                        {props.shareObject.principal.principalName}({props.shareObject.principal.principalType})
                    </Default>
                </Switch>

            </td>
            <td>
                <Link to={`/dataset/${props.shareObject.dataset.datasetUri}/overview`}>
                    {props.shareObject.dataset.datasetName.toUpperCase()}
                </Link>
            </td>
            <td>
                <If condition={props.shareObject.confirmed}>
                    <Then>
                        <b>Active</b>
                    </Then>
                    <Else>
                        Not Active
                    </Else>
                </If>

            </td>
            <td>
                <Link
                    to={{
                        state: {
                            shareObject: props.shareObject
                        },
                        pathname: `/dataset/${props.shareObject.dataset.datasetUri}/share/${props.shareObject.shareUri}`
                    }}
                >
                    View share object
                </Link>

            </td>
        </tr>

    </React.Fragment>
);


export default Message;
