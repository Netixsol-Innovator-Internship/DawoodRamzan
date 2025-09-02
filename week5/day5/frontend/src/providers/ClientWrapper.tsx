import { ReactNode } from "react";
import { ReduxProvider } from "./redux-provider";

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return <ReduxProvider>{children}</ReduxProvider>;
}
