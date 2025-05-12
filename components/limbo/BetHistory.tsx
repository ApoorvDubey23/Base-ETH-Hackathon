import React from 'react';
import { Check, X } from 'lucide-react';

export type BetRecord = {
  id: number;
  amount: number;
  targetMultiplier: number;
  resultMultiplier: number;
  win: boolean;
  timestamp: Date;
};

type BetHistoryProps = {
  records: BetRecord[];
};

const BetHistory: React.FC<BetHistoryProps> = ({ records }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mt-6 shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Bet History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-500 dark:text-gray-400 text-sm border-b border-gray-300 dark:border-gray-600">
              <th className="pb-2 text-left">Time</th>
              <th className="pb-2 text-left">Bet</th>
              <th className="pb-2 text-left">Target</th>
              <th className="pb-2 text-left">Result</th>
              <th className="pb-2 text-left">Payout</th>
              <th className="pb-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-200 dark:border-gray-600 last:border-0"
                >
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {record.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {record.amount.toFixed(4)} ETH
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {record.targetMultiplier.toFixed(2)}x
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {record.resultMultiplier.toFixed(2)}x
                  </td>
                  <td className="py-3 text-sm text-gray-700 dark:text-gray-300">
                    {record.win
                      ? `${(record.amount * record.targetMultiplier).toFixed(4)} ETH`
                      : '-'}
                  </td>
                  <td className="py-3 text-sm">
                    {record.win ? (
                      <span className="inline-flex items-center text-green-500">
                        <Check size={16} className="mr-1" />
                        Win
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-500">
                        <X size={16} className="mr-1" />
                        Loss
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500 dark:text-gray-400">
                  No bets yet. Start playing!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BetHistory;
