import * as BsIcon from "react-icons/bs";
import {Grid} from "../../components/cssgrid/Grid";
import {Link} from "react-router-dom";

const WorkflowListItem = (props) => {
    return <Grid
        style={{
            paddingLeft: '4px',
            borderLeft: '3px lightgrey solid',
            columnGap: '1rem',
            marginBottom: '1rem',
            marginTop: '1rem'
        }} cols={`1fr 3fr 3fr`}>

        <BsIcon.BsCloud size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Environment</b></div>
        <div style={{fontSize: "xx-small"}}>
            <Link to={`/environments/${props.item.organizationUri}`}>
                {props.item.stats.environments}
            </Link>
        </div>
        <BsIcon.BsPeople size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Admins</b></div>
        <div style={{fontSize: "xx-small"}}>{props.item.SamlGroupName}</div>
        <BsIcon.BsShield size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Role</b></div>
        <div style={{fontSize: "xx-small"}}>{props.item.userRoleForCluster}</div>
    </Grid>
}


export default WorkflowListItem;
