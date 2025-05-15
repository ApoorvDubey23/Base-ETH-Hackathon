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
    return formatEther(balance); // human-readable ETH balance
  };

  const placeBet = async (
    betValue: number,
    game: number,
    betnum?: number,
    rollu?: boolean
  ) => {
    if (!walletClient || !address) {
      throw new Error("Wallet not connected");
    }

    const signer = await getSigner();
    const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

    const value = parseEther(betValue.toFixed(18).toString());

    let tx;
    if (game === 1) {
      tx = await contract.placeBet(game, betnum ?? 1, rollu ?? false, { value });
    } else {
      tx = await contract.placeBet(game, 0, false, { value });
    }
    const receipt = await tx.wait();
    return receipt;
  };

  const getGameResultPlinko = async (sessionId: number) => {
    const signer = await getSigner();
    const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

    const tx = await contract.plinkoGameResult(sessionId);
    const receipt = await tx.wait();

    const GAME_RESULT_EVENT_SIG = ethers.id("GameResult(uint256,bool,uint256,uint256,uint8)");

    const log = receipt.logs.find(
      (log: any) => log.topics[0].toLowerCase() === GAME_RESULT_EVENT_SIG.toLowerCase()
    );

    if (!log) throw new Error("GameResult event not found in logs");

    const iface = new ethers.Interface(CONTRACT_ABI);
    const decoded = iface.decodeEventLog("GameResult", log.data, log.topics);

    return { multiplier1: Number(decoded.multiplier), point: Number(decoded.outcome) };
  };

  const getGameResultDice = async (sessionId: number) => {
    const signer = await getSigner();
    const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

    const tx = await contract.DiceGameResult(sessionId);
    const receipt = await tx.wait();

    const GAME_RESULT_DICE_SIG = ethers.id("GameResultDice(uint256,bool,uint256,uint8)");

    const log = receipt.logs.find(
      (log: any) => log.topics[0].toLowerCase() === GAME_RESULT_DICE_SIG.toLowerCase()
    );

    if (!log) throw new Error("GameResultDice event not found in logs");

    const iface = new ethers.Interface(CONTRACT_ABI);
    const decoded = iface.decodeEventLog("GameResultDice", log.data, log.topics);

    return {
      isWin: decoded.isWin,
      payout: Number(ethers.formatEther(decoded.payout)),
      outcome: Number(decoded.outcome),
    };
  };

  const withdrawWinnigs = async (sessionId: number) => {
    const signer = await getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

    const tx = await contract.resolveGame(sessionId);
    const receipt = await tx.wait();

    const GAME_WITHDRAW_TOPIC = ethers.id("GameWithDraw(uint256,uint256)");

    const log = receipt.logs.find(
      (log: any) => log.topics[0].toLowerCase() === GAME_WITHDRAW_TOPIC.toLowerCase()
    );

    if (!log) throw new Error("Withdrawal event not found");

    const session = Number(BigInt(log.topics[1])); // indexed param
    const payout = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], log.data)[0];

    return {
      sessionId: session,
      payout: Number(ethers.formatEther(payout)),
      receipt,
    };
  };

  return {
    placeBet,
    getGameResultPlinko,
    getGameResultDice,
    getBalance,
    getSigner,
    address,
    withdrawWinnigs,
  };
};
