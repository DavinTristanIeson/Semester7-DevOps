import { useNetwork } from "@mantine/hooks";
import React from "react";

import {
  DefaultPullRefreshProgressIndicator,
  DefaultPullRefreshLoadingIndicator,
  IPullRefreshActingIndicatorProps,
  PullRefreshProgressIndicatorRemote,
} from "./indicators";
import { isTreeScrollable, DIRECTION } from "./is-scrollable";
import { MaybeFC, MaybeFCType } from "../maybe";
import useGetParentRef, { ParentRefType } from "@/hooks/parent-ref";

export interface PullRefreshProps {
  onRefresh(): void;

  thresholds?: {
    /** How much does the user have to pull the component before it is registered as a pull refresh action. Too sensitive and the loader will appear too often. */
    startSensitivity?: number;
    /** How much can the user drag down the viewport of the pull refresh component. The higher this number is, the more the user has to drag before it triggers a refresh action */
    maxPullDown?: number;
  };

  isLoading?: boolean;
  loadingIndicator?: React.ReactNode;
  progressIndicator?: MaybeFCType<IPullRefreshActingIndicatorProps>;

  children: React.ReactNode;
  isPullable?: boolean;
}

/**
 * Implementation of pull-to-refresh functionality in JavaScript.
 * Modified from https://github.com/echoulen/react-pull-to-refresh/blob/master/src/components/PullToRefresh.tsx.
 */
