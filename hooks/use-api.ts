"use client";

import { useState, useEffect } from "react";
import { apiService, type Transaction } from "@/lib/api-service";

export function useTransactions(params?: {
  page?: number;
  limit?: number;
  type?: "deposit" | "withdraw";
  status?: string;
}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTransactions(params);
        setTransactions(data.transactions);
        setPagination({
          total: data.total,
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          limit: data.limit,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [JSON.stringify(params)]);

  return { transactions, pagination, loading, error };
}
