import styled from "styled-components";

const Circle = styled.div`
    width:1.2rem;
    height:1.2rem;
    color: white;
    border-radius: 50%;
    display: grid;
    place-items: center;
    //color: rgba(0,0,0,0.8);
    __border: 1px lightgrey solid;
    background-color: pink;
  font-size: x-small;
`

const Message = (props) => {
    return <div style={{display: "grid", columnGap: '0.2fr', gridTemplateColumns: "0.2fr 1fr 2fr  "}}>
        <Circle>{`y`}</Circle>
        <div style={{fontSize: 'small'}}>{props.owner}</div>
        <div style={{fontSize: 'small'}}>{props.created}</div>

        <div style={{
            fontSize: 'small',
            color: 'darkgray',
            marginLeft: '0.3rem',
            borderLeft: '1px solid lightgrey',
            paddingLeft: '1rem',
            gridColumnStart: 1,
            gridColumnEnd: 4
        }}>
            {props.body}
        </div>
    </div>
}


export default Message;
