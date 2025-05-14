import { useAccount, useWalletClient } from "wagmi";
import { Contract, BrowserProvider, parseEther, formatEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import {ethers} from "ethers";
export const useStakeGameFunctions = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const getSigner = async () => {
    if (!walletClient) throw new Error("Wallet client not available");
    const provider = new BrowserProvider(window.ethereum);
    return await provider.getSigner(walletClient.account.address);
  };

  const getBalance = async () => {
    if (!address) throw new Error("Address not available");
    const provider = new BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return formatEther(balance); // Return human-readable ETH balance
  };

  const placeBet = async (betValue: number, game: number) => {
    if (!walletClient || !address) {
      throw new Error("Wallet not connected");
    }

    const signer = await getSigner();
    const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

    const value = parseEther(betValue.toFixed(18).toString());

    const tx = await contract.placeBet(game, { value });
    const receipt = await tx.wait();
    return receipt;
  };

 const getGameResultPlinko = async (sessionId: number) => {
  const signer = await getSigner();
  const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

  // Call the result function on-chain
  const tx = await contract.plinkoGameResult(sessionId);
  const receipt = await tx.wait();

  // Define the correct event signature
  const GAME_RESULT_EVENT_SIG = ethers.id("GameResult(uint256,bool,uint256,uint256,uint8)");

  // Find the matching log
  const log = receipt.logs.find(
    (log: any) => log.topics[0].toLowerCase() === GAME_RESULT_EVENT_SIG.toLowerCase()
  );

  if (!log) throw new Error("GameResult event not found in logs");

  const iface = new ethers.Interface(CONTRACT_ABI);
  const decoded = iface.decodeEventLog("GameResult", log.data, log.topics);

  const multiplier1 = Number(decoded.multiplier);
  const point = Number(decoded.outcome);

  return {multiplier1, point};
};
  const withdrawWinnigs = async (sessionId: number) => {
  console.log("Resolving game for session:", sessionId);

  const signer = await getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

  const tx = await contract.resolveGame(sessionId);
  const receipt = await tx.wait();
  console.log("Withdraw receipt:", receipt);

  const GAME_WITHDRAW_TOPIC = ethers.id("GameWithDraw(uint256,uint256)");

  const log = receipt.logs.find(
    (log: any) => log.topics[0].toLowerCase() === GAME_WITHDRAW_TOPIC.toLowerCase()
  );

  if (!log) {
    console.warn("No GameWithDraw event found.");
    throw new Error("Withdrawal event not found");
  }

  // sessionId is in topics[1], payout in data
  const session = Number(BigInt(log.topics[1])); // from indexed param
  const payout = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], log.data)[0];

  console.log("Decoded:", { session, payout });

  return {
    sessionId: session,
    payout: Number(ethers.formatEther(payout)), // ETH
    receipt,
  };
};
  return {
    placeBet,
    getGameResultPlinko,
    getBalance,
    getSigner,
    address,
    withdrawWinnigs

  };
};