function PullRefresh(props: PullRefreshProps) {
  const {
    onRefresh,
    thresholds,
    isLoading = false,
    loadingIndicator,
    progressIndicator,
    children,
    isPullable = true,
  } = props;

  const indicatorHeight = 24;

  /** Only fetch when online */
  const { online } = useNetwork();

  /** Records the starting Y position of the drag. Compare this with the current mouse/touch Y position to check if pull-to-refresh functionality should be triggered or not */
  const startY = React.useRef<number | null>(null);
  /** Flag to store the current Y position since touchend/mouseup event doesn't have pageY */
  const endY = React.useRef<number | null>(null);

  /** Reset the viewport back into its default state */
  const resetPullDown = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = "none";
    }
    if (pullDownRef.current) {
      pullDownRef.current.style.visibility = "hidden";
    }
    startY.current = null;
    endY.current = null;
  }, []);

  /** Ref for the pull-refresh viewport. The one that will be translated. */
  const containerRef = React.useRef<HTMLDivElement>(null);
  /** Ref for showing the indicator components */
  const pullDownRef = React.useRef<HTMLDivElement>(null);
  const progressIndicatorRemote =
    React.useRef<PullRefreshProgressIndicatorRemote | null>(null);

  const refScroll = useGetParentRef(ParentRefType.Scroll);

  const { startSensitivity = 24, maxPullDown = 64 } = thresholds ?? {};

  const onTouchStart = React.useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (refScroll.current && refScroll.current.scrollTop !== 0) return;
      // Assign the starting Y position
      const pageY = "touches" in e ? e.touches[0].pageY : e.pageY;
      startY.current = pageY;
      endY.current = pageY;

      // No container
      if (!containerRef.current) return;
      // An element that we're touching can be scrolled up, so gesture is treated as a scroll action and thus ignored
      if (
        "touches" in e &&
        isTreeScrollable(e.currentTarget as Element, DIRECTION.up)
      ) {
      }
    },
    [refScroll]
  );

  const onTouchMove = React.useCallback(
    (e: TouchEvent | MouseEvent) => {
      if (startY.current == null || !containerRef.current) return;
      const currentY = "touches" in e ? e.touches[0].pageY : e.pageY;
      endY.current = currentY;
      // Ignore any scroll up movement
      if (currentY < startY.current) {
        resetPullDown();
        return;
      }

      // Calculate the distance from the starting position; clamped within the range of [..., max pull down distance]. If the distance is under the start sensitivity, then it is set to zero.
      // This is only used for translating the viewport
      const distanceMoved = currentY - startY.current;
      let clampedDistanceMoved = Math.min(maxPullDown, distanceMoved);
      if (clampedDistanceMoved < startSensitivity) {
        clampedDistanceMoved = 0;
      }

      progressIndicatorRemote.current?.setPercentage(
        // Ease out
        Math.sqrt(
          Math.max(0, clampedDistanceMoved - startSensitivity) /
            (maxPullDown - startSensitivity)
        )
      );

      // Apply styling
      containerRef.current.style.transform = `translateY(${clampedDistanceMoved}px)`;
      if (pullDownRef.current) {
        pullDownRef.current.style.visibility = "visible";
      }
    },
    [maxPullDown, startSensitivity, resetPullDown]
  );

  const onTouchEnd = React.useCallback(() => {
    if (startY.current == null || endY.current == null || !containerRef.current)
      return;

    const distanceMoved = endY.current - startY.current;
    const isThresholdBreached = distanceMoved > maxPullDown;

    if (isThresholdBreached && online) {
      onRefresh();
    }
    // Immediately reset to prevent the pulldown indicator being stuck.
    resetPullDown();
  }, [maxPullDown, onRefresh, online, resetPullDown]);

  React.useEffect(() => {
    if (!isPullable) return;
    // Register event listeners
    const container = containerRef.current;
    container?.addEventListener("touchstart", onTouchStart);
    container?.addEventListener("touchmove", onTouchMove, { passive: false });
    container?.addEventListener("touchend", onTouchEnd);
    container?.addEventListener("mousedown", onTouchStart);
    container?.addEventListener("mousemove", onTouchMove);
    container?.addEventListener("mouseup", onTouchEnd);
    container?.addEventListener("touchcancel", resetPullDown);
    container?.addEventListener("mouseleave", resetPullDown);

    return () => {
      container?.removeEventListener("touchstart", onTouchStart);
      container?.removeEventListener("touchmove", onTouchMove);
      container?.removeEventListener("touchend", onTouchEnd);
      container?.removeEventListener("mousedown", onTouchStart);
      container?.removeEventListener("mousemove", onTouchMove);
      container?.removeEventListener("mouseup", onTouchEnd);
      container?.removeEventListener("touchcancel", resetPullDown);
      container?.removeEventListener("mouseleave", resetPullDown);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, resetPullDown, isPullable]);

  React.useEffect(() => {
    if (isLoading && containerRef.current && pullDownRef.current) {
      containerRef.current.style.transform = `translate(0px, ${
        indicatorHeight + 8
      }px)`;
      pullDownRef.current.style.visibility = "visible";
    } else {
      resetPullDown();
    }
  }, [isLoading, indicatorHeight, resetPullDown]);

  const loadingComponent = loadingIndicator ?? (
    <DefaultPullRefreshLoadingIndicator />
  );
  const indicatorComponent = progressIndicator ? (
    <MaybeFC
      props={{
        remote: progressIndicatorRemote,
      }}
    >
      {progressIndicator}
    </MaybeFC>
  ) : (
    <DefaultPullRefreshProgressIndicator remote={progressIndicatorRemote} />
  );

  return (
    <>
      <div
        ref={pullDownRef}
        style={{
          position: "absolute",
          top: 8,
          left: 0,
          right: 0,
          visibility: "hidden",
        }}
      >
        {isLoading ? loadingComponent : indicatorComponent}
      </div>
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: "100%",
          // This messes with 'native' horizontal scrolling.
          // overflow: 'hidden',
          // overflow: 'auto',
          overflow: "inherit",
          WebkitOverflowScrolling: "touch",
          zIndex: 1,
          transition: "transform 0.2s cubic-bezier(0,0,0.31,1)",
        }}
      >
        {children}
      </div>
    </>
  );
}

export default PullRefresh;
