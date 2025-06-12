import * as React from 'react';
import { Player } from '../hooks/useRealtimePlayers';

const WIDTH = 800;
const HEIGHT = 600;
const CELL = 4; // визуальный размер квадратика

interface Props {
  players: Record<string, Player>;
}

export default function GameField({ players }: Props) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        position: 'relative',
        background: '#111',
        margin: '0 auto',
        border: '2px solid #444'
      }}
    >
      {Object.values(players).map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x,
            top: p.y,
            width: CELL,
            height: CELL,
            background: p.color
          }}
          title={p.name}
        />
      ))}
    </div>
  );
} 