import {useEffect, useState} from "react";
import DataView from "../../components/listview/DataView";
import * as BsIcon from "react-icons/bs";
import GlossaryListItem from "./GlossaryListItem";
import listGlossaries from "../../api/Glossary/listGlossaries";
import useClient from "../../api/client";
import * as Defaults from "../../components/defaults";

const GlossaryLink = ({item}) => {
    return `/glossary/${item.nodeUri}/`
}
const GlossaryList = (props) => {
    const client = useClient();
    const [items, setItems] = useState(Defaults.PagedResponseDefault);
    const [filter , setFilter] = useState(Defaults.DefaultFilter);
    const [loading, setLoading] = useState(true);

    const fetchItems= async()=>{
        setLoading(true);
        const response = await client.query(
            listGlossaries(filter)
        )
        if (!response.errors){
            setItems({...response.data.listGlossaries, nodes:response.data.listGlossaries.nodes.map((g)=>{
                return {
                    ...g,
                    details:[
                        {
                            name:'categories',
                            target:g.stats.categories,
                            icon:<BsIcon.BsBookmark/>
                        },
                        {
                            name:'terms',
                            target:g.stats.terms,
                            icon:<BsIcon.BsTag/>
                        }

                    ]
                }
            })})
            setLoading(false);
        }
    }
    const handlePageChange=(e,{activePage})=>{
        if (activePage<=items.pages){
            setFilter({...filter, page: activePage})
        }
    }

    const handleTermChange= (e)=>{
        setFilter({...filter,term: e.target.value});
    }

    useEffect(() => {
        if(client){
            fetchItems();
        }
    },[client,filter.page]);

    return <DataView
        icon={<BsIcon.BsTag/>}
        title={"Glossary"}
        linkComponent={GlossaryLink}
        createLink={() => {
            return `/new-glossary`
        }}
        breadcrumbs={"> catalog/organize"}
        loading={loading}
        pager={{
            ...items,
            onTermChange:handleTermChange,
            onPageChange:handlePageChange,
            onSearch:fetchItems
        }}
        items={items}
        keyField={`nodeUri`}
        creatable={true}
        collectionable={false}
        commentable={false}

        itemBody={GlossaryListItem}
    />
}


export default GlossaryList;
