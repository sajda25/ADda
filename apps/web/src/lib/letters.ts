export type LetterPayload = {
  m: string;
  t: number;
  r: string;
};

export function mintLetterToken(memoryId: string): string {
  const payload: LetterPayload = {
    m: memoryId,
    t: Date.now(),
    r: Math.random().toString(36).slice(2, 10),
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function readLetterToken(token: string): LetterPayload | null {
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const parsed = JSON.parse(raw) as Partial<LetterPayload>;
    if (typeof parsed.m !== "string" || !parsed.m) return null;
    return {
      m: parsed.m,
      t: typeof parsed.t === "number" ? parsed.t : 0,
      r: typeof parsed.r === "string" ? parsed.r : "",
    };
  } catch {
    return null;
  }
}
