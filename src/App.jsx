import "./index.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import { createContext, useEffect, useState } from "react";

const context = createContext();
function App() {
  const [account, setAccount] = useState();
  const [chainName, setChainName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [click,setClick] = useState();
  const [chain,setChain] = useState()
  const deploy_address = "0xf18fC0902f53c9BbAFb60dDC4c7A66b8e902dC02";
  const changeChain = async () =>{
    await ethereum.request({method:"eth_chainId"}).then((id)=>setChain(id))
  }
  useEffect(()=>{
    changeChain()
  },[])
  return (
    <context.Provider value={{ account,click,setClick,symbol,setAccount,chainName,setChainName,setSymbol,setChain,deploy_address,chain,changeChain }}>
      <ToastContainer autoClose={2500} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </context.Provider>
  );
}

export default App;
export { context };
