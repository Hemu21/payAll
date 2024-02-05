import React, { useContext, useEffect, useState } from 'react'
import { context } from '../App';
import Header from './Header';
import { ethers } from 'ethers';
import Send from './Home/Send';
import Recipients from './Home/Recipients';
import RecentTx from './Home/RecentTx';
import GlobalTx from './Home/GlobalTx';
import { toast } from 'react-toastify';


export default function Home() {
  const {account,symbol,setAccount,click,setClick,chainName,setChainName,setSymbol,deploy_address} = useContext(context);
  const [balance,setBalance] = useState();
  const [opt,setOpt] = useState("send");
  const [recipient,setRecipient] = useState("");

  const changeBalance = (e) =>setBalance(e)
  const changeSymbol = (e) =>setSymbol(e)
  const changeRecipient = (e)=>setRecipient(e)

  const accountHandle = ()=>{
    window.ethereum.request({method:"eth_requestAccounts"}).then((e)=>setAccount(e[0]))
    window.ethereum.request({ method: "eth_chainId" }).then((e) => {
      if (e == "0xaa36a7") {
        setChainName("Sepolia");
        setSymbol("sEth");
        setClick(e)
      } else if (e == "0x13881") {
        //mum
        setChainName("Polygon");
        setSymbol("Matic");
        setClick(e)
      }
    })
  }
  window.ethereum.on('accountsChanged', accountHandle);
  window.ethereum.on('chainChanged', accountHandle);
  useEffect(() => {
    const con = async () => {
      const provide = new ethers.BrowserProvider(window.ethereum);
      const sign = await provide.getSigner()
      sign.getAddress().then((address) => {
        return provide.getBalance(address);
      }).then((balance) => {
        const b = ethers.formatEther(balance)
        setBalance(b.slice(0,b.lastIndexOf(".")+4))
      });
      
    };
    con();
    accountHandle();
  }, [chainName,account]);
  return (
    <div>
      {click && <Header Click={click} />}
      <main className="w-[75%] m-auto mt-[15%] border-[#49989F] rounded-sm bg-[#1D1D1D] flex flex-col border-2">
        <nav className="flex justify-between bg-[#529295] ">
          <div onClick={()=>setOpt("send")} className={`w-[25%] cursor-pointer m-0 rounded-t text-center text-slate-100 max-sm:text-sm  font-semibold ${ opt=="send" && "bg-[#52CFDF]"} text-xl`} >
            Send
          </div>
          <div onClick={()=>setOpt("recipient")} className={`w-[25%] cursor-pointer m-0 rounded-t text-center text-slate-100 max-sm:text-sm  font-semibold ${ opt=="recipient" && "bg-[#52CFDF]"} text-xl`}>
            Recipients
          </div>
          <div onClick={()=>setOpt("recent")} className={`w-[25%] m-0 rounded-t cursor-pointer text-center text-slate-100 max-sm:text-sm  font-semibold ${ opt=="recent" && "bg-[#52CFDF]"} text-xl`}>
            Recent Tx
          </div>
          <div onClick={()=>setOpt("global")} className={`w-[25%] m-0 rounded-t text-center cursor-pointer text-slate-100 max-sm:text-sm  font-semibold ${ opt=="global" && "bg-[#52CFDF]"} text-xl`}>
            Global Tx
          </div>
        </nav>
        {opt=="send"?<Send balance={balance} recipient={recipient} deploy_address={deploy_address} setRecipient={changeRecipient} changeSymbol={changeSymbol} account={account} changeBalance={changeBalance} chainName={chainName} symbol={symbol} />:opt=="recipient"?<Recipients recipient={recipient} deploy_address={deploy_address} chainName={chainName} setRecipient={changeRecipient} />:opt=="recent"?<RecentTx account={account} deploy_address={deploy_address} />:<GlobalTx deploy_address={deploy_address} />}
      </main>
    </div>
  )
}
