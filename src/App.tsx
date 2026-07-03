import {useEffect, useState} from "react";
import {
  useAnkiConnectionStatus,
  useCreateCard,
  useDeckNames,
  useNotesAddedToday,
} from "./lib/ankiConnectQueries";

function App() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deckName, setDeckName] = useState("");

  const connectionStatus = useAnkiConnectionStatus();
  const deckNames = useDeckNames();
  const notesAddedToday = useNotesAddedToday();
  const createCard = useCreateCard();

  const isConnected = connectionStatus.data?.permission === "granted";

  useEffect(() => {
    if (deckName === "" && deckNames.data && deckNames.data.length > 0) {
      setDeckName(deckNames.data[0]);
    }
  }, [deckName, deckNames.data]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    createCard.mutate(
      {
        deckName,
        modelName: "Basic",
        fields: {Front: front, Back: back},
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
            value={front}
            onChange={(event) => setFront(event.target.value)}
          />
          <input
            type="text"
            name="back"
            className="input"
            size={40}
            value={back}
            onChange={(event) => setBack(event.target.value)}
          />
          <select
            name="deckName"
            className="select"
            value={deckName}
            onChange={(event) => setDeckName(event.target.value)}
          >
            {deckNames.data?.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          <button type="submit" className="btn" disabled={!isConnected}>
            submit
          </button>
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
