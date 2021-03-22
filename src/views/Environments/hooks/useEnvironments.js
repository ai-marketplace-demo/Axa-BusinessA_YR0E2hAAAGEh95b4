import client from "../../../api/client";
import listEnvironments from "../../../api/Environment/listEnvironments";
import * as Defaults from "../../../components/defaults";
import {useEffect,useState} from "react";

const useEnvironments=({client,page})=>{
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const fetchItems = async ()=>{
        const response = await client.query(
            listEnvironments({
                page:page||1,
                pageSize:20
            })
        )
        if (!response.errors){
            setItems(response.data.listEnvironments)
        }
    }
    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client]);

    return items;
}


export default useEnvironments;
