import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { broadcast } from '../utils/broadcast';

const FIELD_W = 800;
const FIELD_H = 600;
const STEP = 1; // px за нажатие

export default function usePlayerMovement() {
  // Сохраняем id и текущую позицию в замыкании
  const id = useRef(uuid()).current;
  const pos = useRef({
    x: Math.floor(FIELD_W / 2),
    y: Math.floor(FIELD_H / 2)
  });

  const color = `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;

  // 1. Сообщаем о подключении
  useEffect(() => {
    broadcast({ type: 'join', id, ...pos.current, color, name: id.slice(0, 4) });
    // По закрытию вкладки сообщаем о выходе
    const handleUnload = () => broadcast({ type: 'leave', id });
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // 2. Обработка клавиш
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const dirMap: Record<string, [number, number]> = {
        KeyW: [0, -STEP],
        KeyA: [-STEP, 0],
        KeyS: [0, STEP],
        KeyD: [STEP, 0],
        ArrowUp: [0, -STEP],
        ArrowLeft: [-STEP, 0],
        ArrowDown: [0, STEP],
        ArrowRight: [STEP, 0]
      };

      const dirKeyMap: Record<string, [number, number]> = {
        w: [0, -STEP],
        a: [-STEP, 0],
        s: [0, STEP],
        d: [STEP, 0]
      };

      const dir = dirMap[e.code] || dirKeyMap[e.key.toLowerCase()];
      if (!dir) return;

      // Вычисляем новые координаты
      const nx = Math.min(Math.max(pos.current.x + dir[0], 0), FIELD_W - 1);
      const ny = Math.min(Math.max(pos.current.y + dir[1], 0), FIELD_H - 1);

      pos.current = { x: nx, y: ny };

      // Шлём сообщение другим вкладкам
      broadcast({ type: 'move', id, x: nx, y: ny });

      e.preventDefault();
    },
    [id]
  );

  // Вешаем/снимаем обработчик
  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);
} 