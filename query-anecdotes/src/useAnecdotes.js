import { useQuery } from "@tanstack/react-query";
import anecdoteService from "./services";

export const useAnecdotes = () => {
  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: anecdoteService.getAnecdotes,
    retry: false,
  });

  return result;
};
