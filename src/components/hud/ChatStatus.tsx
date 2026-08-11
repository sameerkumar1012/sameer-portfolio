"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Lets the rest of the HUD react to what the RAG pipeline is doing.
 *
 * The terminal is the only publisher; the arc reactor and diagnostics panel
 * are consumers. This is what turns the centrepiece from decoration into a
 * readout of the system actually working.
 */

export type ChatPhase = "idle" | "retrieving" | "generating";

export interface RetrievedSource {
  source: string;
  title: string;
}

interface ChatStatusValue {
  phase: ChatPhase;
  sources: RetrievedSource[];
  /** Total questions answered this session. */
  answered: number;
  setPhase: (phase: ChatPhase) => void;
  reportAnswer: (sources: RetrievedSource[]) => void;
}

const ChatStatusContext = createContext<ChatStatusValue | null>(null);

export function ChatStatusProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [sources, setSources] = useState<RetrievedSource[]>([]);
  const [answered, setAnswered] = useState(0);

  const reportAnswer = useCallback((next: RetrievedSource[]) => {
    setSources(next);
    setAnswered((n) => n + 1);
  }, []);

  const value = useMemo(
    () => ({ phase, sources, answered, setPhase, reportAnswer }),
    [phase, sources, answered, reportAnswer],
  );

  return (
    <ChatStatusContext.Provider value={value}>
      {children}
    </ChatStatusContext.Provider>
  );
}

/**
 * Returns a no-op fallback outside a provider, so the terminal can be dropped
 * onto a page that has no HUD around it without crashing.
 */
export function useChatStatus(): ChatStatusValue {
  const context = useContext(ChatStatusContext);

  return (
    context ?? {
      phase: "idle",
      sources: [],
      answered: 0,
      setPhase: () => {},
      reportAnswer: () => {},
    }
  );
}

export const PHASE_LABEL: Record<ChatPhase, string> = {
  idle: "STANDBY",
  retrieving: "RETRIEVING",
  generating: "GENERATING",
};
