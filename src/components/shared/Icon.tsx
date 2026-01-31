import { LucideIcon } from "lucide-react";
import {
  Target,
  Rocket,
  Gamepad2,
  Link,
  ArrowRight,
  HelpCircle,
  Trophy,
  Medal,
  RotateCcw,
  Check,
  X,
  Zap,
  Smartphone,
  Mic,
  Timer,
  Loader2,
  Sparkles,
  Users,
  PartyPopper,
  AlarmClock,
  CheckCircle,
} from "lucide-react";

// Re-export all icons we use
export {
  Target,
  Rocket,
  Gamepad2,
  Link,
  ArrowRight,
  HelpCircle,
  Trophy,
  Medal,
  RotateCcw,
  Check,
  X,
  Zap,
  Smartphone,
  Mic,
  Timer,
  Loader2,
  Sparkles,
  Users,
  PartyPopper,
  AlarmClock,
  CheckCircle,
};

// Size presets
const sizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  "2xl": 64,
  "3xl": 80,
} as const;

type IconSize = keyof typeof sizes | number;

interface IconProps {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ icon: IconComponent, size = "md", className = "", strokeWidth = 2.5 }: IconProps) {
  const pixelSize = typeof size === "number" ? size : sizes[size];

  return (
    <IconComponent
      size={pixelSize}
      strokeWidth={strokeWidth}
      className={`doodle-icon ${className}`}
    />
  );
}

// Medal variants for podium positions
interface MedalIconProps {
  position: 1 | 2 | 3;
  size?: IconSize;
  className?: string;
}

export function MedalIcon({ position, size = "md", className = "" }: MedalIconProps) {
  const colors = {
    1: "text-amber-500", // Gold
    2: "text-gray-400",  // Silver
    3: "text-orange-400", // Bronze
  };

  return (
    <Icon
      icon={Medal}
      size={size}
      className={`${colors[position]} ${className}`}
    />
  );
}
