import {If, Then,Else} from "react-if";
import {Grid} from "../cssgrid/Grid";
import { Breadcrumb } from 'semantic-ui-react'
import { Button, Checkbox, Form } from 'semantic-ui-react'



const Title=(props)=>{
    return <Grid
        align={`center start`}
        spacing={{x:"0.3rem"}}
        cols={'auto auto auto'}>
        <div>
            {props.icon}
        </div>
        <div
        style={{fontWeight:'bolder',fontSize:'x-large'}}>{props.title}</div>
        <div
            style={{fontSize:'x-small'}}>
            {
                props.breadcrumbs?`| ${props.breadcrumbs}`:''
            }
        </div>
    </Grid>
}


export {
    Title
}
