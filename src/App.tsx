import * as React from 'react';
import GameField from './components/GameField';
import usePlayerMovement from './hooks/usePlayerMovement';
import useRealtimePlayers from './hooks/useRealtimePlayers';

export default function App() {
  const players = useRealtimePlayers();
  usePlayerMovement();

  return (
    <main style={{ paddingTop: 40, textAlign: 'center', color: '#eee', fontFamily: 'sans-serif' }}>
      <h1>Realtime Pixels</h1>
      <GameField players={players} />
      <p style={{ marginTop: 16 }}>Управление: W / A / S / D (1&nbsp;px шаг)</p>
    </main>
  );
} 