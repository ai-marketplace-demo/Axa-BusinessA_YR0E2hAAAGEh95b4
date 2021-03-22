import {useState,useEffect} from "react";


const SimpleLoader=(props)=>{
    const [dots, setDots] = useState(["."]);
    const handler=() => {
        console.log(dots.length,dots);
        setDots(dots=>dots.length<=5?[...dots,"."]:["."]);
    };
    useEffect(() => {
        const interval = setInterval(handler, 800);
        return () => clearInterval(interval);
    }, []);


    return <div style={{display:"grid"}}>
        loading {dots.join("")}
    </div>
}


export default SimpleLoader;
