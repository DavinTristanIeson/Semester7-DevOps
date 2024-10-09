import useGetParentRef, { ParentRefType } from "@/hooks/parent-ref";
import React from "react";
import LayoutStyles from "./layout.module.css";
import { useCombinedRefs } from "@/hooks/ref";
import { Flex, ScrollArea } from "@mantine/core";

interface AppLayoutProps {
  Header?: React.ReactNode;
  children?: React.ReactNode;
}

export default function AppLayout(props: AppLayoutProps) {
  const { Header, children } = props;
  const loadingRef = useGetParentRef(ParentRefType.Loading);
  const scrollRef = useGetParentRef(ParentRefType.Scroll);
  const combineRef = useCombinedRefs(loadingRef, scrollRef);
  return (
    <Flex h="100%" direction="column">
      <header className={LayoutStyles["app__header--maxh"]}>{Header}</header>
      <main ref={combineRef} className="flex-1">
        {children}
        <ScrollArea scrollbars="y"></ScrollArea>
      </main>
    </Flex>
  );
}
