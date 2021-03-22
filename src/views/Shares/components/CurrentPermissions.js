import {useEffect,useState} from "react";
import {Button,Icon} from "semantic-ui-react";
import getShareObject from "../../../api/ShareObject/getShareObject";
import removeSharedItem from "../../../api/ShareObject/removeSharedItem";
import {TableContainer} from "../../../components/table";
import PagedResponseDefault from "../../../components/defaults/PagedResponseDefault";


const CurrentPermissions = ({share,client})=>{
    const [loading, setLoading]= useState(false);
    const [error, setError] = useState(null)
    const [sharedItems, setSharedItems] = useState(PagedResponseDefault );

    const fetchItems=async ()=>{
        setLoading(true);
        const response = await client.query(getShareObject ({
            shareUri:share.shareUri,
            filter:{
                isShared:true
            }
        }));
        if (!response.errors){
            setSharedItems({...response.data.getShareObject.items});
        }else {
           setError(``)
        }
        setLoading(false);
    }

    const removeItemFromShareObject=async(item)=>{
        setLoading(true);
        const response= await client.mutate(removeSharedItem ({shareItemUri:item.shareItemUri}));
        if (!response.errors){
            await fetchItems();
        }else {
            setError(response.errors[0].message)
        }
        setLoading(false);
    }

    useEffect(()=>{
        if (client){
            fetchItems();
        }
    },[client])
    return <TableContainer
        reload={fetchItems}
        columns={[{
            label:'itemUri',key:'itemUri',
        },
            {
                label:'Type', key:'itemType'
            },
            {
              label:'Status',
              key:'status'
            },
            {
                label:'Name', key:'itemName'
            },

            {
                label:'Remove',key:'action'
            }
        ]}
        rows={sharedItems.nodes.map((item)=>{
            return {...item, action : <Button
                    icon labelPosition='right'
                    onClick={()=>{removeItemFromShareObject(item)}}
                    size={`mini`}>
                    <Icon name='minus' />
                    Remove
            </Button>}
        })}
    />

}


export default CurrentPermissions;
