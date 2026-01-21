import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RotateCcw, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (imageDataUrl: string) => void;
  teamName?: string;
}

type Shape = "circle" | "rounded-square" | "shield" | "badge" | "hexagon";
type IconType =
  | "none"
  | "football"
  | "star"
  | "bolt"
  | "shield"
  | "trophy"
  | "target"
  | "flame"
  | "crown";
type BackgroundType = "solid" | "linear" | "radial";
type PatternType = "none" | "stripes" | "dots" | "gradient";

const COLOR_PRESETS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#6366F1",
  "#14B8A6",
  "#000000",
  "#FFFFFF",
  "#6B7280",
  "#F3F4F6",
];

const FONT_FAMILIES = [
  { value: "Arial", label: "Arial" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Impact", label: "Impact" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
];

export function LogoBuilder({
  open,
  onOpenChange,
  onSave,
  teamName = "",
}: LogoBuilderProps) {
  const { t } = useTranslation();
  const { dir, isRTL } = useDirection();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "create">("create");

  // Logo state
  const [text, setText] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [shape, setShape] = useState<Shape>("circle");
  const [bgType, setBgType] = useState<BackgroundType>("solid");
  const [bgColor, setBgColor] = useState("#3B82F6");
  const [bgColor2, setBgColor2] = useState("#1E40AF");
  const [gradientAngle, setGradientAngle] = useState(45);
  const [pattern, setPattern] = useState<PatternType>("none");
  const [transparentBg, setTransparentBg] = useState(false);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("bold");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textOutline, setTextOutline] = useState(false);
  const [textShadow, setTextShadow] = useState(true);
  const [shadowIntensity, setShadowIntensity] = useState(0.3);
  const [icon, setIcon] = useState<IconType>("none");
  const [iconSize, setIconSize] = useState(60);
  const [iconX, setIconX] = useState(0);
  const [iconY, setIconY] = useState(-15);
  const [iconColor, setIconColor] = useState("#FFFFFF");
  const [iconChip, setIconChip] = useState(false);
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderColor, setBorderColor] = useState("#000000");
  const [innerShadow, setInnerShadow] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [grain, setGrain] = useState(false);
  const [exportSize, setExportSize] = useState<"512" | "1024">("512");
  const [hasAutoSuggested, setHasAutoSuggested] = useState(false);

  // Auto-suggest initials from team name (only once when dialog opens)
  useEffect(() => {
    if (open && teamName && !text && activeTab === "create" && !hasAutoSuggested) {
      const initials = teamName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .substring(0, 3);
      setText(initials);
      setHasAutoSuggested(true);
    }
  }, [open, teamName, text, activeTab, hasAutoSuggested]);

  // Reset auto-suggest flag when dialog closes
  useEffect(() => {
    if (!open) {
      setHasAutoSuggested(false);
      setText("");
    }
  }, [open]);

  // Render logo to canvas
  const renderLogo = useCallback(
    (size: number = 200) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Clear canvas first
      ctx.clearRect(0, 0, size, size);

      canvas.width = size;
      canvas.height = size;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Draw background
      if (!transparentBg) {
        if (bgType === "solid") {
          ctx.fillStyle = bgColor;
        } else if (bgType === "linear") {
          const angleRad = (gradientAngle * Math.PI) / 180;
          const x1 = size / 2 - (size / 2) * Math.cos(angleRad);
          const y1 = size / 2 - (size / 2) * Math.sin(angleRad);
          const x2 = size / 2 + (size / 2) * Math.cos(angleRad);
          const y2 = size / 2 + (size / 2) * Math.sin(angleRad);
          const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(1, bgColor2);
          ctx.fillStyle = gradient;
        } else if (bgType === "radial") {
          const gradient = ctx.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
          );
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(1, bgColor2);
          ctx.fillStyle = gradient;
        }
      } else {
        ctx.clearRect(0, 0, size, size);
      }

      // Draw shape
      ctx.save();
      if (shape === "circle") {
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - borderWidth, 0, Math.PI * 2);
        if (!transparentBg) ctx.fill();
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth * 2;
          ctx.stroke();
        }
      } else if (shape === "rounded-square") {
        const radius = 20;
        const offset = borderWidth;
        ctx.beginPath();
        ctx.moveTo(radius + offset, offset);
        ctx.lineTo(size - radius - offset, offset);
        ctx.quadraticCurveTo(
          size - offset,
          offset,
          size - offset,
          radius + offset
        );
        ctx.lineTo(size - offset, size - radius - offset);
        ctx.quadraticCurveTo(
          size - offset,
          size - offset,
          size - radius - offset,
          size - offset
        );
        ctx.lineTo(radius + offset, size - offset);
        ctx.quadraticCurveTo(
          offset,
          size - offset,
          offset,
          size - radius - offset
        );
        ctx.lineTo(offset, radius + offset);
        ctx.quadraticCurveTo(offset, offset, radius + offset, offset);
        ctx.closePath();
        if (!transparentBg) ctx.fill();
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth * 2;
          ctx.stroke();
        }
      } else if (shape === "shield") {
        const offset = borderWidth;
        ctx.beginPath();
        ctx.moveTo(size / 2, offset);
        ctx.lineTo(size - offset, size * 0.3);
        ctx.lineTo(size - offset, size - size * 0.3);
        ctx.lineTo(size / 2, size - offset);
        ctx.lineTo(offset, size - size * 0.3);
        ctx.lineTo(offset, size * 0.3);
        ctx.closePath();
        if (!transparentBg) ctx.fill();
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth * 2;
          ctx.stroke();
        }
      } else if (shape === "badge") {
        const offset = borderWidth;
        ctx.beginPath();
        ctx.arc(size / 2, size * 0.2, size * 0.15, Math.PI, 0, false);
        ctx.lineTo(size - offset, size * 0.2);
        ctx.lineTo(size - offset, size - size * 0.2);
        ctx.lineTo(size / 2, size - offset);
        ctx.lineTo(offset, size - size * 0.2);
        ctx.lineTo(offset, size * 0.2);
        ctx.closePath();
        if (!transparentBg) ctx.fill();
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth * 2;
          ctx.stroke();
        }
      } else if (shape === "hexagon") {
        const offset = borderWidth;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = size / 2 + (size / 2 - offset) * Math.cos(angle);
          const y = size / 2 + (size / 2 - offset) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        if (!transparentBg) ctx.fill();
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth * 2;
          ctx.stroke();
        }
      }
      ctx.restore();

      // Draw pattern overlay
      if (pattern === "stripes" && !transparentBg) {
        ctx.save();
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        for (let i = -size; i < size * 2; i += 10) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + size, size);
          ctx.stroke();
        }
        ctx.restore();
      } else if (pattern === "dots" && !transparentBg) {
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = textColor;
        for (let x = 0; x < size; x += 15) {
          for (let y = 0; y < size; y += 15) {
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // Draw icon
      if (icon !== "none") {
        ctx.save();
        const iconXPos = size / 2 + iconX;
        const iconYPos = size / 2 + iconY;

        // Icon background chip
        if (iconChip) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
          ctx.beginPath();
          ctx.arc(iconXPos, iconYPos, iconSize / 2 + 8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = iconColor;
        ctx.strokeStyle = iconColor;
        ctx.lineWidth = 3;

        // Draw icon shapes
        if (icon === "football") {
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = iconXPos + (iconSize / 2) * Math.cos(angle);
            const y = iconYPos + (iconSize / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (icon === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = iconXPos + (iconSize / 2) * Math.cos(angle);
            const y = iconYPos + (iconSize / 2) * Math.sin(angle);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        } else if (icon === "bolt") {
          ctx.beginPath();
          ctx.moveTo(iconXPos - iconSize / 4, iconYPos - iconSize / 2);
          ctx.lineTo(iconXPos + iconSize / 4, iconYPos);
          ctx.lineTo(iconXPos - iconSize / 6, iconYPos);
          ctx.lineTo(iconXPos + iconSize / 4, iconYPos + iconSize / 2);
          ctx.closePath();
          ctx.fill();
        } else if (icon === "shield") {
          ctx.beginPath();
          ctx.moveTo(iconXPos, iconYPos - iconSize / 2);
          ctx.lineTo(iconXPos - iconSize / 2, iconYPos - iconSize / 4);
          ctx.lineTo(iconXPos - iconSize / 2, iconYPos + iconSize / 4);
          ctx.lineTo(iconXPos, iconYPos + iconSize / 2);
          ctx.lineTo(iconXPos + iconSize / 2, iconYPos + iconSize / 4);
          ctx.lineTo(iconXPos + iconSize / 2, iconYPos - iconSize / 4);
          ctx.closePath();
          ctx.fill();
        } else if (icon === "trophy") {
          // Trophy shape
          ctx.beginPath();
          ctx.moveTo(iconXPos - iconSize / 3, iconYPos - iconSize / 2);
          ctx.lineTo(iconXPos + iconSize / 3, iconYPos - iconSize / 2);
          ctx.lineTo(iconXPos + iconSize / 3, iconYPos);
          ctx.lineTo(iconXPos + iconSize / 4, iconYPos + iconSize / 2);
          ctx.lineTo(iconXPos - iconSize / 4, iconYPos + iconSize / 2);
          ctx.lineTo(iconXPos - iconSize / 3, iconYPos);
          ctx.closePath();
          ctx.fill();
        } else if (icon === "target") {
          ctx.beginPath();
          ctx.arc(iconXPos, iconYPos, iconSize / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(iconXPos, iconYPos, iconSize / 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(iconXPos, iconYPos, iconSize / 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (icon === "flame") {
          ctx.beginPath();
          ctx.moveTo(iconXPos, iconYPos - iconSize / 2);
          ctx.quadraticCurveTo(
            iconXPos - iconSize / 3,
            iconYPos,
            iconXPos,
            iconYPos + iconSize / 2
          );
          ctx.quadraticCurveTo(
            iconXPos + iconSize / 3,
            iconYPos,
            iconXPos,
            iconYPos - iconSize / 2
          );
          ctx.closePath();
          ctx.fill();
        } else if (icon === "crown") {
          ctx.beginPath();
          ctx.moveTo(iconXPos - iconSize / 2, iconYPos);
          ctx.lineTo(iconXPos - iconSize / 4, iconYPos - iconSize / 2);
          ctx.lineTo(iconXPos, iconYPos - iconSize / 3);
          ctx.lineTo(iconXPos + iconSize / 4, iconYPos - iconSize / 2);
          ctx.lineTo(iconXPos + iconSize / 2, iconYPos);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      // Draw text
      if (text) {
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.font = `${fontWeight} ${Math.floor(size * 0.24)}px ${fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = `${letterSpacing}px`;

        // Text shadow
        if (textShadow) {
          ctx.shadowColor = "rgba(0, 0, 0, " + shadowIntensity + ")";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
        }

        // Text outline
        if (textOutline) {
          ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
          ctx.lineWidth = 2;
          const textY = icon !== "none" ? size / 2 + 40 : size / 2;
          ctx.strokeText(text, size / 2, textY);
        }

        const textY = icon !== "none" ? size / 2 + 40 : size / 2;
        ctx.fillText(text, size / 2, textY);

        // Subtitle
        if (subtitle) {
          ctx.font = `normal ${Math.floor(size * 0.12)}px ${fontFamily}`;
          ctx.fillText(subtitle, size / 2, textY + size * 0.15);
        }

        ctx.restore();
      }

      // Inner shadow
      if (innerShadow) {
        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 2,
          size * 0.3,
          size / 2,
          size / 2,
          size / 2
        );
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        ctx.restore();
      }

      // Highlight overlay
      if (highlight) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const gradient = ctx.createRadialGradient(
          size / 2,
          size / 3,
          0,
          size / 2,
          size / 3,
          size / 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        ctx.restore();
      }

      // Grain effect
      if (grain) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        const imageData = ctx.getImageData(0, 0, size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = Math.random() * 255;
          imageData.data[i] = noise;
          imageData.data[i + 1] = noise;
          imageData.data[i + 2] = noise;
        }
        ctx.putImageData(imageData, 0, 0);
        ctx.restore();
      }
    },
    [
      text,
      subtitle,
      shape,
      bgType,
      bgColor,
      bgColor2,
      gradientAngle,
      pattern,
      transparentBg,
      textColor,
      fontFamily,
      fontWeight,
      letterSpacing,
      textOutline,
      textShadow,
      shadowIntensity,
      icon,
      iconSize,
      iconX,
      iconY,
      iconColor,
      iconChip,
      borderWidth,
      borderColor,
      innerShadow,
      highlight,
      grain,
    ]
  );

  // Render preview
  useEffect(() => {
    if (activeTab === "create" && open) {
      // Use requestAnimationFrame to ensure canvas is ready
      requestAnimationFrame(() => {
        renderLogo(200);
      });
    }
  }, [renderLogo, activeTab, open]);

  const handleSave = () => {
    if (activeTab === "upload" && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        onSave(e.target?.result as string);
        onOpenChange(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    if (!canvasRef.current) {
      toast({
        title: t("common.error"),
        description: t("teams.canvasError"),
        variant: "destructive",
      });
      return;
    }

    if (!text && activeTab === "create") {
      toast({
        title: t("teams.validationError"),
        description: t("teams.logoTextRequired"),
        variant: "destructive",
      });
      return;
    }

    // Create a temporary canvas for export at the desired size
    const exportSizeNum = parseInt(exportSize);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = exportSizeNum;
    tempCanvas.height = exportSizeNum;
    const tempCtx = tempCanvas.getContext("2d", { alpha: true });

    if (!tempCtx) {
      toast({
        title: t("common.error"),
        description: t("teams.canvasError"),
        variant: "destructive",
      });
      return;
    }

    // Render to temporary canvas at export size
    // We need to re-render with current state at export size
    const renderExport = () => {
      const size = exportSizeNum;
      tempCtx.clearRect(0, 0, size, size);

      // Draw background
      if (!transparentBg) {
        if (bgType === "solid") {
          tempCtx.fillStyle = bgColor;
        } else if (bgType === "linear") {
          const angleRad = (gradientAngle * Math.PI) / 180;
          const x1 = size / 2 - (size / 2) * Math.cos(angleRad);
          const y1 = size / 2 - (size / 2) * Math.sin(angleRad);
          const x2 = size / 2 + (size / 2) * Math.cos(angleRad);
          const y2 = size / 2 + (size / 2) * Math.sin(angleRad);
          const gradient = tempCtx.createLinearGradient(x1, y1, x2, y2);
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(1, bgColor2);
          tempCtx.fillStyle = gradient;
        } else if (bgType === "radial") {
          const gradient = tempCtx.createRadialGradient(
            size / 2,
            size / 2,
            0,
            size / 2,
            size / 2,
            size / 2
          );
          gradient.addColorStop(0, bgColor);
          gradient.addColorStop(1, bgColor2);
          tempCtx.fillStyle = gradient;
        }
      } else {
        tempCtx.clearRect(0, 0, size, size);
      }

      // Draw shape (same logic as renderLogo but on tempCtx)
      tempCtx.save();
      if (shape === "circle") {
        tempCtx.beginPath();
        tempCtx.arc(size / 2, size / 2, size / 2 - borderWidth, 0, Math.PI * 2);
        if (!transparentBg) tempCtx.fill();
        if (borderWidth > 0) {
          tempCtx.strokeStyle = borderColor;
          tempCtx.lineWidth = borderWidth * 2;
          tempCtx.stroke();
        }
      } else if (shape === "rounded-square") {
        const radius = Math.floor(size * 0.1);
        const offset = borderWidth;
        tempCtx.beginPath();
        tempCtx.moveTo(radius + offset, offset);
        tempCtx.lineTo(size - radius - offset, offset);
        tempCtx.quadraticCurveTo(
          size - offset,
          offset,
          size - offset,
          radius + offset
        );
        tempCtx.lineTo(size - offset, size - radius - offset);
        tempCtx.quadraticCurveTo(
          size - offset,
          size - offset,
          size - radius - offset,
          size - offset
        );
        tempCtx.lineTo(radius + offset, size - offset);
        tempCtx.quadraticCurveTo(
          offset,
          size - offset,
          offset,
          size - radius - offset
        );
        tempCtx.lineTo(offset, radius + offset);
        tempCtx.quadraticCurveTo(offset, offset, radius + offset, offset);
        tempCtx.closePath();
        if (!transparentBg) tempCtx.fill();
        if (borderWidth > 0) {
          tempCtx.strokeStyle = borderColor;
          tempCtx.lineWidth = borderWidth * 2;
          tempCtx.stroke();
        }
      } else if (shape === "shield") {
        const offset = borderWidth;
        tempCtx.beginPath();
        tempCtx.moveTo(size / 2, offset);
        tempCtx.lineTo(size - offset, size * 0.3);
        tempCtx.lineTo(size - offset, size - size * 0.3);
        tempCtx.lineTo(size / 2, size - offset);
        tempCtx.lineTo(offset, size - size * 0.3);
        tempCtx.lineTo(offset, size * 0.3);
        tempCtx.closePath();
        if (!transparentBg) tempCtx.fill();
        if (borderWidth > 0) {
          tempCtx.strokeStyle = borderColor;
          tempCtx.lineWidth = borderWidth * 2;
          tempCtx.stroke();
        }
      } else if (shape === "badge") {
        const offset = borderWidth;
        tempCtx.beginPath();
        tempCtx.arc(size / 2, size * 0.2, size * 0.15, Math.PI, 0, false);
        tempCtx.lineTo(size - offset, size * 0.2);
        tempCtx.lineTo(size - offset, size - size * 0.2);
        tempCtx.lineTo(size / 2, size - offset);
        tempCtx.lineTo(offset, size - size * 0.2);
        tempCtx.lineTo(offset, size * 0.2);
        tempCtx.closePath();
        if (!transparentBg) tempCtx.fill();
        if (borderWidth > 0) {
          tempCtx.strokeStyle = borderColor;
          tempCtx.lineWidth = borderWidth * 2;
          tempCtx.stroke();
        }
      } else if (shape === "hexagon") {
        const offset = borderWidth;
        tempCtx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = size / 2 + (size / 2 - offset) * Math.cos(angle);
          const y = size / 2 + (size / 2 - offset) * Math.sin(angle);
          if (i === 0) tempCtx.moveTo(x, y);
          else tempCtx.lineTo(x, y);
        }
        tempCtx.closePath();
        if (!transparentBg) tempCtx.fill();
        if (borderWidth > 0) {
          tempCtx.strokeStyle = borderColor;
          tempCtx.lineWidth = borderWidth * 2;
          tempCtx.stroke();
        }
      }
      tempCtx.restore();

      // Draw pattern
      if (pattern === "stripes" && !transparentBg) {
        tempCtx.save();
        tempCtx.globalAlpha = 0.1;
        tempCtx.strokeStyle = textColor;
        tempCtx.lineWidth = Math.max(2, size / 100);
        for (let i = -size; i < size * 2; i += size / 10) {
          tempCtx.beginPath();
          tempCtx.moveTo(i, 0);
          tempCtx.lineTo(i + size, size);
          tempCtx.stroke();
        }
        tempCtx.restore();
      } else if (pattern === "dots" && !transparentBg) {
        tempCtx.save();
        tempCtx.globalAlpha = 0.15;
        tempCtx.fillStyle = textColor;
        const dotSpacing = size / 13.33;
        for (let x = 0; x < size; x += dotSpacing) {
          for (let y = 0; y < size; y += dotSpacing) {
            tempCtx.beginPath();
            tempCtx.arc(x, y, Math.max(2, size / 100), 0, Math.PI * 2);
            tempCtx.fill();
          }
        }
        tempCtx.restore();
      }

      // Draw icon
      if (icon !== "none") {
        tempCtx.save();
        const iconXPos = size / 2 + (iconX * size) / 200;
        const iconYPos = size / 2 + (iconY * size) / 200;
        const iconSizeScaled = (iconSize * size) / 200;

        if (iconChip) {
          tempCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
          tempCtx.beginPath();
          tempCtx.arc(
            iconXPos,
            iconYPos,
            iconSizeScaled / 2 + size / 25,
            0,
            Math.PI * 2
          );
          tempCtx.fill();
        }

        tempCtx.fillStyle = iconColor;
        tempCtx.strokeStyle = iconColor;
        tempCtx.lineWidth = Math.max(3, size / 67);

        if (icon === "football") {
          tempCtx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const x = iconXPos + (iconSizeScaled / 2) * Math.cos(angle);
            const y = iconYPos + (iconSizeScaled / 2) * Math.sin(angle);
            if (i === 0) tempCtx.moveTo(x, y);
            else tempCtx.lineTo(x, y);
          }
          tempCtx.closePath();
          tempCtx.stroke();
        } else if (icon === "star") {
          tempCtx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const x = iconXPos + (iconSizeScaled / 2) * Math.cos(angle);
            const y = iconYPos + (iconSizeScaled / 2) * Math.sin(angle);
            if (i === 0) tempCtx.moveTo(x, y);
            else tempCtx.lineTo(x, y);
          }
          tempCtx.closePath();
          tempCtx.fill();
        } else if (icon === "bolt") {
          tempCtx.beginPath();
          tempCtx.moveTo(
            iconXPos - iconSizeScaled / 4,
            iconYPos - iconSizeScaled / 2
          );
          tempCtx.lineTo(iconXPos + iconSizeScaled / 4, iconYPos);
          tempCtx.lineTo(iconXPos - iconSizeScaled / 6, iconYPos);
          tempCtx.lineTo(
            iconXPos + iconSizeScaled / 4,
            iconYPos + iconSizeScaled / 2
          );
          tempCtx.closePath();
          tempCtx.fill();
        } else if (icon === "shield") {
          tempCtx.beginPath();
          tempCtx.moveTo(iconXPos, iconYPos - iconSizeScaled / 2);
          tempCtx.lineTo(
            iconXPos - iconSizeScaled / 2,
            iconYPos - iconSizeScaled / 4
          );
          tempCtx.lineTo(
            iconXPos - iconSizeScaled / 2,
            iconYPos + iconSizeScaled / 4
          );
          tempCtx.lineTo(iconXPos, iconYPos + iconSizeScaled / 2);
          tempCtx.lineTo(
            iconXPos + iconSizeScaled / 2,
            iconYPos + iconSizeScaled / 4
          );
          tempCtx.lineTo(
            iconXPos + iconSizeScaled / 2,
            iconYPos - iconSizeScaled / 4
          );
          tempCtx.closePath();
          tempCtx.fill();
        } else if (icon === "trophy") {
          tempCtx.beginPath();
          tempCtx.moveTo(
            iconXPos - iconSizeScaled / 3,
            iconYPos - iconSizeScaled / 2
          );
          tempCtx.lineTo(
            iconXPos + iconSizeScaled / 3,
            iconYPos - iconSizeScaled / 2
          );
          tempCtx.lineTo(iconXPos + iconSizeScaled / 3, iconYPos);
          tempCtx.lineTo(
            iconXPos + iconSizeScaled / 4,
            iconYPos + iconSizeScaled / 2
          );
          tempCtx.lineTo(
            iconXPos - iconSizeScaled / 4,
            iconYPos + iconSizeScaled / 2
          );
          tempCtx.lineTo(iconXPos - iconSizeScaled / 3, iconYPos);
          tempCtx.closePath();
          tempCtx.fill();
        } else if (icon === "target") {
          tempCtx.beginPath();
          tempCtx.arc(iconXPos, iconYPos, iconSizeScaled / 2, 0, Math.PI * 2);
          tempCtx.stroke();
          tempCtx.beginPath();
          tempCtx.arc(iconXPos, iconYPos, iconSizeScaled / 3, 0, Math.PI * 2);
          tempCtx.stroke();
          tempCtx.beginPath();
          tempCtx.arc(iconXPos, iconYPos, iconSizeScaled / 6, 0, Math.PI * 2);
          tempCtx.fill();
        } else if (icon === "flame") {
          tempCtx.beginPath();
          tempCtx.moveTo(iconXPos, iconYPos - iconSizeScaled / 2);
          tempCtx.quadraticCurveTo(
            iconXPos - iconSizeScaled / 3,
            iconYPos,
            iconXPos,
            iconYPos + iconSizeScaled / 2
          );
          tempCtx.quadraticCurveTo(
            iconXPos + iconSizeScaled / 3,
            iconYPos,
            iconXPos,
            iconYPos - iconSizeScaled / 2
          );
          tempCtx.closePath();
          tempCtx.fill();
        } else if (icon === "crown") {
          tempCtx.beginPath();
          tempCtx.moveTo(iconXPos - iconSizeScaled / 2, iconYPos);
          tempCtx.lineTo(
            iconXPos - iconSizeScaled / 4,
            iconYPos - iconSizeScaled / 2
          );
          tempCtx.lineTo(iconXPos, iconYPos - iconSizeScaled / 3);
          tempCtx.lineTo(
            iconXPos + iconSizeScaled / 4,
            iconYPos - iconSizeScaled / 2
          );
          tempCtx.lineTo(iconXPos + iconSizeScaled / 2, iconYPos);
          tempCtx.closePath();
          tempCtx.fill();
        }
        tempCtx.restore();
      }

      // Draw text
      if (text) {
        tempCtx.save();
        tempCtx.fillStyle = textColor;
        tempCtx.font = `${fontWeight} ${Math.floor(
          size * 0.24
        )}px ${fontFamily}`;
        tempCtx.textAlign = "center";
        tempCtx.textBaseline = "middle";
        tempCtx.letterSpacing = `${(letterSpacing * size) / 200}px`;

        if (textShadow) {
          tempCtx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
          tempCtx.shadowBlur = Math.max(4, size / 50);
          tempCtx.shadowOffsetX = Math.max(2, size / 100);
          tempCtx.shadowOffsetY = Math.max(2, size / 100);
        }

        if (textOutline) {
          tempCtx.strokeStyle = "rgba(0, 0, 0, 0.5)";
          tempCtx.lineWidth = Math.max(2, size / 100);
          const textY = icon !== "none" ? size / 2 + size * 0.2 : size / 2;
          tempCtx.strokeText(text, size / 2, textY);
        }

        const textY = icon !== "none" ? size / 2 + size * 0.2 : size / 2;
        tempCtx.fillText(text, size / 2, textY);

        if (subtitle) {
          tempCtx.font = `normal ${Math.floor(size * 0.12)}px ${fontFamily}`;
          tempCtx.fillText(subtitle, size / 2, textY + size * 0.15);
        }

        tempCtx.restore();
      }

      // Effects
      if (innerShadow) {
        tempCtx.save();
        tempCtx.globalCompositeOperation = "multiply";
        const gradient = tempCtx.createRadialGradient(
          size / 2,
          size / 2,
          size * 0.3,
          size / 2,
          size / 2,
          size / 2
        );
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, size, size);
        tempCtx.restore();
      }

      if (highlight) {
        tempCtx.save();
        tempCtx.globalCompositeOperation = "screen";
        const gradient = tempCtx.createRadialGradient(
          size / 2,
          size / 3,
          0,
          size / 2,
          size / 3,
          size / 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        gradient.addColorStop(1, "transparent");
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, size, size);
        tempCtx.restore();
      }

      if (grain) {
        tempCtx.save();
        tempCtx.globalAlpha = 0.05;
        const imageData = tempCtx.getImageData(0, 0, size, size);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = Math.random() * 255;
          imageData.data[i] = noise;
          imageData.data[i + 1] = noise;
          imageData.data[i + 2] = noise;
        }
        tempCtx.putImageData(imageData, 0, 0);
        tempCtx.restore();
      }
    };

    // Render and export
    requestAnimationFrame(() => {
      renderExport();
      const dataUrl = tempCanvas.toDataURL("image/png");
      onSave(dataUrl);
      onOpenChange(false);
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveTab("upload");
    }
  };

  const resetToDefaults = () => {
    setText("");
    setSubtitle("");
    setShape("circle");
    setBgType("solid");
    setBgColor("#3B82F6");
    setBgColor2("#1E40AF");
    setGradientAngle(45);
    setPattern("none");
    setTransparentBg(false);
    setTextColor("#FFFFFF");
    setFontFamily("Arial");
    setFontWeight("bold");
    setLetterSpacing(0);
    setTextOutline(false);
    setTextShadow(true);
    setShadowIntensity(0.3);
    setIcon("none");
    setIconSize(60);
    setIconX(0);
    setIconY(-15);
    setIconColor("#FFFFFF");
    setIconChip(false);
    setBorderWidth(0);
    setBorderColor("#000000");
    setInnerShadow(false);
    setHighlight(false);
    setGrain(false);
  };

  const randomize = () => {
    const shapes: Shape[] = [
      "circle",
      "rounded-square",
      "shield",
      "badge",
      "hexagon",
    ];
    const icons: IconType[] = [
      "none",
      "football",
      "star",
      "bolt",
      "shield",
      "trophy",
      "target",
      "flame",
      "crown",
    ];
    const bgTypes: BackgroundType[] = ["solid", "linear", "radial"];

    setShape(shapes[Math.floor(Math.random() * shapes.length)]);
    setBgType(bgTypes[Math.floor(Math.random() * bgTypes.length)]);
    setBgColor(COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]);
    setBgColor2(
      COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]
    );
    setTextColor(
      COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]
    );
    setIcon(icons[Math.floor(Math.random() * icons.length)]);
    setIconColor(
      COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)]
    );
    setBorderWidth(Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0);
    setPattern(
      Math.random() > 0.7 ? (Math.random() > 0.5 ? "stripes" : "dots") : "none"
    );
    setInnerShadow(Math.random() > 0.7);
    setHighlight(Math.random() > 0.7);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl w-[calc(100vw-2rem)] sm:w-[calc(100vw-3rem)] md:w-[calc(100vw-4rem)] lg:w-[90vw] xl:max-w-6xl overflow-x-hidden pb-8"
        dir={dir}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t("teams.createLogo")}</DialogTitle>
          <DialogDescription>{t("teams.createLogoDesc")}</DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "upload" | "create")}
          className="w-full flex flex-col flex-1 min-h-0 overflow-visible"
        >
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="upload">
              <Upload className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t("teams.uploadLogo")}
            </TabsTrigger>
            <TabsTrigger value="create">
              <Sparkles className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
              {t("teams.createLogo")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4 mt-4 flex-1 overflow-y-auto min-h-0 custom-scrollbar">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>{t("teams.selectFile")}</span>
                </Button>
              </Label>
              <input
                ref={fileInputRef}
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {t("teams.uploadHint")}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-4 flex-1 min-h-0 flex flex-col overflow-visible">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-visible">
              {/* Preview Panel */}
              <div className="lg:col-span-1 flex flex-col overflow-visible relative">
                <div className="flex flex-col overflow-visible pb-8">
                  <Label className="text-lg font-semibold">
                    {t("teams.preview")}
                  </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 bg-muted/50 flex items-center justify-center mt-2">
                    <canvas
                      ref={canvasRef}
                      className="w-full max-w-[200px] aspect-square"
                      style={{ imageRendering: "auto" }}
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    <Label>{t("teams.exportSize")}</Label>
                    <Select
                      value={exportSize}
                      onValueChange={(v) => setExportSize(v as "512" | "1024")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512">
                          512 × 512 {t("teams.pixels")}
                        </SelectItem>
                        <SelectItem value="1024">
                          1024 × 1024 {t("teams.pixels")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 mt-6 relative z-[100]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetToDefaults}
                      className="flex-1 relative z-[100]"
                      style={{ zIndex: 100 }}
                    >
                      <RotateCcw
                        className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
                      />
                      {t("teams.reset")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={randomize}
                      className="flex-1 relative z-[100]"
                      style={{ zIndex: 100 }}
                    >
                      <Sparkles
                        className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
                      />
                      {t("teams.randomize")}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Controls Panel */}
              <div className="lg:col-span-2 space-y-6 pr-2 overflow-y-auto custom-scrollbar flex-1 min-h-0">
                {/* Text Section */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-lg">
                    {t("teams.textSection")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("teams.logoText")}</Label>
                      <Input
                        value={text}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Allow empty string, or uppercase and limit to 3 characters
                          const newValue = inputValue === "" 
                            ? "" 
                            : inputValue.toUpperCase().substring(0, 3);
                          setText(newValue);
                        }}
                        placeholder={t("teams.logoTextPlaceholder")}
                        maxLength={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("teams.logoSubtitleLabel")} ({t("teams.optional")})
                      </Label>
                      <Input
                        value={subtitle}
                        onChange={(e) =>
                          setSubtitle(e.target.value.substring(0, 10))
                        }
                        placeholder={t("teams.subtitlePlaceholder")}
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>{t("teams.fontFamily")}</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FONT_FAMILIES.map((font) => (
                            <SelectItem key={font.value} value={font.value}>
                              {font.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("teams.fontWeight")}</Label>
                      <Select value={fontWeight} onValueChange={setFontWeight}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">
                            {t("teams.normal")}
                          </SelectItem>
                          <SelectItem value="bold">
                            {t("teams.bold")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        {t("teams.letterSpacing")}: {letterSpacing}px
                      </Label>
                      <input
                        type="range"
                        min="-5"
                        max="10"
                        value={letterSpacing}
                        onChange={(e) =>
                          setLetterSpacing(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("teams.textColor")}</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {COLOR_PRESETS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setTextColor(color)}
                          className={cn(
                            "w-8 h-8 rounded border-2 transition-all",
                            textColor === color
                              ? "border-foreground scale-110"
                              : "border-border"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <Input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="text-outline"
                        checked={textOutline}
                        onChange={(e) => setTextOutline(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="text-outline" className="cursor-pointer">
                        {t("teams.textOutline")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="text-shadow"
                        checked={textShadow}
                        onChange={(e) => setTextShadow(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="text-shadow" className="cursor-pointer">
                        {t("teams.textShadow")}
                      </Label>
                    </div>
                  </div>
                  {textShadow && (
                    <div className="space-y-2">
                      <Label>
                        {t("teams.shadowIntensity")}:{" "}
                        {Math.round(shadowIntensity * 100)}%
                      </Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={shadowIntensity}
                        onChange={(e) =>
                          setShadowIntensity(parseFloat(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                  )}
                </div>

                {/* Shape & Background Section */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-lg">
                    {t("teams.shapeBackground")}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("teams.logoShape")}</Label>
                      <Select
                        value={shape}
                        onValueChange={(v) => setShape(v as Shape)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">
                            {t("teams.shapeCircle")}
                          </SelectItem>
                          <SelectItem value="rounded-square">
                            {t("teams.shapeRoundedSquare")}
                          </SelectItem>
                          <SelectItem value="shield">
                            {t("teams.shapeShield")}
                          </SelectItem>
                          <SelectItem value="badge">
                            {t("teams.shapeBadge")}
                          </SelectItem>
                          <SelectItem value="hexagon">
                            {t("teams.shapeHexagon")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("teams.backgroundType")}</Label>
                      <Select
                        value={bgType}
                        onValueChange={(v) => setBgType(v as BackgroundType)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">
                            {t("teams.solid")}
                          </SelectItem>
                          <SelectItem value="linear">
                            {t("teams.linearGradient")}
                          </SelectItem>
                          <SelectItem value="radial">
                            {t("teams.radialGradient")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {bgType === "solid" && (
                    <div className="space-y-2">
                      <Label>{t("teams.backgroundColor")}</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {COLOR_PRESETS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setBgColor(color)}
                            className={cn(
                              "w-8 h-8 rounded border-2 transition-all",
                              bgColor === color
                                ? "border-foreground scale-110"
                                : "border-border"
                            )}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <Input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="h-10"
                      />
                    </div>
                  )}
                  {(bgType === "linear" || bgType === "radial") && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t("teams.color1")}</Label>
                          <Input
                            type="color"
                            value={bgColor}
                            onChange={(e) => setBgColor(e.target.value)}
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("teams.color2")}</Label>
                          <Input
                            type="color"
                            value={bgColor2}
                            onChange={(e) => setBgColor2(e.target.value)}
                            className="h-10"
                          />
                        </div>
                      </div>
                      {bgType === "linear" && (
                        <div className="space-y-2">
                          <Label>
                            {t("teams.gradientAngle")}: {gradientAngle}°
                          </Label>
                          <input
                            type="range"
                            min="0"
                            max="360"
                            value={gradientAngle}
                            onChange={(e) =>
                              setGradientAngle(parseInt(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                      )}
                    </>
                  )}
                  <div className="space-y-2">
                    <Label>{t("teams.pattern")}</Label>
                    <Select
                      value={pattern}
                      onValueChange={(v) => setPattern(v as PatternType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("teams.patternNone")}
                        </SelectItem>
                        <SelectItem value="stripes">
                          {t("teams.patternStripes")}
                        </SelectItem>
                        <SelectItem value="dots">
                          {t("teams.patternDots")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="transparent-bg"
                      checked={transparentBg}
                      onChange={(e) => setTransparentBg(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="transparent-bg" className="cursor-pointer">
                      {t("teams.transparentBackground")}
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        {t("teams.borderWidth")}: {borderWidth}px
                      </Label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={borderWidth}
                        onChange={(e) =>
                          setBorderWidth(parseInt(e.target.value))
                        }
                        className="w-full"
                      />
                    </div>
                    {borderWidth > 0 && (
                      <div className="space-y-2">
                        <Label>{t("teams.borderColor")}</Label>
                        <Input
                          type="color"
                          value={borderColor}
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="h-10"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Icon Section */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-lg">
                    {t("teams.iconSection")}
                  </h3>
                  <div className="space-y-2">
                    <Label>{t("teams.logoIcon")}</Label>
                    <Select
                      value={icon}
                      onValueChange={(v) => setIcon(v as IconType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">
                          {t("teams.iconNone")}
                        </SelectItem>
                        <SelectItem value="football">
                          {t("teams.iconFootball")}
                        </SelectItem>
                        <SelectItem value="star">
                          {t("teams.iconStar")}
                        </SelectItem>
                        <SelectItem value="bolt">
                          {t("teams.iconBolt")}
                        </SelectItem>
                        <SelectItem value="shield">
                          {t("teams.iconShield")}
                        </SelectItem>
                        <SelectItem value="trophy">
                          {t("teams.iconTrophy")}
                        </SelectItem>
                        <SelectItem value="target">
                          {t("teams.iconTarget")}
                        </SelectItem>
                        <SelectItem value="flame">
                          {t("teams.iconFlame")}
                        </SelectItem>
                        <SelectItem value="crown">
                          {t("teams.iconCrown")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {icon !== "none" && (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>
                            {t("teams.iconSize")}: {iconSize}px
                          </Label>
                          <input
                            type="range"
                            min="30"
                            max="100"
                            value={iconSize}
                            onChange={(e) =>
                              setIconSize(parseInt(e.target.value))
                            }
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>X: {iconX}px</Label>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={iconX}
                            onChange={(e) => setIconX(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Y: {iconY}px</Label>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={iconY}
                            onChange={(e) => setIconY(parseInt(e.target.value))}
                            className="w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t("teams.iconColor")}</Label>
                        <Input
                          type="color"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="h-10"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="icon-chip"
                          checked={iconChip}
                          onChange={(e) => setIconChip(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="icon-chip" className="cursor-pointer">
                          {t("teams.iconChip")}
                        </Label>
                      </div>
                    </>
                  )}
                </div>

                {/* Effects Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">
                    {t("teams.effectsSection")}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="inner-shadow"
                        checked={innerShadow}
                        onChange={(e) => setInnerShadow(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="inner-shadow" className="cursor-pointer">
                        {t("teams.innerShadow")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="highlight"
                        checked={highlight}
                        onChange={(e) => setHighlight(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="highlight" className="cursor-pointer">
                        {t("teams.highlight")}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="grain"
                        checked={grain}
                        onChange={(e) => setGrain(e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor="grain" className="cursor-pointer">
                        {t("teams.grain")}
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-shrink-0 border-t pt-4 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={activeTab === "create" && !text}
          >
            <Download className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
            {t("teams.saveLogo")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
