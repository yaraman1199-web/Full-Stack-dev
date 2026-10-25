import { useAnecdotes, useAnecdoteActions, useFilter } from "../store";
import { useNotificationStore } from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const filter = useFilter();

  const { voteAnecdote, deleteAnecdote } = useAnecdoteActions();

  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );

  const vote = async (anecdote) => {
    try {
      await voteAnecdote(anecdote.id);
      setNotification(`you voted '${anecdote.content}'`);
    } catch (error) {
      console.error(error);
    }
  };

  const remove = async (anecdote) => {
    try {
      await deleteAnecdote(anecdote.id);
      setNotification(`Deleted: "${anecdote.content}"`);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <div>
      {filteredAnecdotes
        .toSorted((first, second) => second.votes - first.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
              {anecdote.votes === 0 && (
                <button onClick={() => remove(anecdote)}>delete</button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
