// @vitest-environment jsdom

import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AnecdoteList from "./AnecdoteList";
import { useAnecdoteStore } from "../store";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AnecdoteList", () => {
  beforeEach(() => {
    useAnecdoteStore.setState({
      anecdotes: [
        { id: "1", content: "Anecdote with few votes", votes: 2 },
        { id: "2", content: "Anecdote with most votes", votes: 10 },
        { id: "3", content: "Anecdote with some votes", votes: 5 },
      ],
      filter: "",
    });
  });

  it("displays anecdotes sorted by votes, highest first", () => {
    const { container } = render(<AnecdoteList />);

    const displayedAnecdotes = Array.from(container.firstChild.children).map(
      (anecdote) => anecdote.firstChild.textContent,
    );

    expect(displayedAnecdotes).toEqual([
      "Anecdote with most votes",
      "Anecdote with some votes",
      "Anecdote with few votes",
    ]);
  });

  it("displays only anecdotes matching the filter", () => {
    useAnecdoteStore.setState({ filter: "some" });

    render(<AnecdoteList />);

    expect(screen.getByText("Anecdote with some votes")).toBeTruthy();
    expect(screen.queryByText("Anecdote with few votes")).toBeNull();
    expect(screen.queryByText("Anecdote with most votes")).toBeNull();
  });

  it("increases the number of votes when the vote button is clicked", async () => {
    const voteAnecdote = vi.fn();

    useAnecdoteStore.setState({
      anecdotes: [{ id: "1", content: "Test anecdote", votes: 2 }],
      filter: "",
      voteAnecdote: async (id) => {
        voteAnecdote(id);

        useAnecdoteStore.setState((state) => ({
          anecdotes: state.anecdotes.map((anecdote) =>
            anecdote.id === id
              ? { ...anecdote, votes: anecdote.votes + 1 }
              : anecdote,
          ),
        }));
      },
    });

    render(<AnecdoteList />);

    expect(screen.getByText("has 2")).toBeTruthy();

    fireEvent.click(screen.getByText("vote"));

    expect(await screen.findByText("has 3")).toBeTruthy();
    expect(voteAnecdote).toHaveBeenCalledWith("1");
  });
});
