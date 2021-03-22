import {useState,useEffect,useRef} from "react";
import useInterval from "../../../hooks/useInterval";
import * as WorksheetApi from "../../../api/Worksheet";





const AthenaActions ={
    poll: async ({client, worksheetUri,results, setResults, setError})=>{
        if (results&&results.AthenaQueryId){
            const response = await client.query(WorksheetApi.pollWorksheetQuery({
                worksheetUri:worksheetUri,
                AthenaQueryId:results.AthenaQueryId
            }));
            if (!response.errors){
                console.log("==>",response);
                setResults(response.data.pollWorksheetQuery);
            }else {
               setError(response.errors[0]) ;
            }
        }
    },
    start: async ({client, worksheetUri,environmentUri,query,setResults,setError})=>{
        const response = await client.mutate(WorksheetApi.startWorksheetQuery({
            worksheetUri:worksheetUri,
            input:{
                environmentUri,
                sqlBody:query,
            }
        }));
        if (!response.errors){
            setResults(response.data.startWorksheetQuery);
        }else {
            setError(response.errors [0]);
        }
    }
}

const useAthenaQueryResults=({client, worksheetUri, environmentUri,query,onComplete})=>{

    const [results,setResults] = useState({Status:'PENDING', rows:[],columns:[]});
    const [error, setError] = useState(null);
    const [delay, setDelay] = useState(null);

    const stopInterval=()=>{
        setDelay(null);
    }

    const startQuery=  async ()=>{
        setResults({
            Status : "Submitting",
            AthenaQueryId : null,
            Error: null,
            rows:[],
            columns:[],
            ElapsedTime:0,
            OutputLocation:null,

        });
        await AthenaActions.start({
            client,
            worksheetUri,
            environmentUri,
            query,
            setResults,
            setError
        });

    }

    const poll = ()=>{
        AthenaActions.poll({
            client,
            worksheetUri,
            results,
            setResults,
            setError,
        })
    }
    useInterval(poll, delay);

    useEffect(()=>{
        if (results.Status==="SUCCEEDED"||results.Status=="FAILED"||results.Status=="CANCELLED"){
            setDelay(null);
            onComplete()
        }else {
            setDelay(1000);
        }
    },[results]);

    // operational error
    useEffect(()=>{
        if (error){
            setDelay(null);
            onComplete()
        }
    },[error]);

    useEffect(()=>{
        if (query){
            startQuery();
        }
    },[query]);

    return {
        results,
        error
    };
}


export default useAthenaQueryResults;
