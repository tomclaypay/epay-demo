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
  const [stats, setStats] = useState<{
    totalDeposits: number;
    totalWithdrawals: number;
    netBalance: number;
    depositCount: number;
    withdrawalCount: number;
  } | null>({
    totalDeposits: 0,
    totalWithdrawals: 0,
    netBalance: 0,
    depositCount: 0,
    withdrawalCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTransactions(params);
        setTransactions(data.transactions);
        setPagination({
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
          currentPage: data.pagination.offset + 1,
          limit: data.pagination.limit,
        });
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [JSON.stringify(params)]);

  return { transactions, pagination, loading, error, stats };
}
