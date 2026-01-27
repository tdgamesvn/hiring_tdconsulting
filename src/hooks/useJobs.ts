import { useQuery } from "@tanstack/react-query";

export interface Job {
  id: string;
  job_tittle: string;
  description: string;
}

interface NocoDBResponse {
  list: Array<{
    Id: number;
    job_tittle: string;
    description: string;
  }>;
  pageInfo: {
    totalRows: number;
    page: number;
    pageSize: number;
    isFirstPage: boolean;
    isLastPage: boolean;
  };
}

const NOCODB_URL = import.meta.env.VITE_NOCODB_URL || "https://nocodb.tdconsulting.vn";
const TABLE_ID = import.meta.env.VITE_NOCODB_TABLE_ID || "mh36y68rb3lserw";
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN || "";

async function fetchJobs(): Promise<Job[]> {
  const response = await fetch(
    `${NOCODB_URL}/api/v2/tables/${TABLE_ID}/records`,
    {
      headers: {
        "xc-token": API_TOKEN,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }

  const data: NocoDBResponse = await response.json();

  return data.list.map((item) => ({
    id: String(item.Id),
    job_tittle: item.job_tittle,
    description: item.description || "",
  }));
}

export function useJobs() {
  return useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}
