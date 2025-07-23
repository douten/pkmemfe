import { Consumer, Subscription } from "@rails/actioncable";
import { useEffect, useRef, useCallback } from "react";

import type { GameInterface } from "../types/types";

type Data = {
  channel: string;
  id?: string;
  game_id?: string;
  opts?: {
    images_array?: boolean;
  };
};

type Callbacks<T> = {
  received?: (_message: T) => void;
  initialized?: () => void;
  connected?: () => void;
  disconnected?: () => void;
  rejected?: () => void;
};

interface ActionCableResponseInterface {
  lobby_channel: {
    active_players_count: number;
    game_id?: string;
    opponent_id?: string;
    is_playing?: boolean;
  };
  games_channel: {
    game?: GameInterface;
    images_array?: string[];
    delay?: number;
    error?: string;
    matched_cards?: string[];
  };
}

export default function useChannel(actionCable: Consumer) {
  const channelRef = useRef<Subscription<Consumer> | null>(null);

  const subscribe = (
    data: Data,
    callbacks: Callbacks<ActionCableResponseInterface>
  ) => {
    console.log(`useChannel - INFO: Connecting to ${data.channel}`);
    const channel = actionCable.subscriptions.create(data, {
      received: (message: ActionCableResponseInterface) => {
        console.log("useChannel - INFO: Received message:", message);
        if (callbacks.received) {
          callbacks.received(message);
        }
      },
      initialized: () => {
        if (callbacks.initialized) {
          callbacks.initialized();
        }
      },
      connected: () => {
        if (callbacks.connected) {
          callbacks.connected();
        }
      },
      disconnected: () => {
        if (callbacks.disconnected) {
          callbacks.disconnected();
        }
      },
      rejected: () => {
        if (callbacks.rejected) {
          callbacks.rejected();
        }
      },
    });
    channelRef.current = channel;
  };

  const unsubscribe = useCallback(() => {
    if (channelRef.current) {
      console.log(
        "useChannel - INFO: Unsubscribing from " + channelRef.current.identifier
      );
      channelRef.current.unsubscribe();
      channelRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      unsubscribe();
    };
  }, [unsubscribe]);

  const send = (action: string, payload?: {} | undefined) => {
    try {
      channelRef?.current?.perform(action, payload);
    } catch (e) {
      throw "useChannel - ERROR: " + e;
    }
  };

  return { subscribe, unsubscribe, send };
}
