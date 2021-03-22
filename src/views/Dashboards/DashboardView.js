import React ,{useState, useEffect} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import useClient from "../../api/client";
import getDashboard from "../../api/Dashboard/getDashboard";
import {useParams} from "react-router-dom";
import * as FiIcon from "react-icons/fi";
import * as MdIcons from "react-icons/md";


const DashboardView = (props) => {
    const client = useClient();
    const params= useParams();
    let [error, setError] = useState(null);
    const [dashboard,setDashboard] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchItem= async()=>{
        setLoading(true);

        const response = await client.query(getDashboard(params.uri));
        if (!response.errors){
            setDashboard(response.data.getDashboard);
        }else {
            setError({
                header: 'Error',
                content: `Could not retrieve dataset ${params.uri}`
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
        title={dashboard.label}
        loading={loading}
        error={error}
        icon={<MdIcons.MdShowChart/>}
        breadcrumbs={`| play/dashboards/view`}
        label={dashboard.label}
        back={{
            link: '/dashboards',
            label: '< back to dashboards'
        }}
        owner={dashboard.owner}
        tabs={["overview", "view"]}
    >
        <Components.Editor client={client} dashboard={dashboard}/>
        <Components.QuisightDashboardViewer client={client} dashboard={dashboard}/>
    </ObjectView>
}


export default DashboardView;
