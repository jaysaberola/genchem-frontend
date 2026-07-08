"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { registerLoading } from "./index";

const LoadingOverlay = dynamic(() => import("@/components/UI/LoadingOverlay"), { ssr: false });

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("Loading...");

  const start = (message?: string) => {
    if (message) setText(message);
    setLoading(true);
  };

  const finish = () => {
    setLoading(false);
    setText("Loading...");
  };

  // 👇 MUST run immediately after mount
  useEffect(() => {
    registerLoading({ start, finish });
  }, []);

  return (
    <>
      {children}
      <LoadingOverlay loading={loading} text={text} />
    </>
  );
}
