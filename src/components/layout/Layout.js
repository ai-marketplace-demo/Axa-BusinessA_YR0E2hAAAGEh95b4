import React, {useState} from "react";
import {Auth} from "aws-amplify";
import ThemeContext from "./ThemeContext";
import {Sidebar} from "../sidebar";
import {Header} from "../header";
import navConfig from "./navConfig";
import {CenterGrid, LayoutGrid} from "./styles";
import styled from "styled-components";



const __Layout = (props) => {
    const [fullscreen, setFullScreen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const enterFullScreen = () => {
        setFullScreen(true)
    };
    const leaveFullScreen = () => {
        setFullScreen(false)
    }

    const closeSidebar=()=>{
        setShowSidebar(false)
    }
    const openSidebar=()=>{
        setShowSidebar(true);
    }

    return <ThemeContext.Provider value={{
        fullscreen: fullscreen,
        sidebar:showSidebar,
        closeSidebar:closeSidebar,
        openSidebar: openSidebar,
        enterFullscreen: enterFullScreen,
        leaveFullscreen: leaveFullScreen
    }}>
        <LayoutGrid showSidebar={showSidebar}>
            <Sidebar
                isOpen={showSidebar}
                hide={() => {
                    closeSidebar()
                }}
                show={() => {
                    openSidebar()
                }}
                items={navConfig}
            />
            <CenterGrid showSidebar={showSidebar}>
                {/**<Header fullscreen={fullscreen}/>**/}
                {
                    React.Children.only(props.children)
                }
            </CenterGrid>

        </LayoutGrid>
    </ThemeContext.Provider>
}


const L = styled.div`
    height:100%;
    overflow-y: hidden;
    border: 6px solid lightcoral;
    display: grid;
    grid-template-columns: minmax(150px, 25%) 1fr;
`
const Footer=styled.div`
  position: absolute;
  bottom: 0;
  height: 2rem;
  width: 100%;
  background-color: white;
  border-top: 1px solid lightgrey;
`

const C=styled.div`
      border: 7px solid purple;
      height:100%;
      z-index: 0;
      width: 100%;
`

const Layout = (props)=>{
    const [fullscreen, setFullScreen] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const enterFullScreen = () => {
        setFullScreen(true)
    };
    const leaveFullScreen = () => {
        setFullScreen(false)
    }

    const closeSidebar=()=>{
        setShowSidebar(false)
    }
    const openSidebar=()=>{
        setShowSidebar(true);
    }

    return <LayoutGrid showSidebar={showSidebar}>
       <Sidebar isOpen={showSidebar} hide={closeSidebar} show={openSidebar}  items={navConfig}/>
        <CenterGrid>
            <div>
                {
                    React.Children.only(props.children)
                }

            </div>
            {/**<Footer/>**/}
        </CenterGrid>

    </LayoutGrid>
}

export default Layout;
