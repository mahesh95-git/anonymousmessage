"use client";
import { SessionContext ,SessionProvider} from "next-auth/react";
export default function ClientSessionProvider({ children }) {
  return <SessionProvider >{children}</SessionProvider>;
}
