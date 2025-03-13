import { ethers } from "ethers";
import getConfig from "next/config";
import { useEffect, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { RootState, AppDispatch } from './store'
import MarketABI from "@/contracts/Market.json";

const { publicRuntimeConfig } = getConfig();


export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useContract = (provider?: ethers.providers.Web3Provider | null) => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    if (!provider) {
      setContract(null);
      return;
    } else {
      const marketContract = new ethers.Contract(publicRuntimeConfig.holesky, MarketABI.abi, provider.getSigner());
      setContract(marketContract);
    }
  }, [provider]);

  return contract;
};
