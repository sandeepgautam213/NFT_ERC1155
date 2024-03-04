"use client";
import { useState, useEffect } from "react";
import { ethers, BaseContract , BrowserProvider } from "ethers";
import styles from "./page.module.css"
import NFT1 from "../../artifacts/contracts/NFT.sol/NFT.json";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import nftImage from "./assets/images/nft.jpg";
import {NFT} from "../../typechain-types";





export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [signer , setSigner]  = useState<ethers.JsonRpcSigner>();
  const [contract, setContract] = useState< NFT | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [burnloading, setBurnloading] = useState<boolean>(false);
  const [connect, setConnect] = useState<string>("");

  const [mintPrice, setMintPrice] = useState<string>("0");

  const [burnPrice, setBurnPrice] = useState<string>("0");

  const contractAddress = "0x210a37E01089d1160A9af5D32bDFAc7348FB99e6";

  useEffect(() => {
    setConnect(localStorage.getItem("address") ?? "");
  }, []);

  useEffect(() => {
    const provider = new BrowserProvider(window.ethereum);
    window.ethereum.on("accountsChanged", async () => {
      try {
        const Signer = await provider.getSigner();
        const address = await Signer.getAddress();
        setAccount(address);
        setSigner(Signer);
        localStorage.setItem("address", address);
        setConnect(localStorage.getItem("address") ?? "");
      } catch (error) {
        const err = error as Error;
        const accounts = await provider.listAccounts();
        if (accounts.length === 0) {
          localStorage.removeItem("address");
          setConnect("");
          toast("Account not connected!");
          return;
        }
        const errorMessage = err.message.split("(")[0];
        toast(errorMessage);
      }
    });
  }, []);

  useEffect(() => {
    const setContractVal = async () => {
      try {
       
        
        const contract = new   ethers.Contract(contractAddress, NFT1.abi, signer) as BaseContract as NFT;

       
        setContract(contract);
        const mintPrice = await contract.mintPrice();
        setMintPrice(ethers.formatEther(mintPrice));
        setBurnPrice(localStorage.getItem("burnPrice") ?? "0");

     
      } catch (error) {
        const err = error as Error;
        const errorMessage = err.message.split("(")[0];
        toast(errorMessage);
      }
    };

    setContractVal();
  }, [connect]);

  const connectWallet = async () => {
    try {
      const provider = new BrowserProvider(window.ethereum);
      if (!connect) {
        const accounts = await provider.send("eth_requestAccounts", []);
        if (accounts) {
         
         
          localStorage.setItem("address", account);
          const contract = new ethers.Contract(contractAddress, NFT1.abi, signer) as BaseContract as NFT;
          
          setContract(contract);
         
          setConnect(localStorage.getItem("address") ?? "");
        }
      }
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message.split("(")[0];
      toast(errorMessage);
    }
  };

  const mintNFT = async () => {
    const provider = new BrowserProvider(window.ethereum);
    const { chainId } = (await provider.getNetwork());
    if (Number(chainId)  !== 11155111) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xAA36A7" }],
      });
    }
   
    setLoading(true);
    try {
      const mintPrice = await contract?.mintPrice();
      setMintPrice(ethers.formatEther(Number(mintPrice)));
      const options = { value: mintPrice };
      
      const mint :ethers.ContractTransactionResponse | undefined  = await contract?.mint(0,1, options);
      await mint?.wait();
      toast("Mint Successful");
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message.split("(")[0];
      toast(errorMessage);
    }
    setLoading(false);
  };

  const burn = async () => {
    try {
      setBurnloading(true);
      const supply  = Number(await contract?.["totalSupply(uint256)"](0)) ;
       
      
      const n  = parseInt(supply.toString()) - 1;
      const burnPrice = (n * n) / 8000;
      setBurnPrice(burnPrice.toString());
      if (parseInt(supply.toString()) === 1) {
        setBurnPrice("0.0001");
      }
      localStorage.setItem("burnPrice", parseInt(supply.toString()) === 0 ? "0.0001" : burnPrice.toString());
      const burn = await contract?.["burn(uint256,uint256)"](0,1);
      await burn?.wait();
      toast("Burn Successful");
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message.split("(")[0];
      toast(errorMessage);
    }
    setBurnloading(false);
  };

  return (
    <>
  <ToastContainer position="top-right" />
  <div>
    <nav className="flex justify-between items-center bg-blue-500 p-4">
      <h2 className="text-xl font-bold text-white">MINT NFT</h2>
      {connect ? (
        <p className="text-white">
          {`${localStorage.getItem("address")?.slice(0, 7)}...${localStorage.getItem("address")?.slice(-5)}`}
        </p>
      ) : (
        <button className="bg-white text-blue-500 px-4 py-2 rounded-md shadow-md hover:bg-blue-400 hover:text-white" onClick={connectWallet}>
          Connect
        </button>
      )}
    </nav>
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center items-center">
        <div className="w-64 h-64 border border-gray-300 rounded-lg overflow-hidden">
          <div className="h-full">
            <Image src={nftImage} alt="" className="object-cover w-full h-full" />
          </div>
        </div>
        {connect && (
          <>
          <button className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-400 focus:outline-none" onClick={mintNFT}
           disabled={loading || burnloading}>
           {!loading && `Mint Price  = ${mintPrice} Eth`}
                  {loading && (
                    <div>
                      Minting <p className={styles.spinner}></p>
                    </div>
                  )}
          </button>
          { (
                  <button
                    disabled={burnloading || loading}
                    className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-400 focus:outline-none"
                    onClick={burn}
                  >
                    {!burnloading && `Burn Price = ${burnPrice} Eth`}
                    {burnloading && (
                      <div>
                        Burning <p className={styles.spinner}></p>
                      </div>
                    )}
                  </button>
                )}


          
          

          </>
        )}
        
      </div>
     
    </div>
  </div>
</>

   
  );
}
