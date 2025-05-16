import { Interface } from "ethers";

interface ToastMessage {
  heading: string;
  content: string;
}

interface Receipt {
  logs: any[];
}

interface BetResult {
  receipt: Receipt;
  gameResult: any;
}

type PlaceBetResponse = Receipt | BetResult;


export async function PlaceBet(
  betAmount: number,
  placeBet: (
    amount: number,
    gameType: number,
    betnum?: number,
    rollu?: boolean
  ) => Promise<PlaceBetResponse>,
  setSessionId: (sessionId: number) => void,
  toast: any,
  CONTRACT_ABI: any,
  BET_PLACED_EVENT_SIGNATURE: string,
  game: number,
  betnum?: number,
  rollu?: boolean
): Promise<any> {
  if (betAmount <= 0) {
    toast.open({
      message: {
        heading: "Insufficient Balance",
        content: "Please enter a valid bet amount.",
      },
      duration: 5000,
      position: "top-center",
      color: "warning",
    });
    return;
  }
  try {
    let res = null;
    if (game != 0) {
      res = await placeBet(betAmount, game, betnum, rollu);
    } else {
      res = await placeBet(betAmount, game);
    }

    console.log("Transaction Receipt:", res); 
    const receipt = game == 2 ? (res as Receipt) : ((res as unknown as { receipt: Receipt }).receipt);
    if (!receipt) {
      toast.open({
        message: {
          heading: "Transaction Failed",
          content: "Transaction receipt is null.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
      throw new Error("Transaction receipt is null");
    }
    // Find the BetPlaced event log
    const log = receipt.logs.find(
      (log: any) =>
        log.topics[0].toLowerCase() === BET_PLACED_EVENT_SIGNATURE.toLowerCase()
    );

    if (!log) {
      toast.open({
        message: {
          heading: "Bet Event Missing",
          content: "⚠️ BetPlaced event not found in transaction logs.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
      throw new Error("BetPlaced event not found in logs");
    }

    // Decode using Interface
    const iface = new Interface(CONTRACT_ABI);
    const decoded = iface.decodeEventLog("BetPlaced", log.data, log.topics);

    const sessionId = Number(decoded.sessionId);
    setSessionId(sessionId);

    console.log(
      "✅ Bet placed with sessionId:",
      sessionId,
      "for amount of ",
      betAmount
    );
    toast.open({
      message: {
        heading: "Bet Placed",
        content: `Bet Amount: ${betAmount} ETH`,
      },
      duration: 5000,
      position: "top-center",
      color: "success",
    });
    if (game != 2) return (res as BetResult).gameResult;

  } catch (error) {
    console.error("Bet placement failed:", error);
    toast.open({
      message: {
        heading: "Bet Failed",
        content: "An error occurred while placing the bet.",
      },
      duration: 5000,
      position: "top-center",
      color: "error",
    });
  } 
}

export async function Withdraw(
  sessionId: number | null,
  withdrawWinnigs: (sessionId: number) => Promise<{ payout: number }>,
  setIsWithdrawing: (isWithdrawing: boolean) => void,
  setSessionId: (sessionId: number | null) => void,
  toast: any
): Promise<void> {
  if (sessionId === null) {
    toast.open({
      message: {
        heading: "No Session",
        content: "No session found. Please place a bet first.",
      },
      duration: 5000,
      position: "top-center",
      color: "warning",
    });
    return;
  }
  setIsWithdrawing(true);
  try {
    console.log("Starting withdrawal...");
    const { payout } = await withdrawWinnigs(sessionId);
    toast.open({
      message: {
        heading: "Withdrawal Successful",
        content: `You have withdrawn ${payout} ETH.`,
      },
      duration: 5000,
      position: "top-center",
      color: "success",
    });

    setSessionId(null);
  } catch (error: any) {
    // console.error("Withdraw failed:", error);
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("already resolved")) {
      toast.open({
        message: {
          heading: "Session Resolved",
          content: "⚠️ This session has already been resolved.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
    } else if (msg.includes("invalid session")) {
      toast.open({
        message: {
          heading: "Invalid Session",
          content: "❌ Invalid session ID.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
    } else if (msg.includes("transfer failed")) {
      toast.open({
        message: {
          heading: "Transfer Failed",
          content: "❌ ETH transfer failed. Try again later.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
    } else if (msg.includes("withdrawal event not found")) {
      toast.open({
        message: {
          heading: "Withdrawal Event Missing",
          content: "⚠️ No withdrawal event found. Please check manually.",
        },
        duration: 5000,
        position: "top-center",
        color: "warning",
      });
    } else {
      toast.open({
        message: {
          heading: "Withdrawal Failed",
          content: "❌ Withdrawal failed.",
        },
        duration: 5000,
        position: "top-center",
        color: "error",
      });
    }
  } finally {
    setIsWithdrawing(false);
  }
}
