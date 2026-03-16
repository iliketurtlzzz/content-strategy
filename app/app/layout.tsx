"use client";

import { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./globals.css";
import { ThemeProvider, useTheme } from "./theme-context";
import { ClientProvider, useClient } from "./client-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navItems = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/calendar", label: "Content Calendar", icon: "calendar" },
  { href: "/create", label: "Create Content", icon: "edit" },
  { href: "/ideation", label: "Ideation", icon: "bulb" },
  { href: "/brand", label: "Brand Guidelines", icon: "book" },
  { href: "/personas", label: "Audience Personas", icon: "users" },
  { href: "/seo", label: "SEO / AEO Tools", icon: "search" },
  { href: "/clients", label: "Clients", icon: "briefcase" },
];

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const c = className || "w-5 h-5";
  switch (icon) {
    case "grid":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
      );
    case "calendar":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      );
    case "edit":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      );
    case "book":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case "users":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      );
    case "search":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      );
    case "bulb":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      );
    case "briefcase":
      return (
        <svg className={c} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      );
    default:
      return null;
  }
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
        theme === "dark"
          ? "bg-[#1a2234] text-slate-400 hover:text-yellow-400 hover:bg-[#1e293b]"
          : "bg-slate-100 text-slate-500 hover:text-amber-500 hover:bg-slate-200"
      }`}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )}
    </button>
  );
}

function ClientSwitcher() {
  const { theme } = useTheme();
  const { clients, activeClient, setActiveClientId } = useClient();
  const [open, setOpen] = useState(false);
  const dark = theme === "dark";

  const statusColor: Record<string, string> = {
    Active: "bg-emerald-400",
    Onboarding: "bg-amber-400",
    Paused: "bg-slate-400",
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
          dark
            ? "bg-[#1a2234] hover:bg-[#1e293b] border border-[#2d3748]"
            : "bg-slate-50 hover:bg-slate-100 border border-slate-200"
        }`}
      >
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${activeClient.color} text-xs font-bold text-white shrink-0`}>
          {activeClient.initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-slate-900"}`}>
            {activeClient.name}
          </p>
          <p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {activeClient.industry}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`h-2 w-2 rounded-full ${statusColor[activeClient.status]}`} />
          <svg className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""} ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute left-0 right-0 top-full z-50 mt-1 rounded-lg border shadow-lg overflow-hidden ${
            dark ? "bg-[#111827] border-[#2d3748]" : "bg-white border-slate-200"
          }`}>
            <div className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-widest ${
              dark ? "text-slate-500 border-b border-[#1e293b]" : "text-slate-400 border-b border-slate-100"
            }`}>
              Switch Client
            </div>
            {clients.map((client) => {
              const isActive = client.id === activeClient.id;
              return (
                <button
                  key={client.id}
                  onClick={() => {
                    setActiveClientId(client.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 transition-colors ${
                    isActive
                      ? dark ? "bg-blue-600/10" : "bg-blue-50"
                      : dark ? "hover:bg-[#1a2234]" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br ${client.color} text-[10px] font-bold text-white shrink-0`}>
                    {client.initials}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`text-sm font-medium truncate ${
                      isActive
                        ? "text-blue-500"
                        : dark ? "text-slate-300" : "text-slate-700"
                    }`}>
                      {client.name}
                    </p>
                    <p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>
                      {client.industry}
                    </p>
                  </div>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusColor[client.status]}`} />
                  {isActive && (
                    <svg className="h-4 w-4 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
            <Link
              href="/clients"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors border-t ${
                dark
                  ? "border-[#1e293b] text-blue-400 hover:bg-[#1a2234]"
                  : "border-slate-100 text-blue-600 hover:bg-slate-50"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Manage Clients
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col ${
        dark
          ? "bg-[#0d1117] text-white border-r border-[#1e293b]"
          : "bg-white text-slate-900 border-r border-slate-200"
      }`}>
        {/* Gradient accent line at top */}
        <div className="gradient-accent h-[2px] w-full" />

        {/* Logo + Theme Toggle */}
        <div className={`flex h-14 items-center justify-between border-b px-4 ${
          dark ? "border-[#1e293b]" : "border-slate-200"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-[11px] text-white">
              MW
            </div>
            <div>
              <h1 className={`text-xs font-semibold tracking-wide ${dark ? "text-white" : "text-slate-900"}`}>MarketWake</h1>
              <p className={`text-[9px] uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>Content Strategy</p>
            </div>
          </div>
          <ThemeToggleButton />
        </div>

        {/* Client Switcher */}
        <div className={`px-3 pt-3 pb-2 border-b ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
          <ClientSwitcher />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? dark
                      ? "bg-blue-600/20 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : dark
                      ? "text-slate-400 hover:bg-[#1a2234] hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <NavIcon icon={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className={`border-t p-4 ${dark ? "border-[#1e293b]" : "border-slate-200"}`}>
          <div className={`rounded-lg p-3 ${dark ? "bg-[#1a2234]" : "bg-slate-50"}`}>
            <p className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>Content Health</p>
            <div className="mt-2 flex items-center gap-2">
              <div className={`h-2 flex-1 overflow-hidden rounded-full ${dark ? "bg-[#2d3748]" : "bg-slate-200"}`}>
                <div className="h-full w-[72%] rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">72%</span>
            </div>
            <p className={`mt-1 text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>On track for March targets</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`ml-64 flex-1 min-h-screen ${dark ? "bg-[#0a0f1a]" : "bg-slate-50"}`}>
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <title>MarketWake Content Strategy</title>
        <meta name="description" content="MarketWake Content Strategy Dashboard - Plan, create, and optimize content across all channels." />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ClientProvider>
            <AppShell>{children}</AppShell>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
