import React ,{useState, useEffect} from "react";
import jwt_decode ,{errors} from "jwt-decode";
import config from '../config'

const useAuth = ()=>{
    let conf = config.cognito;
    const [userInfo, setUserInfo] = useState(null);
    const check=()=>{
        const location  = window.location.href;
        const tokenName= `datahub-token-${config.cognito.APP_CLIENT_ID}`;
        let loginRedirectUrl= `${conf.DOMAIN}/login?client_id=${conf.APP_CLIENT_ID}&response_type=${conf.TYPE}&scope=${conf.SCOPE.join("+")}&redirect_uri=${conf.REDIRECT_URI}`;
        const token = localStorage.getItem(tokenName);
        if (!token){
            console.log("no token found in local storage")
            const url = new URL(location.replace("#","?"));
            const tokenReadFromUrl = url.searchParams.get("id_token");
            if (tokenReadFromUrl){
                try{
                    console.log("==>")
                    console.log(url.searchParams.get("id_token"));
                    const decoded=jwt_decode(url.searchParams.get("id_token"));
                    console.log("DECODED")
                    localStorage.setItem(tokenName, tokenReadFromUrl);
                    setUserInfo(decoded);
                }catch (error){
                    console.log("there's an error !")
                    window.location = loginRedirectUrl;
                }
            }else {
                console.log("no token read from url")
                window.location = loginRedirectUrl;
            }
        }else {
            console.log("token found in local storage")
            try{
                const token=localStorage.getItem(tokenName);
                const decoded=jwt_decode(token);
                const expires = new Date(decoded.exp);
                //if (new Date() > expires ){
                //    console.log(expires);
                //    throw new Error("TokenExpired")
                //}
                setUserInfo(decoded);
            }catch (error){
                console.log(error)
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




export default useAuth;
