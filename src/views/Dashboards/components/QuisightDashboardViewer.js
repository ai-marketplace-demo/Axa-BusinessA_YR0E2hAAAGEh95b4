import {createRef,useEffect,useState} from "react";
import getAuthorSession from "../../../api/Dashboard/getDashboardAuthorSession";
import getReaderSession  from "../../../api/Dashboard/getDashboardReaderSession";
import * as ReactIf from "react-if";
import {Loader} from "semantic-ui-react";
const QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");



const QuisightDashboardViewer = ({dashboard,client})=>{
    const [dashboardRef,setDashboardRef]= useState(createRef());
    const [rendered, setRendered]= useState(false);
    const [sessionUrl, setSessionUrl] = useState(null);
    const [error, setError] = useState();
    const fetchReaderSessionUrl= async ()=>{
        const response = await client.query(getReaderSession(dashboard.dashboardUri));
        if (!response.errors){
            setSessionUrl(response.data.getReaderSession);
            const options = {
                url: response.data.getReaderSession,
                scrolling: "no",
                height: "700px",
                width: "100%",
                locale: "en-US",
                footerPaddingEnabled: true,
                sheetTabsDisabled: false, // use this option to enable or disable sheet tab controls in dashboard embedding
                printEnabled: false, // use this opt
                //height: "700px",
                //height: "AutoFit",
                maximize:true,
                //loadingHeight: "700px",
                //width: "100%",
                container: dashboardRef.current,

            };
            const dashboard = QuickSightEmbedding.embedDashboard(options);
        }else{
            setError(response.errors[0].message)
        }
    }

    useEffect(()=>{
        if (!sessionUrl){
            fetchReaderSessionUrl()
        }
    })
    if (!sessionUrl){
        return <div></div>
    }
    return <div>
        <ReactIf.If condition={sessionUrl}>
            <ReactIf.Then>
                <a target={`_blank`} href={sessionUrl}>
                    View In Quicksight
                </a>
                <span   ref={dashboardRef}/>
            </ReactIf.Then>
            <ReactIf.Else>
                <ReactIf.If condition={error}>
                    <ReactIf.Then>
                    {error}
                    </ReactIf.Then>
                    <ReactIf.Else>
                        <Loader active/>
                    </ReactIf.Else>
                </ReactIf.If>
            </ReactIf.Else>
        </ReactIf.If>
    </div>
}

export default QuisightDashboardViewer;
