import React, { useContext, useEffect, useState } from "react";
import { context } from "../App";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function () {
  const [account, setAccount] = useState("");
  window.ethereum.request({ method: "eth_requestAccounts" }).then((e) => setAccount(e[0]));
    
  return (
    <div className="w-full flex justify-between h-[50px]">
      <img src="/logo.jpg" />
      <div className="flex relative w-[350px]">
        <div className="bg-teal-900 rounded-xl mt-auto justify-center w-[160px] pl-[5px] h-[40px] flex">
          <p className="text-slate-100 m-auto text-lg font-bold">{`${account.slice(
            0,
            6
          )}.....${account.slice(38)}`}</p>
          <AccountBalanceWalletIcon className="text-slate-100 m-auto " />
        </div>
        <div className={`bg-teal-900 "0x13881" hover:bg-teal-950 cursor-pointer rounded-xl ml-[20px] mt-auto justify-center w-[150px] pl-[5px] h-[40px] flex`}>
          <img className="h-full" src="/Ethereum.png" alt="logo" />
          <p className="text-slate-100 m-auto ml-[0] text-lg font-bold">
            Sepolia
          </p>
        </div>
      </div>
    </div>
  );
}
