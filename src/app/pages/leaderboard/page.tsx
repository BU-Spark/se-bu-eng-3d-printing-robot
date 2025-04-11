"use client";

import { Decimal } from '@prisma/client/runtime/library';
import React, { useEffect, useState } from 'react';

// Define an interface for your data structure
interface LeaderboardEntry {
  Request_ID: number;
  Toughness: Decimal;
  RecordedMass: Decimal;
  leaderboard_result: Decimal;
}


export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace with your actual API endpoint that returns leaderboard data
        const response = await fetch('../api/leaderboard');
        
        if (!response.ok) {
          throw Error('Failed to fetch data');
        }
        
        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (err) {

        console.error('Error fetching leaderboard:', err);

        if (err instanceof Error){
          setError(err.message);
        } else if (typeof err == 'string'){
          setError(err);
        } else {
          setError("An unexpected error has occurred.")
        }
 
        
      }
      
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading leaderboard data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Leaderboard</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>ID</th>
            <th>Toughness</th>
            <th>Mass</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={entry.Request_ID}>
              <td>{index + 1}</td>
              <td>{entry.Request_ID}</td>
              <td>{Number(entry.Toughness)}</td>
              <td>{Number(entry.RecordedMass)}</td>
              <td>{Number(entry.leaderboard_result || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}