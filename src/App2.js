import React ,{useState, useEffect, useContext} from "react";
import {If,Then,Else , Elif} from "react-if";
import jwt_decode ,{errors} from "jwt-decode";
import {toast} from "react-toastify";
import config from "./config";


const useAuth = ()=>{
    console.log("useAuth ", Math.random())
    let conf = config.cognito;
    const [userInfo, setUserInfo] = useState(null);

    const check=()=>{
        const location  = window.location.href;
        const tokenName= `datahub-token-${config.cognito.APP_CLIENT_ID}`;
        //const loginRedirectUrl = `${config.cognito.DOMAIN}/login?client_id=${config.cognito.APP_CLIENT_ID}&response_type=${config.cognito.TYPE}&scope=${config.cognito.SCOPE.join("+")}&redirect_uri=${config.cognito.REDIRECT_URI}`;
        const loginRedirectUrl=              `${conf.DOMAIN}/login?client_id=${conf.APP_CLIENT_ID}&response_type=${conf.TYPE}&scope=${conf.SCOPE.join("+")}&redirect_uri=${conf.REDIRECT_URI}`;
        console.log("loginRedirectUrl >>",loginRedirectUrl);
        const token = localStorage.getItem(tokenName);
        if (!token){
            alert("No token found in local storare")
            const url = new URL(location.replace("#","?"));
            const tokenReadFromUrl = url.searchParams.get("id_token");
            if (tokenReadFromUrl){
                try{
                    const decoded=jwt_decode(url.searchParams.get("id_token"));
                    localStorage.setItem(tokenName, tokenReadFromUrl);
                    setUserInfo(decoded);
                }catch (error){
                    window.location = loginRedirectUrl;
                }
            }else {
                window.location = loginRedirectUrl;
            }
        }else {
            try{
                const token=localStorage.getItem(tokenName);
                const decoded=jwt_decode(token);
                const expires = new Date(decoded.exp);
                //if (new Date() > expires ){
                //    throw new Error("TokenExpired")
                //}
                setUserInfo(decoded);
            }catch (error){
                window.location = loginRedirectUrl;
            }
        }
    }

    useEffect(()=>{
        if (!userInfo){
            check();
        }
    });
    return userInfo
}



const App2 = ()=>{
    const [authenticated , setAuthenticated]= useState(false);
    const config={
        clientid:"2ob3l2p3rfa26o52pljpciqq0t",
        domain:"https://datahubstaging2.auth.eu-west-1.amazoncognito.com",
        scope:['email','openid','profile'],//email+openid+profile
        responseType:"token",
        redirectUri: "http://localhost:1234/"
    }
    const check=()=>{
        const location  = window.location.href;

        if (false){

        } else {
            const token = localStorage.getItem(`datahub-token-${config.clientid}`);
            if (!token){
                const url = new URL(location.replace("#","?"));
                if (url.searchParams.get("id_token")){
                    alert("Token id is in the url ")
                    try{
                        const decoded=jwt_decode(url.searchParams.get("id_token"));
                        localStorage.setItem(`datahub-token-${config.clientid}`, url.searchParams.get("id_token"));
                        window.location=config.redirectUri

                    }catch (error){
                        const login=`${config.domain}/login?client_id=${config.clientid}&response_type=${config.responseType}&scope=${config.scope.join("+")}&redirect_uri=${config.redirectUri}`;
                        window.location = login;

                    }
                }else {
                    const login=`${config.domain}/login?client_id=${config.clientid}&response_type=${config.responseType}&scope=${config.scope.join("+")}&redirect_uri=${config.redirectUri}`;
                    window.location = login;
                }

            }else {
                try{
                    const token=localStorage.getItem(`datahub-token-${config.clientid}`);
                    alert(`This is the token : ${token}`);
                    const decoded=jwt_decode(token);
                    console.log(decoded);
                    const expires = new Date(decoded.exp);
                    if (expires > new Date()){
                        throw new Error("TokenExpired")
                    }
                }catch (error){
                    const login=`${config.domain}/login?client_id=${config.clientid}&response_type=${config.responseType}&scope=${config.scope.join("+")}&redirect_uri=${config.redirectUri}`;
                    window.location = login;

                }
            }
        }

    }

    useEffect(()=>{

        check();
    });

    return <div>
        <h1>
            Hello Man
        </h1>
    </div>
}



const AppWithHook = (props)=>{
    let auth= useAuth();
    useEffect(()=>{},[auth])
    return <h1> Hello {auth&&auth.email}</h1>
}

export default AppWithHook;
