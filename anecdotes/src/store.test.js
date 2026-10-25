import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAnecdoteStore } from "./store";

describe("anecdote store initialization", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [] });
  });

  it("initializes anecdotes with data returned by the backend", async () => {
    const backendAnecdotes = [
      { id: "1", content: "Test anecdote one", votes: 3 },
      { id: "2", content: "Test anecdote two", votes: 5 },
    ];

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => backendAnecdotes,
      }),
    );

    try {
      await useAnecdoteStore.getState().initializeAnecdotes();

      expect(useAnecdoteStore.getState().anecdotes).toEqual(backendAnecdotes);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
