interface PlayerInterface {
  id: string;
  game_id: string;
}

interface CardInterface {
  id: string;
  image_url: string | undefined;
  // indicates position in array(grid)
  position: number;
  name: string;
}

interface GamePlayerInterface {
  id: string;
  score: number;
}

interface GameInterface {
  id: string;
  players: GamePlayerInterface[];
  state:
    | "matching"
    | "playing"
    | "finished"
    | "disconnected"
    | "abandoned"
    | "conceded";
  winner?: string | null;
  playerTurnId: string;
}

interface GameTurnResultInterface {
  cards_match_whole_set: boolean; // cards_match_whole_set
  no_match: boolean; // no_match
  first_flip: boolean; // first_flip
  flipped_cards_name: string[]; // flipped_card_names
  flipped_game_cards: CardInterface[]; // flipped_game_cards
  new_cards_to_add?: CardInterface[]; // cards_to_update
}

interface PlayerScoredCardsInterface {
  player_id: string;
  cards: CardInterface[];
}

// data to support GameChannel broadcast
interface GameChannelBroadcastInterface {
  game?: GameInterface;
  // inital cards to set up the board
  init_cards?: CardInterface[];
  // after each turn, shouldn't return init_cards and turn_result together
  turn_result?: GameTurnResultInterface;
  images_array?: string[]; // images_array
  scored_cards: PlayerScoredCardsInterface[];
}

export type {
  CardInterface,
  GameChannelBroadcastInterface,
  GameInterface,
  GameTurnResultInterface,
  PlayerInterface,
  PlayerScoredCardsInterface,
};
