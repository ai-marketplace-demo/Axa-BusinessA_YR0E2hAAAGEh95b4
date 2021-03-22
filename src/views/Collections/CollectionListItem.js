import * as BsIcon from "react-icons/bs";
import {Grid} from "../../components/cssgrid/Grid";
import {Link} from "react-router-dom";

const CollectionListItem = (props) => {
    return <Grid
        style={{
            paddingLeft: '4px',
            borderLeft: '3px lightgrey solid',
            columnGap: '0.2rem',
            marginBottom: '1rem',
            marginTop: '1rem'
        }}
        cols={`1fr 3fr 3fr`}>

        <BsIcon.BsPieChart size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Dashboards</b></div>
        <div style={{fontSize: "xx-small"}}>{props.item.stats.dashboards}</div>
        <BsIcon.BsFolder size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Datasets</b></div>
        <div style={{fontSize: "xx-small"}}>{props.item.stats.datasets}</div>
        <BsIcon.BsTable size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Tables</b></div>
        <div style={{fontSize: "xx-small"}}>{props.item.stats.tables}</div>
    </Grid>
}

const CollectionLink = (props) => {
    return <Link to={`/collection/${props.item.uri}`}>More</Link>
}


export default CollectionListItem;
