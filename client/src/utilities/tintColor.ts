function clamp(num: number, a = 0, b = 255) {
  return Math.max(a, Math.min(b, Math.round(num)));
}

function parseHexColor(hex: string) {
  let hexValue = hex.replace("#", "").trim();
  if (hexValue.length === 3) {
    hexValue = hexValue
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const r = parseInt(hexValue.substring(0, 2), 16);
  const g = parseInt(hexValue.substring(2, 4), 16);
  const b = parseInt(hexValue.substring(4, 6), 16);
  return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((color) => clamp(color).toString(16).padStart(2, "0"))
      .join("")
  );
}

export function tintColor(hex: string, amount: number) {
  try {
    const { r, g, b } = parseHexColor(hex);
    if (amount > 0) {
      const newR = clamp(r + (255 - r) * amount);
      const newG = clamp(g + (255 - g) * amount);
      const newB = clamp(b + (255 - b) * amount);
      return rgbToHex(newR, newG, newB);
    } else {
      const factor = 1 + amount;
      const newR = clamp(r * factor);
      const newG = clamp(g * factor);
      const newB = clamp(b * factor);
      return rgbToHex(newR, newG, newB);
    }
  } catch {
    return hex;
  }
}
