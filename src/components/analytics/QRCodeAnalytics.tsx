import React from 'react';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ScanData {
  date: string;
  scans: number;
  uniqueVisitors: number;
}

interface QRCodeAnalyticsProps {
  scanData: ScanData[];
}

const QRCodeAnalytics: React.FC<QRCodeAnalyticsProps> = ({ scanData }) => {
  const data = {
    labels: scanData.map(d => format(new Date(d.date), 'MMM d')),
    datasets: [
      {
        label: 'Total Scans',
        data: scanData.map(d => d.scans),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
      },
      {
        label: 'Unique Visitors',
        data: scanData.map(d => d.uniqueVisitors),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'QR Code Performance'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
        Analytics Overview
      </h2>
      <Line data={data} options={options} />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
            Total Scans
          </h3>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {scanData.reduce((acc, curr) => acc + curr.scans, 0)}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
            Unique Visitors
          </h3>
          <p className="text-2xl font-bold text-green-900 dark:text-green-100">
            {scanData.reduce((acc, curr) => acc + curr.uniqueVisitors, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeAnalytics;