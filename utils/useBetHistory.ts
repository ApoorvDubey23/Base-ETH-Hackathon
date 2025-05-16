import { useEffect, useState } from "react";
import { useStakeGameFunctions } from "@/ContractFunctions/functions";

export interface BetHistory {
  sessionId: number;
  player: string;
  game: number; // 0: Plinko, 1: Dice, 2: Mines
  betAmount: number;
  isWin: boolean;
  payout: number;
  isplayed: boolean;
  isresolved: boolean;
  timestamp: number;
  betnum: number;
  rollu: boolean;
  safeTilesFound: number;
}

export const useBetHistory = (gameType?: number) => {
    const { getUserSessionList, getAllSessions, address } = useStakeGameFunctions();
    const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
    const [allBetHistory, setAllBetHistory] = useState<BetHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [lastSessionCount, setLastSessionCount] = useState<number>(0);


  const fetchHistory = async () => {
    if (!address) return;
    // setLoading(true);
    // setError("");
    try {
      const userSessionIds: number[] = await getUserSessionList();
      if (!userSessionIds || userSessionIds.length === 0) {
        console.log("No sessions found for the user");
        setBetHistory([]);
        return;
      }

      const allSessions: BetHistory[] = await getAllSessions();
      if (!allSessions || allSessions.length === 0) {
        console.log("No sessions found in the contract");
        setBetHistory([]);
        return;
      }

            const sortedSessions = allSessions.sort((a, b) => b.timestamp - a.timestamp);

            const filtered = sortedSessions
                .filter((session: BetHistory) => {
                    const matchesUser = session.player.toLowerCase() === address.toLowerCase();
                    const matchesGame = gameType !== undefined ? session.game === gameType : true;
                    return matchesUser && matchesGame;
                })
                .slice(0, 10);
            setBetHistory(filtered);

            const allFiltered = sortedSessions
                .filter((session: BetHistory) => {
                    return gameType !== undefined ? session.game === gameType : true;
                })
                .slice(0, 10);
            setAllBetHistory(allFiltered);

        } catch (err: any) {
            console.error("Error fetching bet history:", err);
            setError(err?.message || "Unexpected error");
        } finally {
            setLoading(false);
        }
    };

  fetchHistory();

    return { betHistory, allBetHistory, loading, error };
};
