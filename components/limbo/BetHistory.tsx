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
    <div className="bg-white dark:bg-gray-900 rounded-lg  shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Bet History
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-gray-600 dark:text-gray-400 text-sm border-b border-gray-300 dark:border-gray-700">
              <th className="pb-3 text-left font-medium">Time</th>
              <th className="pb-3 text-left font-medium">Bet</th>
              <th className="pb-3 text-left font-medium">Target</th>
              <th className="pb-3 text-left font-medium">Result</th>
              <th className="pb-3 text-left font-medium">Payout</th>
              <th className="pb-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="py-4 text-sm text-gray-800 dark:text-gray-300">
                    {record.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="py-4 text-sm text-gray-800 dark:text-gray-300">
                    {record.amount.toFixed(4)} ETH
                  </td>
                  <td className="py-4 text-sm text-gray-800 dark:text-gray-300">
                    {record.targetMultiplier.toFixed(2)}x
                  </td>
                  <td className="py-4 text-sm text-gray-800 dark:text-gray-300">
                    {record.resultMultiplier.toFixed(2)}x
                  </td>
                  <td className="py-4 text-sm text-gray-800 dark:text-gray-300">
                    {record.win
                      ? `${(record.amount * record.targetMultiplier).toFixed(4)} ETH`
                      : '-'}
                  </td>
                  <td className="py-4 text-sm">
                    {record.win ? (
                      <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium">
                        <Check size={16} className="mr-1" />
                        Win
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 dark:text-red-400 font-medium">
                        <X size={16} className="mr-1" />
                        Loss
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm"
                >
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
