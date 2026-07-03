const ANKI_URL = "http://localhost:8765";
const ANKI_CONNECT_VERSION = 6;

interface AnkiConnectResponse<T> {
  result: T;
  error: string | null;
}

async function invoke<T>(action: string, params: object = {}): Promise<T> {
  const response = await fetch(ANKI_URL, {
    method: "POST",
    body: JSON.stringify({ action, version: ANKI_CONNECT_VERSION, params }),
  });

  const body = (await response.json()) as AnkiConnectResponse<T>;

  if (body.error) {
    throw new Error(body.error);
  }

  return body.result;
}

interface RequestPermissionResult {
  permission: "granted" | "denied";
  requireApiKey?: boolean;
  version?: number;
}

export function checkConnection(): Promise<RequestPermissionResult> {
  return invoke<RequestPermissionResult>("requestPermission");
}

export interface CreateCardParams {
  deckName: string;
  modelName: string;
  fields: Record<string, string>;
  tags?: string[];
}

export function createCard({
  deckName,
  modelName,
  fields,
  tags = [],
}: CreateCardParams): Promise<number> {
  return invoke<number>("addNote", {
    note: { deckName, modelName, fields, tags },
  });
}

export interface NoteInfo {
  noteId: number;
  modelName: string;
  tags: string[];
  fields: Record<string, { value: string; order: number }>;
  cards: number[];
}

export function getNotesAddedToday(): Promise<NoteInfo[]> {
  return invoke<NoteInfo[]>("notesInfo", { query: "added:1" });
}
