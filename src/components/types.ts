interface PlayerInterface {
  name: string;
  guestId?: string;
  color?: string;
}

interface CardInterface {
  name: string;
  number: number;
}

interface GameInterface {
  id: number;
  players: PlayerInterface[];
  status: "matching" | "playing" | "finished" | "disconnected";
  winner?: PlayerInterface;
  cards: CardInterface[];
}

export type { PlayerInterface, CardInterface, GameInterface };
