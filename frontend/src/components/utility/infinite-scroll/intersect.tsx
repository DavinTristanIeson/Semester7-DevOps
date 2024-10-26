import Colors from "@/common/constants/colors";
import { Loader } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import React from "react";

interface UseLoadOnIntersectProps {
  loadNextPage(): void;
  hasNextPage: boolean;
  loading: boolean;
}

export function useLoadOnIntersect(props: UseLoadOnIntersectProps) {
  // Need refs for IntersectionObserver closure to access object
  const contextRef = React.useRef(props);
  contextRef.current = props;

  const ref = React.useRef<HTMLDivElement | null>(null);
  const observer = React.useRef<IntersectionObserver>();
  const load = React.useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries?.[0];
    if (
      !entry ||
      !contextRef.current ||
      !entry.isIntersecting ||
      contextRef.current.loading ||
      !contextRef.current.hasNextPage
    )
      return;
    try {
      contextRef.current.loadNextPage();
    } catch (e: any) {
      console.error(e);
      if (e.message) {
        showNotification({
          message: e.message,
          color: Colors.sentimentError,
        });
      }
    }
  }, []);

  React.useEffect(() => {
    observer.current = new IntersectionObserver(load, {
      threshold: 0.1,
      rootMargin: "48px",
    });
    if (ref.current) {
      observer.current.observe(ref.current);
    }
    return () => observer.current?.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Trigger the scroll again
    if (!props || !ref.current || !observer.current || props.loading) return;
    observer.current.unobserve(ref.current);
    observer.current.observe(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.loading]);

  return {
    ref,
    loading: props.loading,
  };
}

export function LoadOnIntersect(props: UseLoadOnIntersectProps) {
  // Setup infinite scroll
  const infiniteScroll = useLoadOnIntersect(props);

  if (!infiniteScroll) return null;

  return (
    <>
      <div style={{ height: 1, width: "100%" }} ref={infiniteScroll.ref} />
      {infiniteScroll.loading ? (
        <Loader my={8} size={24} />
      ) : (
        <div style={{ height: 40 }} />
      )}
    </>
  );
}
