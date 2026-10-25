import { create } from "zustand";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",

  // Fetch anecdotes from the backend
  initializeAnecdotes: async () => {
    const response = await fetch("http://localhost:3001/anecdotes");

    if (!response.ok) {
      throw new Error("Failed to fetch anecdotes");
    }

    const anecdotes = await response.json();

    set({ anecdotes });
  },

  // Update the filter
  setFilter: (value) => set({ filter: value }),

  // Create a new anecdote in the backend
  createAnecdote: async (content) => {
    const newAnecdote = {
      content,
      votes: 0,
    };

    const response = await fetch("http://localhost:3001/anecdotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newAnecdote),
    });

    if (!response.ok) {
      throw new Error("Failed to create anecdote");
    }

    const savedAnecdote = await response.json();

    set((state) => ({
      anecdotes: state.anecdotes.concat(savedAnecdote),
    }));
  },

  // Save votes to the backend
  voteAnecdote: async (id) => {
    const anecdote = get().anecdotes.find((a) => String(a.id) === String(id));

    if (!anecdote) return;

    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    const response = await fetch(`http://localhost:3001/anecdotes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedAnecdote),
    });

    if (!response.ok) {
      throw new Error("Failed to update vote");
    }

    const savedAnecdote = await response.json();

    set((state) => ({
      anecdotes: state.anecdotes.map((a) =>
        String(a.id) === String(id) ? savedAnecdote : a,
      ),
    }));
  },
  deleteAnecdote: async (id) => {
    const anecdote = get().anecdotes.find((a) => String(a.id) === String(id));

    if (!anecdote || anecdote.votes !== 0) return;

    const response = await fetch(`http://localhost:3001/anecdotes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete anecdote");
    }

    set((state) => ({
      anecdotes: state.anecdotes.filter((a) => String(a.id) !== String(id)),
    }));
  },
}));

// Custom hooks
export const useFilter = () => useAnecdoteStore((state) => state.filter);

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);

export const useAnecdoteActions = () => {
  const createAnecdote = useAnecdoteStore((state) => state.createAnecdote);

  const voteAnecdote = useAnecdoteStore((state) => state.voteAnecdote);

  const deleteAnecdote = useAnecdoteStore((state) => state.deleteAnecdote);

  const setFilter = useAnecdoteStore((state) => state.setFilter);

  const initializeAnecdotes = useAnecdoteStore(
    (state) => state.initializeAnecdotes,
  );

  return {
    createAnecdote,
    voteAnecdote,
    setFilter,
    deleteAnecdote,
    initializeAnecdotes,
  };
};
