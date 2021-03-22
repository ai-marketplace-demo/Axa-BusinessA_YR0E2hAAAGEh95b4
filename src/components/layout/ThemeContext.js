import React from "react";

const ThemeContext = React.createContext({
    fullscreen:"XXX",
    showsidebar:true,
    enterFullscreen:()=>{},
    leaveFullscreen:()=>{},
    enterDarkMode:()=>{},
    enterBrightMode:()=>{}
})


export default ThemeContext;
