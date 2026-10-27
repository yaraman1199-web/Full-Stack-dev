const baseUrl = "http://localhost:3001/anecdotes";

const getAnecdotes = async () => {
  const response = await fetch(baseUrl);

  if (!response.ok) {
    throw new Error("Failed to fetch anecdotes");
  }

  return response.json();
};

const createAnecdote = async (newObject) => {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...newObject,
      votes: 0,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data.error || data.message || "Failed to create anecdote",
    );
  }

  return data;
};

const updateAnecdote = async (anecdote) => {
  const updatedAnecdote = {
    ...anecdote,
    votes: anecdote.votes + 1,
  };

  const response = await fetch(`${baseUrl}/${anecdote.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedAnecdote),
  });

  if (!response.ok) {
    throw new Error("Failed to update anecdote");
  }

  return response.json();
};

export default {
  getAnecdotes,
  createAnecdote,
  updateAnecdote,
};
