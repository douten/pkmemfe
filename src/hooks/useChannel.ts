import { Consumer, Subscription } from "@rails/actioncable";
import { useState, useEffect, useRef, useCallback } from "react";

// Needed for @rails/actioncable
// let global: any;
// global.addEventListener = () => {};
// global.removeEventListener = () => {};

type Data = {
  channel: string;
  id?: string;
};

type Callbacks<T> = {
  received?: (_message: T) => void;
  initialized?: () => void;
  connected?: () => void;
  disconnected?: () => void;
};

export default function useChannel<ReceivedType>(actionCable: Consumer) {
  const channelRef = useRef<Subscription<Consumer> | null>(null);

  const subscribe = (data: Data, callbacks: Callbacks<ReceivedType>) => {
    console.log(`useChannel - INFO: Connecting to ${data.channel}`);
    const channel = actionCable.subscriptions.create(data, {
      received: (message: ReceivedType) => {
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

  const send = (action: string, payload: {} | undefined) => {
    try {
      channelRef?.current?.perform(action, payload);
    } catch (e) {
      throw "useChannel - ERROR: " + e;
    }
  };

  return { subscribe, unsubscribe, send };
}
