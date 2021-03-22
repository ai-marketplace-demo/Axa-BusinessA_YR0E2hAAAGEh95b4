import {Grid} from "../../components/cssgrid/Grid";
import {Link} from "react-router-dom";

const EnvironmentListItem = (props) => {
    return <Grid
        style={{
            paddingLeft: '4px',
            borderLeft: '3px lightgrey solid',
            columnGap: '1rem',
            marginBottom: '1rem',
            marginTop: '1rem'
        }} cols={`1fr 3fr 3fr`}>
        <div style={{fontSize: "xx-small"}}><b>Datasets</b></div>
        <div style={{fontSize: "xx-small"}}>
            <Link to={`/environments/`}>
                sss
            </Link>
        </div>

    </Grid>
}


export default EnvironmentListItem;
