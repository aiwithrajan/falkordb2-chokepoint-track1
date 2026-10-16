import React, { useState } from "react";
import {
  Zap,
  ShieldCheck,
  Cpu,
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

  const navItems = [
    { id: "home", label: "Story & Impact", icon: Sparkles },
    { id: "console", label: "Live War Room", icon: LayoutDashboard },
    { id: "simulator", label: "Exploit Simulator", icon: Flame },
    { id: "architecture", label: "Architecture & Math", icon: Layers }
  ] as const;

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Project Tag */}
      <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSwitchView("home")}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              ChokePoint
            </h1>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Track 01
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
            FalkorDB GraphBLAS Min-Cut Agent
          </p>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                onSwitchView(item.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : ""}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right Action Tools & Status */}
      <div className="flex items-center gap-2.5">
        {/* Ask AI Copilot Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenAIChat();
          }}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-indigo-500/40 shadow-sm transition"
        >
          <Bot className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Ask AI Agent</span>
        </button>

        {/* Rule 3 Benchmark Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenBenchmark();
          }}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Rule 3 Ablation</span>
        </button>

        {/* Audio Sound FX Toggle */}
        <button
          onClick={toggleSound}
          title={soundOn ? "Mute futuristic audio effects" : "Unmute futuristic audio effects"}
          className={`p-1.5 rounded-lg border transition ${
            soundOn
              ? "bg-slate-800 border-slate-700 text-indigo-400 hover:text-indigo-300"
              : "bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-400"
          }`}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* FalkorDB Engine Status */}
        <div
          className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border ${
            falkorConnected
              ? "bg-emerald-950/60 text-emerald-300 border-emerald-800/60"
              : "bg-rose-950/60 text-rose-300 border-rose-800/60"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              falkorConnected ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" : "bg-rose-400"
            }`}
          />
          <ShieldCheck className="w-3.5 h-3.5 hidden sm:inline" />
          <span>{falkorConnected ? "FalkorDB Online" : "Disconnected"}</span>
        </div>
      </div>
    </header>
  );
};
