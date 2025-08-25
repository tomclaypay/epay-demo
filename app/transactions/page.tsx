"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useLanguage } from "@/contexts/language-context";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ActivityIcon,
  DollarSignIcon,
} from "lucide-react";
import { useTransactions } from "@/hooks/use-api";
import { TransactionCard } from "@/components/transaction-card";

export default function TransactionsPage() {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useLanguage();

  const transactionParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      type: filter === "all" ? undefined : (filter as "deposit" | "withdraw"),
      search: searchTerm,
    }),
    [currentPage, filter]
  );

  const { transactions, loading, pagination, stats } =
    useTransactions(transactionParams);

  const filterOptions = [
    { value: "all", label: t("allTransactions") },
    { value: "deposit", label: t("deposits") },
    { value: "withdraw", label: t("withdrawals") },
  ];

  const filteredTransactions =
    transactions?.filter(
      (transaction) =>
        transaction.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {t("transactionHistory")}
              </h1>
              <p className="text-muted-foreground">
                {t("viewAllTransactions")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("totalDeposits")}
                  </CardTitle>
                  <TrendingUpIcon className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.totalDeposits.toLocaleString()} USD
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.depositCount} {t("transactions")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("totalWithdrawals")}
                  </CardTitle>
                  <TrendingDownIcon className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {stats?.totalWithdrawals.toLocaleString()} USD
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.withdrawalCount} {t("transactions")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("netBalance")}
                  </CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {(
                      stats?.totalDeposits - stats?.totalWithdrawals
                    ).toLocaleString()}{" "}
                    USD
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("difference")}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("totalTransactions")}
                  </CardTitle>
                  <ActivityIcon className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats?.depositCount + stats?.withdrawalCount}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t("allTime")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t("searchTransactions")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={filter} onValueChange={setFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">
                      {t("loadingTransactions")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}

                  {filteredTransactions.length === 0 && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                          {t("noTransactionsFound")}
                        </h3>
                        <p className="text-muted-foreground">
                          {searchTerm
                            ? t("tryDifferentSearch")
                            : t("noTransactionsYet")}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                          {t("showing")} {(currentPage - 1) * 10 + 1} -{" "}
                          {Math.min(currentPage * 10, pagination.total)}{" "}
                          {t("of")} {pagination.total} {t("transactions")}
                        </p>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeftIcon className="h-4 w-4" />
                            {t("previous")}
                          </Button>

                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: Math.min(5, pagination.totalPages) },
                              (_, i) => {
                                const page = i + 1;
                                return (
                                  <Button
                                    key={page}
                                    variant={
                                      currentPage === page
                                        ? "default"
                                        : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-8 h-8 p-0"
                                  >
                                    {page}
                                  </Button>
                                );
                              }
                            )}
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(pagination.totalPages, prev + 1)
                              )
                            }
                            disabled={currentPage === pagination.totalPages}
                          >
                            {t("next")}
                            <ChevronRightIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
