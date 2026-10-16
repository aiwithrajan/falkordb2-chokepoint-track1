import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  BarChart2,
  Volume2,
  VolumeX,
  Bot,
  Flame,
  LayoutDashboard,
  Layers,
  Sparkles
} from "lucide-react";
import { sound } from "../utils/sound";

interface HeaderProps {
  falkorConnected: boolean;
  activeView: "home" | "console" | "simulator" | "architecture";
  onSwitchView: (view: "home" | "console" | "simulator" | "architecture") => void;
  onOpenBenchmark: () => void;
  onOpenAIChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  falkorConnected,
  activeView,
  onSwitchView,
  onOpenBenchmark,
  onOpenAIChat
}) => {
  const [soundOn, setSoundOn] = useState(sound.isEnabled());

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundOn(newState);
  };

  const navLinks = [
    { id: "home", label: "STORY & IMPACT" },
    { id: "console", label: "LIVE WAR ROOM" },
    { id: "simulator", label: "EXPLOIT SIMULATOR" },
    { id: "architecture", label: "ARCHITECTURE & MATH" }
  ] as const;

  return (
    <header className="border-b border-[#1f1f1f] bg-black sticky top-0 z-50 px-6 sm:px-8 py-3.5 flex items-center justify-between gap-6 transition-colors">
      {/* Brand Identity (Left) */}
      <div
        className="flex items-center gap-3.5 cursor-pointer group select-none"
        onClick={() => {
          sound.playClick();
          onSwitchView("home");
        }}
        title="ChokePoint Home"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.35)] ring-1 ring-white/20 group-hover:scale-105 transition-transform">
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <span className="text-[17px] font-extrabold tracking-[0.14em] text-white uppercase font-sans">
              CHOKEPOINT
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              TRACK 01
            </span>
          </div>
          <span className="text-[9px] tracking-[0.24em] text-neutral-400 uppercase font-mono font-medium hidden sm:block">
            AUTONOMOUS SUPPLY-CHAIN MIN-CUT AGENT
          </span>
        </div>
      </div>

      {/* Center Navigation Links (Track 3 Style - Clean Page Transfer Links, No Slider Box) */}
      <nav className="hidden md:flex items-center gap-7 lg:gap-9">
        {navLinks.map((link) => {
          const isActive = activeView === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                sound.playClick();
                onSwitchView(link.id);
              }}
              className={`text-[11.5px] uppercase tracking-[0.18em] font-semibold transition-all duration-200 relative py-2 ${
                isActive
                  ? "text-white font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>{link.label}</span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-400 to-amber-300 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.9)]" />
              )}
            </button>
          );
        })}

        {/* Rule 3 Ablation Link */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenBenchmark();
          }}
          className="text-[11.5px] uppercase tracking-[0.18em] font-semibold text-neutral-400 hover:text-white transition-all duration-200 py-2 flex items-center gap-1.5"
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>RULE 3 ABLATION</span>
        </button>
      </nav>

      {/* Right Header Controls & Status */}
      <div className="flex items-center gap-3">
        {/* Ask AI Copilot Button (Track 3 Pill Style) */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAIChat();
          }}
          className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase px-4 py-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500/70 text-indigo-200 transition-all shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-300" />
          <span>ASK AI AGENT</span>
        </button>

        {/* Audio Sound FX Toggle */}
        <button
          onClick={toggleSound}
          title={soundOn ? "Mute futuristic audio effects" : "Unmute futuristic audio effects"}
          className={`p-2 rounded-lg border transition ${
            soundOn
              ? "bg-neutral-900 border-neutral-800 text-indigo-400 hover:text-indigo-300 hover:border-neutral-700"
              : "bg-black border-neutral-800 text-neutral-500 hover:text-neutral-400"
          }`}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* FalkorDB Engine Status Badge */}
        <div
          className={`hidden sm:flex items-center gap-2 text-[10px] font-mono tracking-wider px-3 py-1.5 rounded-full border ${
            falkorConnected
              ? "bg-neutral-950 text-neutral-300 border-neutral-800"
              : "bg-rose-950/40 text-rose-300 border-rose-900/60"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              falkorConnected
                ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                : "bg-rose-400"
            }`}
          />
          <span className="uppercase font-bold tracking-[0.12em]">
            {falkorConnected ? "FalkorDB Online" : "Offline"}
          </span>
        </div>
      </div>
    </header>
  );
};
