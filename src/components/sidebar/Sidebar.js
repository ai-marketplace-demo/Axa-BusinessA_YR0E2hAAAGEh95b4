import React from "react";
import {If,Then,Else} from "react-if";
import styled from "styled-components";
import {Zoomable} from "../Zoomable";
import * as SidebarLayout from "./styles";
import MenuItem from "./MenuItem";
import * as AiIcons from "react-icons/ai";
import UserMenu from "./UserMenu";

const Sidebar=({isOpen,show,hide,items})=>{
    return <SidebarLayout.SidebarLayout>
        <If condition={isOpen}>
            <Then>
                <SidebarLayout.MenuHeaderEntry>
                     <UserMenu/>
                    <Zoomable onClick={hide}><AiIcons.AiOutlinePushpin/></Zoomable>
                </SidebarLayout.MenuHeaderEntry>
                <SidebarLayout.SidebarItemsLayout>

                    {
                        items&&items.map((item)=>{
                            return <MenuItem {...item} isMinimized={false} />
                        })
                    }
                </SidebarLayout.SidebarItemsLayout>
                <SidebarLayout.SidebarItemsSpacer/>

            </Then>
            <Else>
                <SidebarLayout.MenuHeaderEntry>
                    <Zoomable onClick={show}><AiIcons.AiOutlinePushpin/></Zoomable>
                </SidebarLayout.MenuHeaderEntry>
                <SidebarLayout.SidebarItemsLayout onClick={show}>
                {
                    items&&items.map((item)=>{
                        return <MenuItem {...item} isMinimized={true} />
                    })
                }
                </SidebarLayout.SidebarItemsLayout>

            </Else>
        </If>

    </SidebarLayout.SidebarLayout>
}


export default Sidebar;
