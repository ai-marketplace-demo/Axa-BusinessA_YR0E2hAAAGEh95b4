import {Grid} from "../cssgrid/Grid";

const TagList=(props)=>{
    return <Grid rows={`1fr`} cols={`1fr 1fr 1fr 1fr`}>
        {props.tags.map((t)=>{
            return         <div
                style={{
                    borderRadius:'12px',
                    minWidth:'50px',
                    textAlign:'center',
                    padding:`3px`,
                    backgroundColor:' lightgrey',
                    fontSize:'xx-small'}}>
                {t}
            </div>

        })}

    </Grid>
}


export default TagList;
