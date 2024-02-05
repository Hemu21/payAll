import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import smart from "../../contract/dist/payAll.json"
import { PropagateLoader } from 'react-spinners'
import { toast } from 'react-toastify'

export default function Recipients({recipient,chainName,deploy_address,setRecipient}) {
  const [name,setName] = useState("")
  const [address,setAddress] = useState(recipient)
  const [loading,setLoading] = useState(false)
  const [data,setData] = useState([])
  const provider = new ethers.BrowserProvider(window.ethereum);
  const getData = async ()=>{
    setData([])
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(deploy_address,smart.abi,signer)
    const _res = contract.filters.SaveName()
    contract.queryFilter(_res).then((e)=>e.map((ele,i)=>setData(dat=>[...dat,ele.args])))

  }

  const fech = async ()=>{
    try{
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(deploy_address,smart.abi,signer)
      const save = await contract.addRecipient(address,name)
      await save.wait()
      setAddress("");
      setName("")
      getData()
      toast("Recipient Name Saved Successfully!",{theme:"colored",type:"success"})
    }catch(err){
      toast("Sorry! Resipient Name Not Saved.",{type:"error",theme:"colored"})
    }
  }
  const addRecipient = async () =>{
    if(data.length==0){
      setLoading(true)
      await fech()
      setLoading(false)
    }else{
    setLoading(true)
    data.map( async (ele)=>{
      if(ele[0]==name && ele[1] == address){
        console.log("name")
        toast(`${name} and ${address} Already Used!`,{theme:"colored",type:"error"})
        setLoading(false)
      }else if(ele[1]==address){
        console.log("addres")
        setLoading(false)
        toast(`${address} Already Used!`,{theme:"colored",type:"error"})
      }else if(ele[0]==name){
        setLoading(false)
        console.log("both")
        toast(`${name} Already used!`,{theme:"colored",type:"error"})
      }else{
        await fech() 
        setLoading(false)
      }
    })  
    
  }
    
  }
  const handleClick = (e)=>{
    const res = data[e.currentTarget.id]
    setRecipient(res[1])
    toast(`${res[0]} Address is selected!`,{theme:"colored",type:"info"})
  }
  useEffect(()=>{
    getData()
  },[])


  return (
    <div className="flex flex-col w-[75%] m-auto">
        <div className="flex flex-col justify-around mb-[30px]">
            <input onChange={(e)=>setAddress(e.target.value)} value={address} className="flex items-center p-[10px] bg-[#1D1D1D] mt-[45px] w-[100%] border-[#49989F] border-2 rounded-md text-slate-50" placeholder='Paste Recipient Address' />
            <input onChange={(e)=>setName(e.target.value)} value={name} className="flex items-center p-[10px] bg-[#1D1D1D] mt-[25px] w-[100%] border-[#49989F] border-2 rounded-md text-slate-50" placeholder='Paste Recipient Name' /> 
        </div>
        <div className="flex justify-between mb-[40px]">
            <button onClick={addRecipient} className={`flex justify-center font-semibold items-center ${loading?"pt-[15px] pb-[25px]":"p-[10px]"} hover:bg-[#25ee4a] bg-[#0af68c] w-[100%] m-auto border-[#49989F] border-2 rounded-md text-slate-50`}>{loading?<PropagateLoader />: "Add Recipient"}</button>
        </div>
        {data!=[] && data.map((d,i)=>{return(<div key={i} id={i} onClick={handleClick} className="flex cursor-pointer flex-col mb-[20px] p-[10px] flex-wrap max-sm:overflow-x-scroll text-wrap bg-[#1D1D1D] w-[100%] border-[#49989F] border-2 rounded-md text-slate-50">
            <h5 className="ml-[4%] mt-[10px]">Name: {d[0]}</h5>
            <p className="ml-[4%] w-[100%] mt-[5px] mb-[5px] max-md:text-xs ">address: {d[1]} </p>
        </div>)})}
    </div>
  )
}
