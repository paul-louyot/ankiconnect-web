import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
  useAnkiConnectionStatus,
  useCreateCard,
  useDeckNames,
  useNotesAddedToday,
} from "./lib/ankiConnectQueries";

const DECK_NAME_STORAGE_KEY = "ankiCreator.deckName";
const TAGS_STORAGE_KEY = "ankiCreator.tags";

function App() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deckName, setDeckName] = useState("");
  const [tags, setTags] = useState(
    () => localStorage.getItem(TAGS_STORAGE_KEY) ?? "",
  );

  const connectionStatus = useAnkiConnectionStatus();
  const deckNames = useDeckNames();
  const notesAddedToday = useNotesAddedToday();
  const createCard = useCreateCard();

  const isConnected = connectionStatus.data?.permission === "granted";

  useEffect(() => {
    if (deckName !== "" || !deckNames.data || deckNames.data.length === 0) {
      return;
    }

    const storedDeckName = localStorage.getItem(DECK_NAME_STORAGE_KEY);
    if (storedDeckName && deckNames.data.includes(storedDeckName)) {
      setDeckName(storedDeckName);
    } else {
      setDeckName(deckNames.data[0]);
    }
  }, [deckName, deckNames.data]);

  function handleDeckNameChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDeckName(event.target.value);
    localStorage.setItem(DECK_NAME_STORAGE_KEY, event.target.value);
  }

  function handleTagsChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTags(event.target.value);
    localStorage.setItem(TAGS_STORAGE_KEY, event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCard.mutate(
      {
        deckName,
        modelName: "Basic",
        fields: {Front: front, Back: back},
        tags: tags.split(" ").filter((tag) => tag !== ""),
      },
      {
        onSuccess: () => {
          setFront("");
          setBack("");
        },
      },
    );
  }

  return (
    <>
      <div className="min-h-dvh flex flex-col justify-center items-center gap-6">
        {!isConnected && (
          <p className="text-red-600">
            Anki is not running or not accepting connections.
          </p>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="front"
            className="input"
            size={40}
            autoComplete="off"
            required
            placeholder="front"
            value={front}
            autoFocus
            onChange={(event) => setFront(event.target.value)}
          />
          <input
            type="text"
            name="back"
            className="input"
            size={40}
            autoComplete="off"
            placeholder="back"
            value={back}
            onChange={(event) => setBack(event.target.value)}
          />
          <select
            name="deckName"
            className="select"
            value={deckName}
            onChange={handleDeckNameChange}
          >
            {deckNames.data?.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <input
            type="text"
            name="tags"
            className="input"
            size={40}
            autoComplete="off"
            placeholder="tags separated by spaces"
            value={tags}
            onChange={handleTagsChange}
          />
          <Button type="submit" disabled={!isConnected}>
            submit
          </Button>
        </form>

        <div className="flex flex-col gap-2">
          <h2>Notes added today</h2>
          <ul className="flex flex-col gap-1">
            {notesAddedToday.data?.map((note) => (
              <li key={note.noteId}>
                {Object.values(note.fields)
                  .map((field) => field.value)
                  .join(" — ")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
