import React, { useState } from "react";
import {
  Zap,
  Volume2,
  VolumeX,
  Bot,
  BarChart2,
  ArrowRight,
  ShieldCheck
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
    { id: "home", label: "SOLUTION", target: "home" },
    { id: "architecture", label: "TECHNOLOGY", target: "architecture" },
    { id: "benchmark", label: "PROOF", target: "benchmark" },
    { id: "console", label: "WAR ROOM", target: "console" },
    { id: "simulator", label: "SIMULATOR", target: "simulator" }
  ] as const;

  return (
    <div className="sticky top-0 z-50 flex flex-col w-full bg-[#040308] select-none font-sans">
      {/* Top Kog-Style Announcement Bar (32px) */}
      <div className="w-full bg-[#040308] border-b border-white/10 px-4 py-1.5 flex items-center justify-center text-center text-[11px] font-mono tracking-wide text-[#b5b5b5] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8d62eb]/15 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="flex items-center gap-2 cursor-pointer" onClick={() => onSwitchView("home")}>
          <span className="text-[#a982ff] font-bold">&gt;</span>
          <span>WeMakeDevs x FalkorDB Hackathon 2026</span>
          <span className="hidden sm:inline text-white/30">&bull;</span>
          <span className="hidden sm:inline text-white font-medium">Track 01: Agents That Act on Connected Data</span>
          <span className="text-[#a982ff] group-hover:translate-x-1 transition-transform ml-1">&rarr;</span>
        </span>
      </div>

      {/* Main Kog-Style Navbar */}
      <header className="w-full border-b border-white/10 bg-[#040308]/95 backdrop-blur-md px-6 sm:px-10 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo (Left) */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => {
            sound.playClick();
            onSwitchView("home");
          }}
          title="ChokePoint Home"
        >
          {/* Geometric Kog Star / Hexagon Icon */}
          <div className="w-7 h-7 rounded-md bg-[#8d62eb] flex items-center justify-center text-white shadow-[0_0_20px_rgba(141,98,235,0.6)] group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>

          <div className="flex items-baseline gap-2.5">
            <span className="text-[18px] font-bold tracking-tight text-white font-sans">
              ChokePoint
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#a982ff] hidden sm:inline">
              FalkorDB
            </span>
          </div>
        </div>

        {/* Center Kog-Style Text Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            if (link.target === "benchmark") {
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    sound.playClick();
                    onOpenBenchmark();
                  }}
                  className="text-[12px] font-medium tracking-[0.06em] text-[#b5b5b5] hover:text-white transition-colors duration-150 py-1"
                >
                  {link.label}
                </button>
              );
            }
            const isActive = activeView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  sound.playClick();
                  onSwitchView(link.id as any);
                }}
                className={`text-[12px] font-medium tracking-[0.06em] transition-colors duration-150 py-1 relative ${
                  isActive ? "text-white font-semibold" : "text-[#b5b5b5] hover:text-white"
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#8d62eb] shadow-[0_0_8px_#8d62eb]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3.5">
          {/* Ask AI Copilot Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAIChat();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-[#b5b5b5] hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 transition"
          >
            <Bot className="w-3.5 h-3.5 text-[#a982ff]" />
            <span>AI Copilot</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundOn ? "Mute audio" : "Unmute audio"}
            className="p-1.5 rounded-md text-[#737373] hover:text-white transition"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-[#a982ff]" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* FalkorDB Online Dot */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#b5b5b5]">
            <span
              className={`w-2 h-2 rounded-full ${
                falkorConnected
                  ? "bg-[#34d399] shadow-[0_0_8px_#34d399] animate-pulse"
                  : "bg-rose-500"
              }`}
            />
            <span className="hidden lg:inline text-[10px] text-white/50">GraphBLAS</span>
          </div>

          {/* Kog-Style High-Contrast Primary CTA Button */}
          <button
            onClick={() => {
              sound.playClick();
              onSwitchView("console");
            }}
            className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-wide px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Run Agent</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>
    </div>
  );
};
