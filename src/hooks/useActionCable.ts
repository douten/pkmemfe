import { useEffect, useMemo } from "react";
import { createConsumer } from "@rails/actioncable";

const useActionCable = (url: string) => {
  const actionCable = useMemo(() => createConsumer(url), [url]);

  useEffect(() => {
    return () => {
      actionCable.disconnect();
    };
  }, [actionCable]);

  return { actionCable };
};

export default useActionCable;
