import React, { useState, useEffect } from "react";
import Link from "next/link";
import GameNav from "./GameNav";
import BetHistory, { BetRecord } from "./BetHistory";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const History = () => {
  const [balance, setBalance] = useState(1.0);
  const [betHistory, setBetHistory] = useState<BetRecord[]>([]);
  const [filter, setFilter] = useState<"all" | "wins" | "losses">("all");
  const [filteredHistory, setFilteredHistory] = useState<BetRecord[]>([]);

  useEffect(() => {
    const storedBalance = localStorage.getItem("limboBalance");
    const storedHistory = localStorage.getItem("limboBetHistory");
    if (storedBalance) setBalance(parseFloat(storedBalance));
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory).map((r: any) => ({
          ...r,
          timestamp: new Date(r.timestamp)
        }));
        setBetHistory(parsed);
        setFilteredHistory(parsed);
      } catch (e) {
        console.error("Error parsing history", e);
      }
    }
  }, []);

  useEffect(() => {
    if (filter === "all") setFilteredHistory(betHistory);
    else if (filter === "wins") setFilteredHistory(betHistory.filter(r => r.win));
    else if (filter === "losses") setFilteredHistory(betHistory.filter(r => !r.win));
  }, [filter, betHistory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <GameNav balance={balance} />
        <div className="mb-6 flex items-center">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-8 w-8 mr-4">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Betting History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review your past bets and performance.
            </p>
          </div>
        </div>
        <div className="flex mb-4 space-x-2">
          {(["all", "wins", "losses"] as const).map(mode => (
            <Button
              key={mode}
              variant={filter === mode ? "default" : "outline"}
              onClick={() => setFilter(mode)}
            >
              {mode.toUpperCase()}
            </Button>
          ))}
        </div>
        <BetHistory records={filteredHistory} />
      </div>
    </div>
  );
};

export default History;
