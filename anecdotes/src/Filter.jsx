import { useFilter, useAnecdoteActions } from "./store";

const Filter = () => {
  const filter = useFilter();
  const { setFilter } = useAnecdoteActions();

  return (
    <div>
      filter{" "}
      <input
        data-testid="filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};

export default Filter;
