/**
 * Generate a deterministic color from a string (username, name, etc.)
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate a hue between 0-360
  const hue = Math.abs(hash) % 360;
  
  // Use a moderate saturation and lightness for better readability
  return `hsl(${hue}, 65%, 55%)`;
}

/**
 * Get initials from a name
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Generate an avatar URL with gradient background and initials
 * This creates a data URL for an SVG avatar
 */
export function generateAvatarUrl(name: string, username: string): string {
  const initials = getInitials(name);
  const color = getColorFromString(username || name);
  
  // Create SVG with gradient circle
  const svg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#grad)" />
      <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" font-weight="bold" 
            fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Adjust brightness of HSL color
 */
function adjustBrightness(hsl: string, amount: number): string {
  const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return hsl;
  
  const [, h, s, l] = match;
  const newL = Math.max(0, Math.min(100, parseInt(l) + amount));
  return `hsl(${h}, ${s}%, ${newL}%)`;
}

/**
 * Get a placeholder image URL for posts/media
 */
export function getPlaceholderImageUrl(type: 'pitch' | 'team' | 'post' = 'post'): string {
  // Create a simple gradient placeholder
  const colors = {
    pitch: ['#4CAF50', '#45a049'],
    team: ['#2196F3', '#1976D2'],
    post: ['#FF9800', '#F57C00'],
  };
  
  const [color1, color2] = colors[type];
  
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grad)" />
      <text x="400" y="300" font-family="Arial, sans-serif" font-size="48" 
            fill="white" text-anchor="middle" dominant-baseline="central" opacity="0.3">
        ${type === 'pitch' ? '⚽' : type === 'team' ? '👥' : '📝'}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

