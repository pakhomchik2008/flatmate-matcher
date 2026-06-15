import type { Metadata } from "next";
import DemoFlow from "./DemoFlow";

export const metadata: Metadata = {
  title: "Try the demo",
  description: "Take the compatibility quiz and see your matches — no sign-up required.",
};

export default function DemoPage() {
  return <DemoFlow />;
}
