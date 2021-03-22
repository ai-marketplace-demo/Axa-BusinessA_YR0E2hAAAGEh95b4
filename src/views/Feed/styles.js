import styled from "styled-components";


const Avatar = styled.div`
display: grid;
  background-color: dodgerblue;
place-items: center;
  color: white;
  height: 2rem;
  width: 2rem;
border-radius: 50%`
const FeedLayout =styled.div`
  flex-basis: auto;
  flex-shrink: 0;
  flex-grow: 1;
  padding: 2rem;

`

const FeedMessagesLayout=styled.div`
  display: flex;
  flex-direction: column;
  min-height: 70vh;
`
const FeedMessagesFooter=styled.div`
  flex-basis: auto;
  flex-grow: 0;
  flex-shrink: 0;
`

export {
    FeedLayout,
    Avatar,
    FeedMessagesFooter,
    FeedMessagesLayout
}
