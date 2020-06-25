
type PointData = {
  x: number
  y: number
}

type SharedExternalData = {
  dataType: "path" | "text" | "emoji"
  id: string
  localId: string
}

export type PathData = SharedExternalData & {
  color: string
  dataType: "path"
  strokeWidth: number
  definition: string
}

export type TextData = SharedExternalData & {
  color: string
  dataType: "text"
  content: string
  fontFamily: string
  fontSize: number,
  point: PointData,
  position: PointData
}

export type EmojiItemData = SharedExternalData & {
  dataType: "emoji"
  code: string
  scale: number
  position: PointData
}

export type ExternalData = TextData | PathData | EmojiItemData
export type ExternalLoadType = "initial" | "added" | "updated"

export function generateLocalId(): string {
  const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
  return uint32.toString(16);
};

export function mapToRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
}

export function emojiSrc(code: string) {
  return `https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/${code}.svg`
}
