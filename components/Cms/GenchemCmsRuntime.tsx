import { useEffect } from "react";
import { registerGenchemTabs } from "@/lib/genchemTabs";

/** Registers global CMS helpers (e.g. gcSwitchTab for GrapesJS product tabs). */
export default function GenchemCmsRuntime() {
  useEffect(() => registerGenchemTabs(), []);
  return null;
}
