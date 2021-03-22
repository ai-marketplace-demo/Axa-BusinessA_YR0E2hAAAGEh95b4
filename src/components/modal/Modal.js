import React,{useState} from "react";
import styled from "styled-components";
import {Modal,Button,Header ,Image} from "semantic-ui-react";

const ModalStyle=styled.div`
  position: fixed;
  top:3rem;
  border-radius: 12px;
  width:70%;
  height:auto;
  padding:1rem;
  z-index: 22;
  border: 1px lightgrey solid;
  box-shadow: 0 3px 3px 6px rgba(0,0,0,0.04);
  background-color: white;
  display: grid;
  
`


const __Modal = (props)=>{

    return <ModalStyle
    style={{marginLeft:'25%'}}>
                <div style={{placeItems:'center start ',display:'grid', gridTemplateColumns:'0.1fr 3fr'}}>{props.icon} <div style={{fontWeight:'bolder',fontSize:'small'}}>{props.title}</div></div>
                <div>
                    {
                        React.Children.only(props.children)
                    }

                </div>
        <div style={{display:'grid',placeItems:'center',width:'6rem',border:'1px solid lightgrey', borderRadius:'12px', padding:'4px'}} onClick={props.close}>
            Close
        </div>
            </ModalStyle>
}

const CustomModal  = (props)=>{
    const [open, setOpen] = useState(true);
    return        <Modal
             //style={{marginLeft:'25%'}}>
             centered={true}
             size={`large`}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            //trigger={<Button>Show Modal</Button>}
        >
            <Modal.Header>Select a Photo</Modal.Header>
            <Modal.Content image>
                <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
                <Modal.Description>
                    <Header>Default Profile Image</Header>
                    <p>
                        We've found the following gravatar image associated with your e-mail
                        address.
                    </p>
                    <p>Is it okay to use this photo?</p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => setOpen(false)}>
                    Nope
                </Button>
                <Button
                    content="Yep, that's me"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => setOpen(false)}
                    positive
                />
            </Modal.Actions>
        </Modal>

}


export  {CustomModal as Modal};
