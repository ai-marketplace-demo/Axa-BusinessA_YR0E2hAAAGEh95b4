import React,{useRef,useEffect,useState} from "react";
import * as ReactIf from "react-if";
import styled from "styled-components";
import * as BsIcons from "react-icons/bs"
import PropTypes from "prop-types";
import * as DropdownStyles from "./styles";
import DropdownTitle from "./DropdownTitle";
import DropdownMenuItem from "./DropdownMenuItem";
import * as Children from "react-nanny";

const Dropdown = (props)=>{
    const [isOpen,setIsOpen] = useState(false);
    const [currentKey,setCurrentKey] = useState(null);
    const node = useRef();
    const handleClickOutside=(e)=>{
        if (node.current.contains(e.target)) {
            return;
        }else {
            setIsOpen(false)
        }
    }
    const handleClick=(key)=>{
        setCurrentKey(key)
    }

    const close=()=>{
        if (isOpen){
            setIsOpen(false)
        }
    }
    useEffect(() => {
        if (isOpen){
            document.addEventListener("mousedown",handleClickOutside);
        }else {
            document.removeEventListener("mousedown", handleClickOutside)
        }
        return ()=>{document.removeEventListener("mousedown",handleClickOutside)}

    },[isOpen]);

    return <div  ref={node}>
        <DropdownStyles.DropdownContainer   {...props}>
            <DropdownStyles.DropdownBtn  isOpen={isOpen} onClick={()=>{setIsOpen(!isOpen)}}>
                {
                    Children.getChildByType(props.children,['DropdownTile'])
                }
                <div><BsIcons.BsChevronDown size={`8px`}/></div>
            </DropdownStyles.DropdownBtn>
            <ReactIf.If condition={isOpen}>
                <ReactIf.Then>
                    <DropdownStyles.DropdownContent {...props}>
                        {
                            Children
                                .getChildrenByType(props.children,["DropdownMenuItem"])
                                .map((child)=>{
                                    return React.cloneElement(child,{close:close,onClick:handleClick});
                                })
                        }
                    </DropdownStyles.DropdownContent>
                </ReactIf.Then>
            </ReactIf.If>
        </DropdownStyles.DropdownContainer>
    </div>
}





export default Dropdown;
