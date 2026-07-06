import {useEffect, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {ConfirmButton} from "@/components/confirm-button";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import {
  useAnkiConnectionStatus,
  useCreateCard,
  useDeckNames,
  useDeleteNote,
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
  const deleteNote = useDeleteNote();
  const frontInputRef = useRef<HTMLInputElement>(null);

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

  function handleDeckNameChange(value: string | null) {
    if (value === null) {
      return;
    }
    setDeckName(value);
    localStorage.setItem(DECK_NAME_STORAGE_KEY, value);
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
          frontInputRef.current?.focus();
        },
      },
    );
  }

  return (
    <>
      <div className="h-dvh flex flex-col items-center gap-6 p-6">
        <form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
          <Input
            ref={frontInputRef}
            type="text"
            name="front"
            autoComplete="off"
            required
            placeholder="front"
            value={front}
            autoFocus
            onChange={(event) => setFront(event.target.value)}
          />
          <Input
            type="text"
            name="back"
            autoComplete="off"
            placeholder="back"
            value={back}
            onChange={(event) => setBack(event.target.value)}
          />
          <Select
            name="deckName"
            value={deckName}
            onValueChange={handleDeckNameChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a deck" />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} className="w-fit">
              {deckNames.data?.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="text"
            name="tags"
            autoComplete="off"
            placeholder="tags separated by spaces"
            value={tags}
            onChange={handleTagsChange}
          />
          <Button type="submit" disabled={!isConnected}>
            submit
          </Button>
        </form>

        {!connectionStatus.isPending && !isConnected && (
          <p className="text-red-600">
            Anki is not running or not accepting connections.
          </p>
        )}

        <div className="flex-1 flex flex-col gap-2 overflow-auto">
          {notesAddedToday.isFetched && !!notesAddedToday.data?.length && (
            <>
              <h2>Notes added today</h2>
              <ul className="flex flex-col gap-1">
                {notesAddedToday.data.map((note) => (
                  <Item variant="outline" key={note.noteId}>
                    <ItemContent>
                      <ItemDescription>
                        {Object.values(note.fields)
                          .map((field) => field.value)
                          .join(" — ")}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ConfirmButton
                        variant="outline"
                        size="sm"
                        disabled={
                          deleteNote.isPending &&
                          deleteNote.variables === note.noteId
                        }
                        onConfirm={() => deleteNote.mutate(note.noteId)}
                      >
                        delete
                      </ConfirmButton>
                    </ItemActions>
                  </Item>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
