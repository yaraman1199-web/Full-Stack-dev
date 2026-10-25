import { useEffect } from "react";
import AnecdoteForm from "./components/AnecdoteForm";
import AnecdoteList from "./components/AnecdoteList";
import Filter from "./Filter";
import { useAnecdoteActions } from "./store";
import Notification from "./components/Notification";

const App = () => {
  const { initializeAnecdotes } = useAnecdoteActions();

  useEffect(() => {
    initializeAnecdotes();
  }, [initializeAnecdotes]);

  return (
    <div>
      <Filter />
      <h2>Anecdotes</h2>
      <Notification />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
