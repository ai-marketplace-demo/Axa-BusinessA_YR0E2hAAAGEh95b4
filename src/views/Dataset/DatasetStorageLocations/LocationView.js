import React, {useEffect} from "react" ;
import {Row,Container,Col} from "react-bootstrap";
import {Route,Switch,Link} from "react-router-dom";



const LocationView=()=>{

    return <Switch>
        <Route path={"/"}>
            <div>
                <h1>Locations</h1>
                <Link to={"permissions/1"}>permissions</Link>
            </div>
        </Route>
        <Route path={"/permissions/:uri"}>
            <h2>Permissions</h2>
        </Route>
    </Switch>
}



