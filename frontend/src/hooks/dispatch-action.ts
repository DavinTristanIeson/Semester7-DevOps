import React, { useImperativeHandle } from "react";

export interface ToggleDispatcher {
  toggle(state?: boolean): void;
}

export function useSetupToggleDispatcher(ref: React.ForwardedRef<ToggleDispatcher | undefined>){
  const [opened, setOpened] = React.useState(false);
  useImperativeHandle(ref, () => {
    return {
      toggle(state?: boolean){
        if (state != null){
          setOpened(state);
        } else {
          setOpened(prev => !prev);
        }
      }
    } as ToggleDispatcher
  });
  return [opened, setOpened] as const
}
