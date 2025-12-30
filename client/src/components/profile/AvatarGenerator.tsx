import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { generateAvatarUrl, getInitials, getColorFromString } from "@/lib/avatar";
import { Sparkles } from "lucide-react";

interface AvatarGeneratorProps {
  name: string;
  username: string;
  onAvatarChange: (avatar: string) => void;
}

export function AvatarGenerator({ name, username, onAvatarChange }: AvatarGeneratorProps) {
  const { t } = useTranslation();
  const [text, setText] = useState(getInitials(name || username || "U"));
  const [bgColor, setBgColor] = useState(getColorFromString(username || name || "user"));
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    if (name || username) {
      setText(getInitials(name || username));
      setBgColor(getColorFromString(username || name));
    }
  }, [name, username]);

  const generateSVG = (): string => {
    const svg = `
      <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${adjustBrightness(bgColor, -20)};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="200" height="200" rx="32" fill="url(#grad)" />
        <text x="100" y="100" font-family="Arial, sans-serif" font-size="72" font-weight="bold" 
              fill="${textColor}" text-anchor="middle" dominant-baseline="central">${text}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;base64,${btoa(svg)}`;
  };

  const adjustBrightness = (hsl: string, amount: number): string => {
    const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return hsl;
    const [, h, s, l] = match;
    const newL = Math.max(0, Math.min(100, parseInt(l) + amount));
    return `hsl(${h}, ${s}%, ${newL}%)`;
  };

  const handleGenerate = () => {
    const avatarUrl = generateSVG();
    onAvatarChange(avatarUrl);
  };

  const handleRandomize = () => {
    const colors = [
      "hsl(200, 65%, 55%)",
      "hsl(220, 65%, 55%)",
      "hsl(240, 65%, 55%)",
      "hsl(280, 65%, 55%)",
      "hsl(320, 65%, 55%)",
      "hsl(0, 65%, 55%)",
      "hsl(30, 65%, 55%)",
      "hsl(60, 65%, 55%)",
    ];
    setBgColor(colors[Math.floor(Math.random() * colors.length)]);
    handleGenerate();
  };

  const previewUrl = generateSVG();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-border">
          <img src={previewUrl} alt="Avatar preview" className="w-full h-full" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="avatar-text">{t("teams.logoText")}</Label>
          <Input
            id="avatar-text"
            value={text}
            onChange={(e) => setText(e.target.value.toUpperCase().slice(0, 2))}
            placeholder="AB"
            maxLength={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar-bg-color">{t("teams.backgroundColor")}</Label>
          <div className="flex gap-2">
            <Input
              id="avatar-bg-color"
              type="color"
              value={bgColorToHex(bgColor)}
              onChange={(e) => setBgColor(hexToHsl(e.target.value))}
              className="w-20 h-10"
            />
            <Input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              placeholder="hsl(200, 65%, 55%)"
              className="flex-1"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleGenerate} className="flex-1">
            {t("teams.saveLogo")}
          </Button>
          <Button type="button" variant="outline" onClick={handleRandomize} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {t("teams.randomize")}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for color conversion
function bgColorToHex(hsl: string): string {
  if (hsl.startsWith("#")) return hsl;
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return "#3b82f6";
  const [, h, s, l] = match;
  return hslToHex(parseInt(h), parseInt(s), parseInt(l));
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

