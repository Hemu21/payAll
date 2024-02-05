import React, { useEffect, useState } from 'react'
import smart from "../../contract/dist/payAll.json"
import { ethers } from 'ethers'

export default function GlobalTx({deploy_address}) {
  const [data,setData] = useState([])
  const [transaction,setTransaction] = useState([])
  const provider = new ethers.BrowserProvider(window.ethereum);
  const rctx = async () =>{
    setData([])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(deploy_address,smart.abi,signer)
    const res = contract.filters.Transations()
    contract.queryFilter(res).then((e)=>e.map((ele)=>{setTransaction((pre)=>[...pre,ele.transactionHash]);setData((pre)=>[...pre,ele.args])}))
  
  }
  useEffect(()=>{
    rctx()
  },[])
  console.log(data)
  return (
    <div className="flex flex-col pt-[30px] min-h-[200px] w-[75%] m-auto">
      {data!=[] && data.reverse().map((d,i)=>{return(<div key={i} className="flex cursor-pointer flex-col mb-[20px] flex-wrap max-sm:overflow-x-scroll text-wrap bg-[#1D1D1D] w-[100%] border-[#49989F] border-2 rounded-md text-slate-50">
            <h5 className="ml-[4%] mt-[10px]">Amount: {ethers.formatEther(d[2])} {d[3]}</h5>
            <p className="ml-[4%] w-[100%] mt-[5px] mb-[5px] max-md:text-xs ">From: {d[0]} </p>
            <p className="ml-[4%] w-[100%] mt-[5px] mb-[5px] max-md:text-xs ">To: {d[1]} </p>
            <div id={i} onClick={(e)=>window.open(`https://sepolia.etherscan.io/tx/${transaction.reverse()[e.currentTarget.id]}`)} className="bg-teal-700 hover:bg-emerald-500 w-full rounded-b text-center font-semibold">
              View Transaction
            </div>
        </div>)})}
    </div>
  )
}
