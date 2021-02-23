import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Table, Spinner, Badge
} from 'react-bootstrap';
import { If, Then, Else } from 'react-if';
import * as Icon from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import listDatasetStorageLocations from '../../../api/Dataset/listDatasetStorageLocations';
import useClient from '../../../api/client';


const DatasetFolderListITem = (props) => {
    const { folder } = props;
    return (
        <tr>
            <td>
                <Icon.Folder2 /> {folder.name}
            </td>
            <td>
                {folder.S3Prefix}
            </td>
            <td>
                {folder.created}
            </td>
            <td>
                {folder.description}
            </td>
            <td>
                <i>{`s3://${props.dataset.S3BucketName}/${folder.S3Prefix}`}</i>
            </td>
        </tr>
    );
};


export default DatasetFolderListITem;
