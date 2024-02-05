import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { context } from "../App";
import { toast } from "react-toastify";

export default function LogIn() {
  const navigate = useNavigate();
  const { ethereum } = window;
  
  const [error, setError] = useState();
  const cont = useContext(context)
  const {changeChain,chain} = cont
  changeChain()
  window.ethereum.on('accountsChanged', changeChain);
  window.ethereum.on('chainChanged', changeChain);
  const con = async () => {
    changeChain()
    try {
      if(chain=="0xaa36a7"){
        await ethereum.request({
          method: "wallet_requestPermissions",
          params:[{eth_accounts:{}}]
        });
        const _accounts = await ethereum.request({
          method: "eth_requestAccounts"
        });
        const isAccount = await _accounts[0];
        cont.setAccount(isAccount);
        navigate("/home");
      toast("Login Successful!",{theme:"colored",type:"success"})
    }else{
      toast("This is personal project. Supports only SepoliaETH !",{theme:"colored",type:"error"})
    }
    } catch (_error) {
      toast(`${_error.message}`,{theme:"colored",type:"error"});
    }

  };
  const Connect = () => {
    if (ethereum != undefined) {
      con();
    } else {
      window.open(
        "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        "_parent"
      );
    }
  };
  return (
    <div className="w-[90%] m-auto translate-y-1/2 flex flex-col justify-center">
      <img
        className="h-[100px] w-[300px] m-auto translate-y-1/4"
        src="/logo.jpg"
        alt="logo"
      />
      <div className="h-[200px] w-[300px] m-auto text-center flex flex-col justify-center">
        <p className="h-[50px] w-[130px] m-auto font-extrabold text-slate-200 text-5xl ">
          Login
        </p>
        <button
          className="h-[50px] border-1 hover:shadow-xl rounded-lg w-[200px] m-auto bg-green-700 hover:bg-green-500 items-center text-slate-100 text-2xl flex justify-center pl-[5px] cursor-pointer"
          onClick={Connect}
        >
          {" "}
          {ethereum ? "Connect" : "Install"}{" "}
          <img
            className="h-[32px] w-[32px] m-auto mr-0 ml-[10px]"
            src="/metamask-icon.webp"
          />{" "}
        </button>
        {ethereum !== undefined ? (
          <></>
        ) : (
          <p className="w-[270px] m-auto text-wrap text-red-600 font-semibold text-lg">
            please Install metamask extention to continue
          </p>
        )}
        
      </div>
    </div>
  );
}
