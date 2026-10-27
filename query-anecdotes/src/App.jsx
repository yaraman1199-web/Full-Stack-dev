import { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import anecdoteService from "./services";
import { useAnecdotes } from "./useAnecdotes";
import Notification from "./components/Notification";
import { useNotify } from "./NotificationContext";

const App = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const { notify } = useNotify();
  const result = useAnecdotes();

  const createAnecdoteMutation = useMutation({
    mutationFn: anecdoteService.createAnecdote,

    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`A new anecdote "${newAnecdote.content}" created!`);
    },

    onError: (error) => {
      notify(error.message);
    },
  });

  const voteMutation = useMutation({
    mutationFn: anecdoteService.updateAnecdote,

    onSuccess: (updatedAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ["anecdotes"] });
      notify(`You voted for "${updatedAnecdote.content}"`);
    },

    onError: (error) => {
      notify(error.message);
    },
  });

  const addAnecdote = (event) => {
    event.preventDefault();

    createAnecdoteMutation.mutate(
      { content },
      {
        onSuccess: () => {
          setContent("");
        },
      },
    );
  };

  if (result.isPending) {
    return <div>Loading...</div>;
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>;
  }

  const anecdotes = result.data;

  return (
    <div>
      <h1>Anecdote app</h1>

      <Notification />

      <h2>Create new</h2>

      <form onSubmit={addAnecdote}>
        <input
          name="anecdote"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <button type="submit">create</button>
      </form>

      <h2>Anecdotes</h2>

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>

          <div>has {anecdote.votes} votes</div>

          <button onClick={() => voteMutation.mutate(anecdote)}>vote</button>
        </div>
      ))}
    </div>
  );
};

export default App;
