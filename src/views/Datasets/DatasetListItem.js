import * as BsIcon from "react-icons/bs";
import {Grid} from "../../components/cssgrid/Grid";


const DatasetListItem = (props) => {
    return <Grid
        style={{
            paddingLeft: '4px',
            borderLeft: '3px lightgrey solid',
            columnGap: '',
            marginBottom: '',
            marginTop: ''
        }}
        cols={`1fr 3fr 3fr`}>

        <BsIcon.BsCloud size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Environments</b></div>
        <div style={{fontSize: "xx-small"}}>3</div>
        <BsIcon.BsPeople size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Admins</b></div>
        <div style={{fontSize: "xx-small"}}>team1</div>
        <BsIcon.BsShield size={`12`}/>
        <div style={{fontSize: "xx-small"}}><b>Role</b></div>
        <div style={{fontSize: "xx-small"}}>Owner</div>
    </Grid>
}


export default DatasetListItem;
