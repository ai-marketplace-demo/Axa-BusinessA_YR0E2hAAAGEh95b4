import {useEffect,useState} from "react";
import * as BsIcon from "react-icons/bs";
import ObjectView from "../../components/view/ObjectViewTemplate";
import * as Components from "./components";
import  useClient from "../../api/client";
import getGlossary from "../../api/Glossary/getGlossary";
import {useParams} from "react-router-dom";

const GlossaryView = (props) => {
    const params = useParams();
    const client = useClient();
    const [loading, setLoading] = useState(true);
    const [glossary, setGlossary] = useState({});
    const [error, setError] = useState(null);
    const fetchItem=async()=>{
        const response = await client.query(getGlossary(params.uri));
        if (!response.errors){
            setGlossary({...response.data.getGlossary});
        }else {
            setError(response.errors[0]);
        }
        setLoading(false);

    }
    useEffect(()=>{
        if(client){
            fetchItem();
        }
    },[client]);
    return <ObjectView
        title={glossary.label}
        loading={loading}
        error={error}
        back={{
            link: '/glossaries',
            label: '< back to glossary list'
        }}
        icon={<BsIcon.BsTag/>}
        breadcrumbs={`catalog/organize/${glossary.label}`}
        owner={glossary.created}
        created={glossary.created}
        owner={glossary.owner}
        tabs={[ "Glossary","Associations"]}
    >
        <Components.GlossaryTree glossary={glossary} editable={true}/>
        <Components.GlossaryAssociations client={client} glossary={glossary} editable={true}/>
    </ObjectView>
}


export default GlossaryView;
