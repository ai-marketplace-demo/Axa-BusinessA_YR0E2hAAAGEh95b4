import React ,{useState, useEffect} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import useClient from "../../api/client";
import getShareObject from "../../api/ShareObject/getShareObject";
import {useParams} from "react-router-dom";
import * as FiIcon from "react-icons/fi";
import * as MdIcons from "react-icons/md";
import * as Components from "./components";


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
    >
        <Components.ShareSummmary share={share} client={client}/>
        <Components.CurrentPermissions share={share} client={client}/>
        <Components.PermissionRequest share={share} client={client}/>
    </ObjectView>
}


export default ShareView;
