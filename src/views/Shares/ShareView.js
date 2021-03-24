import React ,{useState, useEffect} from "react";
import ObjectView from "../../components/view/ObjectViewTemplate";
import useClient from "../../api/client";
import getShareObject from "../../api/ShareObject/getShareObject";
import {useParams} from "react-router-dom";
import * as MdIcons from "react-icons/md";
import * as Components from "./components";
import {Label} from "semantic-ui-react";


const ShareView = (props) => {
    const client = useClient();
    const params= useParams();
    let [error, setError] = useState(null);
    const [share,setShare] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchItem= async()=>{
        setLoading(true);

        const response = await client.query(getShareObject({shareUri:params.uri}));
        if (!response.errors){
            setShare(response.data.getShareObject);
        }else {
            setError({
                header: 'Error',
                content: `Could not retrieve share ${params.uri}`
            })
        }
        setLoading(false);
    }
    useEffect(()=>{
        if (client){
            fetchItem();
        }
    },[client]);
    const Status = () => (
        <div>
            <Label tag style={{fontSize:'xx-small'}}>{share.userRoleForShareObject}</Label>
        </div>
    )
    const setTagColor = (share) => {
        if (share.status === 'Approved')
            return 'green';
        else if (share.status === 'Rejected')
            return('red');
        else if (share.status === 'PendingApproval')
            return('grey');
        else
            return('black')
    }
    return <ObjectView
        title={share.label}
        loading={loading}
        error={error}
        icon={<MdIcons.MdShare/>}
        breadcrumbs={`| catalog/contribute/share`}
        label={share.label}
        back={{
            link: `/dataset/${share.dataset&&share.dataset.datasetUri}/permissions`,
            label: `< back to dataset ${share.dataset&&share.dataset.datasetName}`
        }}
        owner={share.owner}
        tabs={["overview", "permissions", "request"]}
        status={<Status/>}
    >
        <Components.ShareSummmary share={share} reload={fetchItem} setTagColor={setTagColor}/>
        <Components.CurrentPermissions shareUri={share.shareUri} client={client} reload={() => { fetchItem() }} setTagColor={setTagColor}/>
        <Components.PermissionRequest share={share} client={client} reload={fetchItem} setTagColor={setTagColor}/>
    </ObjectView>
}


export default ShareView;
