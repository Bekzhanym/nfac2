import { useEffect, useState } from 'react';
import { channel } from '../utils/broadcast';

export interface Player {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

type LocalEvent = CustomEvent<any>;

export default function useRealtimePlayers() {
  const [players, setPlayers] = useState<Record<string, Player>>({});

  useEffect(() => {
    const handle = (e: MessageEvent<any>) => {
      const msg = e.data;
      if (!msg || !msg.type) return;
      if (msg.type === 'join') {
        const { id, x, y, color, name } = msg;
        setPlayers(p => ({ ...p, [id]: { id, x, y, color, name } }));
      } else if (msg.type === 'move') {
        const { id, x, y } = msg;
        setPlayers(p => {
          const existing = p[id];
          if (existing) {
            return { ...p, [id]: { ...existing, x, y } };
          }
          // fallback if no existing (shouldn't happen)
          return { ...p, [id]: { id: msg.id, x: msg.x, y: msg.y, color: '#fff', name: String(msg.id).slice(0,4) } };
        });
      } else if (msg.type === 'leave') {
        setPlayers(p => {
          const copy = { ...p };
          delete copy[msg.id];
          return copy;
        });
      }
    };

    // cross-tab
    channel.addEventListener('message', handle);
    // внутри вкладки
    const localListener = (e: Event) => {
      handle({ data: (e as LocalEvent).detail } as MessageEvent<any>);
    };
    window.addEventListener('players-local', localListener);

    return () => {
      channel.removeEventListener('message', handle);
      window.removeEventListener('players-local', localListener);
    };
  }, []);

  return players;
} 