// hooks/use-newsletters.ts
import useSWR from "swr";
import { fetcher } from "@/lib/swr";

interface Newsletter {
  id: string;
  eventName: string;
  description: string;
  place: string;
  date: string;
  time: string;
  contactEmail: string;
  tags: string[];
  image: string;
  status: "published" | "draft";
  createdAt: string;
  updatedAt: string;
}

export function useNewsletters(limit?: number) {
  const url = limit ? `/api/newsletters?limit=${limit}` : "/api/newsletters";
  
  const { data, error, isLoading, mutate } = useSWR<{
    success: boolean;
    data: Newsletter[];
    message: string;
  }>(url, fetcher);

  return {
    newsletters: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
