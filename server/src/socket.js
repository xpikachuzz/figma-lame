import {io} from "socket.io-client"


// 1st arg is backend url.
const socket = new io("http://figma-lame-production.up.railway.app", {
  // to connect manually only
  autoConnect: false,
})


export default socket