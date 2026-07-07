import {ConfirmButton} from "@/components/confirm-button";
import {Item, ItemContent, ItemDescription, ItemActions} from "@/components/ui/item";
import type {NoteInfo} from "@/lib/ankiConnect";

interface NoteItemProps {
  note: NoteInfo;
  isDeleting: boolean;
  onDelete: () => void;
}

export function NoteItem({note, isDeleting, onDelete}: NoteItemProps) {
  const description = Object.values(note.fields)
    .map((field) => field.value.replace(/(<br>)+/g, " "))
    .filter(Boolean)
    .join(" — ");

  return (
    <Item variant="outline">
      <ItemContent>
        <ItemDescription>{description}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <ConfirmButton
          variant="outline"
          size="sm"
          disabled={isDeleting}
          onConfirm={onDelete}
        >
          delete
        </ConfirmButton>
      </ItemActions>
    </Item>
  );
}
