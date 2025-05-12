import React, { useState, useEffect } from 'react';
import GameNav from './GameNav';
import LimboGame from './LimboGame';
import BetHistory, { BetRecord } from './BetHistory';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  const [balance, setBalance] = useState(100);
  const [betHistory, setBetHistory] = useState<BetRecord[]>([]);

  useEffect(() => {
    const savedBalance = localStorage.getItem('limboBalance');
    const savedHistory = localStorage.getItem('limboBetHistory');

    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    }

    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        const processedHistory = parsedHistory.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }));
        setBetHistory(processedHistory);
      } catch (e) {
        console.error("Failed to parse bet history from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('limboBalance', balance.toString());
    localStorage.setItem('limboBetHistory', JSON.stringify(betHistory));
  }, [balance, betHistory]);

  const handleBetComplete = (record: BetRecord) =>
    setBetHistory(prev => [record, ...prev.slice(0, 49)]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="max-w-7xl mx-auto">

        <GameNav balance={balance} />

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Limbo Game</h1>
          <p className="text-muted-foreground">
            Predict a multiplier and win big if the roll is higher!
          </p>
        </div>

        <LimboGame
          balance={balance}
          onBalanceChange={setBalance}
          onBetComplete={handleBetComplete}
        />

        <BetHistory records={betHistory} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
