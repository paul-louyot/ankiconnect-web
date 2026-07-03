import {useState} from "react";
import {
  useAnkiConnectionStatus,
  useCreateCard,
  useNotesAddedToday,
} from "./lib/ankiConnectQueries";

function App() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [deckName, setDeckName] = useState("All::Dev");

  const connectionStatus = useAnkiConnectionStatus();
  const notesAddedToday = useNotesAddedToday();
  const createCard = useCreateCard();

  const isConnected = connectionStatus.data?.permission === "granted";

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
            <option>All::Dev</option>
            <option>All::Gen</option>
            <option>All::Quotes</option>
            <option>All::Lang::English</option>
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
