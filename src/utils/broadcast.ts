export const channel = new BroadcastChannel('players');

type Message = Record<string, any>;

export function broadcast(msg: Message) {
  // cross-tab
  channel.postMessage(msg);
  // внутри текущей вкладки
  window.dispatchEvent(new CustomEvent('players-local', { detail: msg }));
} 