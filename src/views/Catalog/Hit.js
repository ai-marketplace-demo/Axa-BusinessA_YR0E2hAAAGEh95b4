import  {useState,useEffect} from "react";
import {HitCard} from "./styles";
import {Link,Redirect,useHistory} from "react-router-dom";
import * as ReactIf from "react-if";
import * as BsIcons from "react-icons/bs";
import * as FiIcons from "react-icons/fi"
import {Button,Icon} from "semantic-ui-react";
const HitICon = ({hit})=>{
    const history= useHistory();

    return <ReactIf.Switch>
        <ReactIf.Case condition={hit.datahubKind=='dataset'}>
            <BsIcons.BsFolder size={23}/>
        </ReactIf.Case>
        <ReactIf.Case condition={hit.datahubKind=='table'}>
            <BsIcons.BsTable/>
        </ReactIf.Case>
        <ReactIf.Case condition={hit.datahubKind=='folder'}>
            <FiIcons.FiFile size={23}/>
        </ReactIf.Case>
    </ReactIf.Switch>
}

const Hit= ({hit})=>{
    const history = useHistory();
    const redirect=()=>{
        if (hit.datahubKind=='dataset'){
            history.push(`/dataset/${hit._id}/`)
        }else if (hit.datahubKind=='table'){
            history.push(`/table/${hit._id}/`)
        }
    }
    const redirectToRequest = ()=>{
        history.push(`/request/${hit.datahubKind}/${hit._id}`)
    }
    return <HitCard>
        <div style={{display:'grid', gridTemplateColumns:'6fr 3fr 2fr '}}>
            <div style={{display:'grid', placeItems:'start start',rowGap:'4px',gridTemplateRows:'1fr 1fr 4fr 0.5fr 0.1fr'}}>

                <div style={{display:"grid" ,gridTemplateColumns:'3fr 8fr '}}>
                    <HitICon hit={hit}/>
                    <div style={{color:'rgba(0,0,0,0.8)',fontSize:'large'}}>{hit.name}</div>
                </div>
                <div style={{color:'darkgray',fontSize:'medium',display:'grid', gridTemplateColumns:'1fr'}}>
                    {hit.description}
                </div>
                <div style={{
                    display:'grid',
                    gridTemplateRows:'repeat(5,1.5rem)',
                    placeItems:'center start',
                    gridTemplateColumns:'0.6fr 4fr 5fr '}}>
                        <BsIcons.BsPerson/>
                        <div>Created By</div>
                        <div>{hit.owner}</div>
                    <BsIcons.BsPeople/>
                    <div>Administrators</div>
                    <div>{hit.admins}</div>
                        <BsIcons.BsHouse/>
                        <div>Organization</div>
                        <div>{hit.organizationName}</div>
                        <BsIcons.BsCalendar/>
                        <div>Created</div>
                        <div>{hit.created}</div>
                        <BsIcons.BsCloud/>
                        <div>Environment</div>
                        <div>{hit.environmentName}</div>
                        <FiIcons.FiGlobe/>
                        <div>Region</div>
                        <div>{hit.region}</div>
                </div>

            </div>
            <div style={{display:'grid', placeItems:'start start',rowGap:'1rem', gridTemplateRows:'0.15fr'}}>
                <div style={{display: "grid", columnGap:'2px',gridTemplateRows: '1fr', gridTemplateColumns: 'repeat(5,minmax(auto,0.1fr))'}}>
                    {
                        hit.topics&&hit.topics.map((topic)=>{
                            return <div
                                style={{
                                    padding:'4px',
                                    textAlign:"center",
                                    border:'1px lightgrey solid',
                                    borderRadius:'12px',
                                    backgroundColor:'rgba(0,0,0,0.03)'}}>
                                {topic}
                            </div>
                        })}
                </div>
                <div style={{display: "grid", columnGap:'2px',gridTemplateRows: 'minmax(1fr,23px)', gridTemplateColumns: 'repeat(5,minmax(auto,0.1fr))'}}>
                    {
                        hit.tags&&hit.tags.map((tag)=>{
                            return <div
                                style={{
                                    padding:'4px',
                                    textAlign:"center",
                                    border:'1px lightgrey solid',
                                    borderRadius:'12px',
                                    backgroundColor:'rgba(0,0,0,0.03)'}}>
                                {tag}
                            </div>
                        })}
                </div>
            </div>
            <div style={{display:'grid', placeItems:'center center',gridTemplateRows:'repeat(3,0.2fr'}}>
                <Button   primary outline onClick={redirect} icon labelPosition='right' style={{width:'100%'}} color={``} size={`mini`} >
                    Learn More
                    <Icon name='right arrow' />
                </Button>
                <Button  icon labelPosition='right' onClick={redirectToRequest} style={{width:'100%'}} color={`green`} size={`tiny`} >
                    Get it
                    <Icon name={`cart`}/>
                </Button>
            </div>
        </div>


    </HitCard>
}

export default Hit;
