import {Button, Icon, Popup} from "semantic-ui-react";


const TooltipIconButton=({tooltip, icon,label,...props})=>{
    const style = {
        borderRadius: 0,
        opacity: 0.7,
    }
    const btn=<Button {...props} >
        <Icon name={icon} />
        {label}
    </Button>
    return <Popup
        inverted
        style={style}
         content={tooltip}
        trigger={btn}/>

}

export default TooltipIconButton;
