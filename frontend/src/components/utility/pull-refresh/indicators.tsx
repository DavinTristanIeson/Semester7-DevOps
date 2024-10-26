import { Flex, Loader, RingProgress, RingProgressProps } from "@mantine/core";
import Colors from "@/common/constants/colors";
import React, { useImperativeHandle } from "react";

interface DefaultPullRefreshLoadingIndicatorProps {
  loaderSize?: number;
}

export function DefaultPullRefreshLoadingIndicator(
  props: DefaultPullRefreshLoadingIndicatorProps
) {
  return (
    <Flex justify="center" direction="row" align="center">
      <Loader size={props?.loaderSize ?? 24} />
    </Flex>
  );
}

export interface PullRefreshProgressIndicatorRemote {
  /** This is used so that the indicator controls the percentage state (thus reducing rerenders in parent). */
  setPercentage(percentage: number): void;
}
export interface IPullRefreshActingIndicatorProps {
  remote: React.MutableRefObject<PullRefreshProgressIndicatorRemote | null>;
}
interface DefaultPullRefreshProgressIndicatorProps
  extends IPullRefreshActingIndicatorProps {
  size?: number;
  progressProps?: RingProgressProps;
}

export function DefaultPullRefreshProgressIndicator(
  props: DefaultPullRefreshProgressIndicatorProps
) {
  const [percentage, setPercentage] = React.useState(0);
  useImperativeHandle(
    props.remote,
    () =>
      ({
        setPercentage(pct) {
          setPercentage(Math.max(0, Math.min(1, pct)));
        },
      } satisfies PullRefreshProgressIndicatorRemote)
  );
  const size = props.size ?? 30;
  const innerSize = Math.max(Math.min(size, size * percentage), 4);
  return (
    <Flex direction="row" justify="center" align="center">
      <RingProgress
        thickness={3}
        {...props.progressProps}
        size={innerSize}
        sections={[
          {
            value: Math.max(0, Math.min(100, percentage * 100)),
            color: Colors.text,
          },
        ]}
      />
    </Flex>
  );
}
