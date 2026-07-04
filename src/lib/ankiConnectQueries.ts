import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  checkConnection,
  createCard,
  deleteNotes,
  getDeckNames,
  getNotesAddedToday,
  type CreateCardParams,
} from "./ankiConnect";

const notesAddedTodayKey = ["ankiConnect", "notesAddedToday"];

export function useAnkiConnectionStatus() {
  return useQuery({
    queryKey: ["ankiConnect", "status"],
    queryFn: checkConnection,
    retry: false,
  });
}

export function useDeckNames() {
  return useQuery({
    queryKey: ["ankiConnect", "deckNames"],
    queryFn: getDeckNames,
  });
}

export function useNotesAddedToday() {
  return useQuery({
    queryKey: notesAddedTodayKey,
    queryFn: getNotesAddedToday,
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateCardParams) => createCard(params),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: notesAddedTodayKey});
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: number) => deleteNotes([noteId]),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: notesAddedTodayKey});
    },
  });
}
