import {useState} from "react";
import {TabLink,TabLayout} from "./styles";
import {If,Then,Else} from "react-if";
import {Link,useParams,useLocation} from "react-router-dom";




const Tabs=({tabs})=>{
    const params=useParams();
    const location=useLocation();
    let _current;
    if (params.tab){
        _current=params.tab;
    }else{
        _current=tabs[0]
    }
    const [current,setCurrent]=useState(_current);
    //return <div style={{width:'100%',borderBottom:'1px solid white'}}>
    return <TabLayout>
        {
            tabs.map((tab)=>{
                return <If condition={tab===current}>
                    <Then>
                        <TabLink onClick={()=>{setCurrent(tab)}} active={tab===current}>
                            {tab}
                        </TabLink>
                    </Then>
                    <Else>
                        <Link to={tab}>
                            <TabLink onClick={()=>{setCurrent(tab)}} active={tab===current}>
                                {tab}
                            </TabLink>
                        </Link>
                    </Else>
                </If>
            })
        }
    </TabLayout>
}
export default Tabs;
