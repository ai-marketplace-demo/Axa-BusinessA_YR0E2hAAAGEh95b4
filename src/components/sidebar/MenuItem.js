import {useState} from "react";
import {If, Then,Else} from "react-if";
import {GroupEntry} from "./styles";
import PropTypes from "prop-types";
import * as BsIcons from "react-icons/bs";
import {Link} from "react-router-dom";


const MenuItemLink = ({label,link})=>{
    return <If condition={link}>
        <Then>
            <Link to={link}>
                {label}
            </Link>
        </Then>
        <Else>
            {label}
        </Else>
    </If>
}

const MenuItem = ({icon,link,items,label,isMinimized})=>{
    const [unfolded,setUnfolded] = useState(true);
    const unFold= ()=>{setUnfolded(true)}
    const fold=()=>{setUnfolded(false)};

    return <If condition={isMinimized}>
        <Then>
            {icon}
        </Then>
        <Else>
            <GroupEntry>
                {icon}
                <If condition={items&&items.length&&!unfolded}>
                    <Then>
                        <div onClick={unFold}>
                            <MenuItemLink label={label} link={link}/>
                        </div>
                    </Then>
                    <Else>
                        <div onClick={fold}>
                            <MenuItemLink label={label} link={link}/>
                        </div>
                    </Else>
                </If>
                <If condition={items}>
                    <Then>
                        <BsIcons.BsChevronRight size={"8"}/>
                    </Then>
                </If>
            </GroupEntry>
            <If condition={unfolded&&items}>
                <Then>
                    {
                        items&&items.map((item)=>{
                            return <GroupEntry level={2}>
                                {item.icon}
                                <MenuItemLink label={item.label} link={item.link}/>
                            </GroupEntry>
                        })
                    }
                </Then>
            </If>
        </Else>
    </If>
}

MenuItem.propTypes={
    icon: PropTypes.element,
    label : PropTypes.string,
    isUnfolded: PropTypes.bool,
    link: PropTypes.string,
    isMinimized:PropTypes.bool,
    items:PropTypes.array
}
export default MenuItem
