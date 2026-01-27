import { useQuery } from "@tanstack/react-query";

export interface CompanyInfo {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    introduce: string;
    website: string;
    behance: string;
    facebook: string;
    artstation: string;
    linkedin: string;
}

interface NocoDBResponse {
    list: Array<{
        Id: number;
        Name: string;
        Phone: string;
        Email: string;
        Address: string;
        Introduce: string;
        Website: string;
        Behance: string;
        Facebook: string;
        Artstation: string;
        LinkedIn: string;
        Linkedin: string;
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
const TABLE_ID = import.meta.env.VITE_NOCODB_COMPANY_INFO_TABLE_ID || "m6kww8gls7yguss";
const API_TOKEN = import.meta.env.VITE_NOCODB_API_TOKEN || "";

async function fetchCompanyInfo(): Promise<CompanyInfo | null> {
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
        throw new Error("Failed to fetch company info");
    }

    const data: NocoDBResponse = await response.json();

    if (data.list.length === 0) {
        return null;
    }

    const item = data.list[0];
    return {
        id: String(item.Id),
        name: item.Name || "",
        phone: item.Phone || "",
        email: item.Email || "",
        address: item.Address || "",
        introduce: item.Introduce || "",
        website: item.Website || "",
        behance: item.Behance || "",
        facebook: item.Facebook || "",
        artstation: item.Artstation || "",
        linkedin: item.Linkedin || "",
    };
}

export function useCompanyInfo() {
    return useQuery({
        queryKey: ["company-info"],
        queryFn: fetchCompanyInfo,
        staleTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
    });
}
