import { useAccount, useWalletClient } from "wagmi";
import { Contract, BrowserProvider, parseEther, formatEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { ethers } from "ethers";
// import { encodeActions, Swap } from '@uniswap/v4-sdk'
export const useStakeGameFunctions = () => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const getSigner = async () => {
    if (!walletClient) return null;
    const provider = new BrowserProvider(window.ethereum);
    return await provider.getSigner(walletClient.account.address);
  };

  const getBalance = async () => {
    if (!address) throw new Error("Address not available");
    const provider = new BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(address);
    return formatEther(balance); 
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
  if (game === 2) {
    tx = await contract.placeBet(game, betnum, rollu ?? false, { value });
  } else if (game === 1) {
    tx = await contract.placeBet(game, betnum ?? 1, rollu ?? false, { value });
  } else {
    tx = await contract.placeBet(game, 0, false, { value });
  }

  const receipt = await tx.wait();

  const iface = new ethers.Interface(CONTRACT_ABI);

  if (game === 0) {
    // Plinko game result event decoding
    const GAME_RESULT_EVENT_SIG = ethers.id(
      "GameResult(uint256,bool,uint256,uint256,uint8)"
    );
    const gameResultLog = receipt.logs.find(
      (log: any) => log.topics[0].toLowerCase() === GAME_RESULT_EVENT_SIG.toLowerCase()
    );
    if (!gameResultLog) throw new Error("GameResult event not found");

    const decoded = iface.decodeEventLog(
      "GameResult",
      gameResultLog.data,
      gameResultLog.topics
    );
    console.log( {
      receipt,
      gameResult: {
        multiplier1: Number(decoded.multiplier),
        point: Number(decoded.outcome),
      },
    });
    

    return {
      receipt,
      gameResult: {
        multiplier1: Number(decoded.multiplier),
        point: Number(decoded.outcome),
      },
    };
  } else if (game === 1) {
    // Dice game result event decoding
    const GAME_RESULT_DICE_SIG = ethers.id(
      "GameResultDice(uint256,bool,uint256,uint256)"
    );
    const gameResultLog = receipt.logs.find(
      (log: any) => log.topics[0].toLowerCase() === GAME_RESULT_DICE_SIG.toLowerCase()
    );
    if (!gameResultLog) throw new Error("GameResultDice event not found");

    const decoded = iface.decodeEventLog(
      "GameResultDice",
      gameResultLog.data,
      gameResultLog.topics
    );
    console.log({
      receipt,
      gameResult: {
        isWin: decoded.isWin,
        payout: Number(ethers.formatEther(decoded.payout)),
        outcome: Number(decoded.outcome),
      },
    });
    

    return {
      receipt,
      gameResult: {
        isWin: decoded.isWin,
        payout: Number(ethers.formatEther(decoded.payout)),
        outcome: Number(decoded.outcome),
      },
    };
  }

  return receipt;
};

  // const getGameResultPlinko = async (sessionId: number) => {
  //   const signer = await getSigner();
  //   const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

  //   const tx = await contract.plinkoGameResult(sessionId);
  //   const receipt = await tx.wait();

  //   const GAME_RESULT_EVENT_SIG = ethers.id(
  //     "GameResult(uint256,bool,uint256,uint256,uint8)"
  //   );

  //   const log = receipt.logs.find(
  //     (log: any) =>
  //       log.topics[0].toLowerCase() === GAME_RESULT_EVENT_SIG.toLowerCase()
  //   );

  //   if (!log) throw new Error("GameResult event not found in logs");

  //   const iface = new ethers.Interface(CONTRACT_ABI);
  //   const decoded = iface.decodeEventLog("GameResult", log.data, log.topics);

  //   return {
  //     multiplier1: Number(decoded.multiplier),
  //     point: Number(decoded.outcome),
  //   };
  // };

  // const getGameResultDice = async (sessionId: number) => {
  //   const signer = await getSigner();
  //   const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

  //   const tx = await contract.DiceGameResult(sessionId);
  //   const receipt = await tx.wait();

  //   const GAME_RESULT_DICE_SIG = ethers.id(
  //     "GameResultDice(uint256,bool,uint256,uint256)"
  //   );

  //   const log = receipt.logs.find(
  //     (log: any) =>
  //       log.topics[0].toLowerCase() === GAME_RESULT_DICE_SIG.toLowerCase()
  //   );

  //   if (!log) throw new Error("GameResultDice event not found in logs");

  //   const iface = new ethers.Interface(CONTRACT_ABI);
  //   const decoded = iface.decodeEventLog(
  //     "GameResultDice",
  //     log.data,
  //     log.topics
  //   );

  //   return {
  //     isWin: decoded.isWin,
  //     payout: Number(ethers.formatEther(decoded.payout)),
  //     outcome: Number(decoded.outcome),
  //   };
  // };

  const playMinesTile = async (sessionId: number) => {
    if (!walletClient || !address) {
      throw new Error("Wallet not connected");
    }

    const signer = await getSigner();
    const contract = new Contract(CONTRACT_ADDRESS!, CONTRACT_ABI, signer);

    // Call playMinesTile function on contract (this is a transaction)
    const tx = await contract.playMinesTile(sessionId);
    const receipt = await tx.wait();

    // The event signature of GameResult (from your Solidity)
    const GAME_RESULT_EVENT_SIG = ethers.id(
      "GameResult(uint256,bool,uint256,uint256,uint8)"
    );

    // Find the log event emitted by playMinesTile
    const log = receipt.logs.find(
      (log: any) =>
        log.topics[0].toLowerCase() === GAME_RESULT_EVENT_SIG.toLowerCase()
    );

    if (!log) throw new Error("GameResult event not found in logs");

    // Decode the event data using your ABI
    const iface = new ethers.Interface(CONTRACT_ABI);
    const decoded = iface.decodeEventLog("GameResult", log.data, log.topics);

    return {
      isWin: decoded.isWin as boolean,
      payout: Number(ethers.formatEther(decoded.payout)),
      multiplier: Number(decoded.multiplier) / 100000,
      safeTilesFound: Number(decoded.outcome),
    };
  };

  const withdrawWinnigs = async (sessionId: number) => {
    const signer = await getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS!,
      CONTRACT_ABI,
      signer
    );

    const tx = await contract.resolveGame(sessionId);
    const receipt = await tx.wait();

    const GAME_WITHDRAW_TOPIC = ethers.id("GameWithDraw(uint256,uint256)");

    const log = receipt.logs.find(
      (log: any) =>
        log.topics[0].toLowerCase() === GAME_WITHDRAW_TOPIC.toLowerCase()
    );

    if (!log) throw new Error("Withdrawal event not found");

    const session = Number(BigInt(log.topics[1])); // indexed param
    const payout = ethers.AbiCoder.defaultAbiCoder().decode(
      ["uint256"],
      log.data
    )[0];

    return {
      sessionId: session,
      payout: Number(ethers.formatEther(payout)),
      receipt,
    };
  };
  const getAllSessions = async () => {
    const signer = await getSigner();
    const runner = signer ? signer : new BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS!,
      CONTRACT_ABI,
      runner
    );
    if(!address || !contract) return [];
    const sessions = await contract.getAllSessions();
    if (!sessions || sessions.length === 0) {
      console.log("No sessions found");
      return [];
    }
    const formatted = sessions.map((session: any) => {
          return {
        sessionId: Number(session.sessionId),
        player: session.player,
        game: Number(session.game),
        betAmount: Number(ethers.formatEther(session.betAmount)),
        isWin: session.isWin,
        payout: Number(ethers.formatEther(session.payout)),
        isplayed: session.isplayed,
        isresolved: session.isresolved,
        timestamp: Number(session.timestamp),
        betnum: session.betnum,
        rollu: session.rollu,
        safeTilesFound: session.safeTilesFound,
      };
    });

    // console.log(sessions);
    // console.log("hello");
    return formatted;
  };
  const getUserSessionList = async () => {
    const signer = await getSigner();
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS!,
      CONTRACT_ABI,
      signer
    );

    const usersessionsArray = await contract.getUserSessions(address);

    console.log(usersessionsArray);
  };

  //   const swapFunction=async()=>{
  //     const swapAction: Swap = {
  //   type: 'swapExactInputSingle',
  //   tokenIn: tokenInAddress,
  //   tokenOut: tokenOutAddress,
  //   amountIn: amountIn,            // BigInt or ethers.BigNumber
  //   amountOutMinimum: amountOutMin, // slippage protection
  //   recipient: userAddress,
  //   deadline: deadlineTimestamp
  // }
  // const calldata = encodeActions([swapAction]);
  // const tx = await routerContract.execute(calldata, { value: amountInForETH });
  // await tx.wait();

  //   }

  return {
    placeBet,
    // getGameResultPlinko,
    // getGameResultDice,
    getBalance,
    getSigner,
    address,
    withdrawWinnigs,
    getAllSessions,
    getUserSessionList,
    playMinesTile,
  };
};