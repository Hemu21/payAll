import React, { useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ethers } from 'ethers';
import smart from "../../contract/dist/payAll.json";
import { ClipLoader, ScaleLoader } from 'react-spinners';
import { toast } from 'react-toastify';


export default function Send({balance,symbol,changeSymbol,recipient,setRecipient,chainName,deploy_address,changeBalance,account}) {
    const [click,setClick] = useState(false)
    const [erc20,setErc20] = useState("");
    const [isSelect,setIsSelect] = useState(false)
    const [amount,setAmount] = useState("")
    const [loading,setLoading] = useState(false)
    const [loadTransfer,setLoadTransfer] = useState(false)
 
    const abi = [
        // Read-Only Functions
        "function balanceOf(address owner) view returns (uint256)",
        "function symbol() external view returns (string)",
        "function name() external view returns (string memory)",
        // Authenticated Functions
        "function transfer(address to, uint amount) returns (bool)",
    ];

    const provider = new ethers.BrowserProvider(window.ethereum);
    
    const Transfer = async () =>{
        setLoadTransfer(true)
        const signer = await provider.getSigner() 
        if(isSelect){
            try {
                const ercContract = new ethers.Contract(erc20,abi,signer);
                const tx = await ercContract.transfer(recipient,ethers.parseEther(amount));
                await tx.wait()
                const stx = await ercContract.saveTx(account,recipient,ethers.parseEther(amount),symbol);
                await stx.wait()
                const _balance = ethers.formatEther(await ercContract.balanceOf(account))
                changeBalance(_balance)
                setErc20("");
                setRecipient("")
                setAmount("")
                setIsSelect(false)
                setClick(false)
                setLoadTransfer(false)
                toast("Transaction Successful!",{theme:"colored",type:"success"});
            } catch (error) {
                setLoadTransfer(false)
                toast("Sorry! Transaction is Unsuccessful.",{theme:"colored",type:"error"})
            }
            

        }else{
            try {
                const contract = new ethers.Contract(deploy_address,smart.abi,signer);
                const tx = await contract.Transfer(recipient,symbol,{value: ethers.parseEther(amount)});
                await tx.wait()
                provider.getBalance(account).then((balance) => {
                    const b = ethers.formatEther(balance)
                    changeBalance(b.slice(0,b.lastIndexOf(".")+4))
                })
                setRecipient("")
                setAmount("")
                setLoadTransfer(false)
                toast("Transaction Successful!",{theme:"colored",type:"success"});
            } catch (_error) {
                setLoadTransfer(false)
                toast("Sorry! Transaction is Unsuccessful.",{theme:"colored",type:"error"})
            }

        }
        
    }
    
    const selectBtn = async () =>{
        setLoading(true);
        try {
            const ercContract = new ethers.Contract(erc20,abi,provider)
            const _symbol = await ercContract.symbol()
            const _balance = ethers.formatEther(await ercContract.balanceOf(account))
            changeBalance(_balance)
            changeSymbol(_symbol)
            setIsSelect(true);
            toast("Selected the ERC20 Token",{theme:"colored",type:"success"})
        } catch (error) {
            toast(error,{theme:"colored",type:"error"})
        }
        
        setLoading(false)
    }
    window.ethereum.on('accountsChanged', ()=>{setClick(false);setErc20("");setRecipient("");setIsSelect(false)});
    window.ethereum.on('chainChanged', ()=>{setClick(false);setErc20("");setRecipient("");setIsSelect(false)});
    const removeBtn = async () =>{
        setLoading(true);
        try {
            provider.getBalance(account).then((balance) => {
                const b = ethers.formatEther(balance)
                changeBalance(b.slice(0,b.lastIndexOf(".")+4))
              })
            setIsSelect(false);
            setErc20("")
            chainName=="Sepolia"?changeSymbol("sEth"):changeSymbol("Matic")
            toast("Removed the ERC20 Token",{theme:"colored",type:"info"})
        } catch (error) {
            toast(error,{theme:"colored",type:"error"})
        }
        
        setLoading(false)
    }
  return (
    <div className="flex flex-col w-[85%] m-auto">
        <div className="flex cursor-pointer max-sm:text-sm max-sm:font-normal justify-between mt-[30px] mb-[30px]">
            <div onClick={()=>setClick(!click)} className="flex p-[10px] justify-center items-center border-[#49989F] border-2 rounded-md text-slate-50">
                <MonetizationOnIcon fontSize="small" />
                <p className="ml-[4px]" >{chainName=="Sepolia"?`${chainName} Ether`:`${chainName} MATIC`}</p>
                {!click?<KeyboardArrowDownIcon />:<KeyboardArrowUpIcon />}
            </div>
            <div className="flex p-[10px] justify-center items-center border-[#49989F] border-2 rounded-md text-slate-50">
                <AccountBalanceWalletIcon />
                <p className="ml-[4px]" >Balance : {balance} {symbol} </p>
            </div>
        </div>
        {click && <div className="flex justify-between mb-[30px]">
            <input onChange={(e)=>{setErc20(e.target.value)}} value={erc20} className="flex items-center p-[10px] bg-[#1D1D1D] w-[60%] border-[#49989F] border-2 rounded-md text-slate-50" placeholder='Paste ERC20 Token Address' />
            {!isSelect?<button onClick={()=>{selectBtn()}} className="flex justify-center font-semibold items-center p-[10px] hover:bg-[#0a72f1] bg-[#169aec] w-[30%] border-[#49989F] border-2 rounded-md text-slate-50">{loading?<ClipLoader color="#faf7f7" />:"Select"}</button> 
            :<button onClick={()=>{removeBtn()}} className="flex justify-center font-semibold items-center p-[10px] hover:bg-[#bd0707] bg-[#f22626] w-[30%] border-[#49989F] border-2 rounded-md text-slate-50">{loading?<ClipLoader color="#faf7f7" />:"Remove"}</button>} 
        </div>}
        <div className="flex justify-between mb-[30px]">
            <input onChange={(e)=>setRecipient(e.target.value)} value={recipient} className="flex items-center p-[10px] bg-[#1D1D1D] w-[65%] border-[#49989F] border-2 rounded-md text-slate-50" placeholder='Paste Recipient Address' />
            <input onChange={(e)=>setAmount(e.target.value)} value={amount} type="number" className="flex items-center p-[10px] bg-[#1D1D1D] w-[23%] border-[#49989F] border-2 rounded-md text-slate-50" placeholder='Amount' /> 
        </div>
        <div className="flex justify-between mb-[30px]">
            <button onClick={Transfer} className="flex justify-center font-semibold items-center p-[10px] hover:bg-[#25ee4a] bg-[#0af68c] w-[100%] m-auto border-[#49989F] border-2 rounded-md text-slate-50">{loadTransfer?<ScaleLoader />:"Transfer"}</button>
        </div>
    </div>
  )
}
