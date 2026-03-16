"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface ClientProfile {
  id: string;
  name: string;
  industry: string;
  website: string;
  status: "Active" | "Onboarding" | "Paused";
  color: string;
  initials: string;
}

interface ClientContextType {
  clients: ClientProfile[];
  activeClient: ClientProfile;
  setActiveClientId: (id: string) => void;
  addClient: (client: ClientProfile) => void;
}

const defaultClients: ClientProfile[] = [
  {
    id: "marketwake",
    name: "MarketWake",
    industry: "Digital Marketing Agency",
    website: "marketwake.com",
    status: "Active",
    color: "from-blue-500 to-purple-600",
    initials: "MW",
  },
  {
    id: "peachtree-dental",
    name: "Peachtree Dental",
    industry: "Healthcare / Dental",
    website: "peachtreedental.com",
    status: "Active",
    color: "from-emerald-500 to-teal-600",
    initials: "PD",
  },
  {
    id: "southstack-saas",
    name: "SouthStack SaaS",
    industry: "B2B SaaS",
    website: "southstack.io",
    status: "Onboarding",
    color: "from-amber-500 to-orange-600",
    initials: "SS",
  },
];

const ClientContext = createContext<ClientContextType>({
  clients: defaultClients,
  activeClient: defaultClients[0],
  setActiveClientId: () => {},
  addClient: () => {},
});

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<ClientProfile[]>(defaultClients);
  const [activeClientId, setActiveClientId] = useState("marketwake");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedClients = localStorage.getItem("mw-clients");
    if (storedClients) {
      try {
        setClients(JSON.parse(storedClients));
      } catch { /* ignore */ }
    }
    const storedActive = localStorage.getItem("mw-active-client");
    if (storedActive) {
      setActiveClientId(storedActive);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mw-clients", JSON.stringify(clients));
    }
  }, [clients, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("mw-active-client", activeClientId);
    }
  }, [activeClientId, mounted]);

  const activeClient = clients.find((c) => c.id === activeClientId) || clients[0];

  const addClient = (client: ClientProfile) => {
    setClients((prev) => [...prev, client]);
  };

  if (!mounted) return null;

  return (
    <ClientContext.Provider value={{ clients, activeClient, setActiveClientId, addClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}
