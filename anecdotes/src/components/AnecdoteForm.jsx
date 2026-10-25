import { useAnecdoteActions } from "../store";
import { useNotificationStore } from "../notificationStore";

const AnecdoteForm = () => {
  const { createAnecdote } = useAnecdoteActions();

  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );

  const create = async (event) => {
    event.preventDefault();

    const content = event.target.anecdote.value.trim();

    if (!content) return;

    try {
      await createAnecdote(content);

      setNotification(`New anecdote: "${content}"`);

      event.target.reset();
    } catch (error) {
      console.error("Failed to create anecdote:", error);
    }
  };

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={create}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
