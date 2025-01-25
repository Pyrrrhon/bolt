"use client";
import { RecoilRoot } from "recoil";

export function Provider({ children }: { children: React.ReactNode }) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
