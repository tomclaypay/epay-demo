"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CopyIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Transaction {
  transactionId: string;
  method: string;
  mt5ID?: string;
  currency: string;
  amount: number;
  fee?: number;
  status: "pending" | "completed" | "failed";
  type: "deposit" | "withdraw";
  createdAt: string;
  estimatedCompletion?: string;
  hashId?: string;
  depositAddress?: string;
  ref: string;
  errorMessage?: string;
}

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const { t } = useLanguage();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircleIcon className="h-4 w-4 text-red-600" />;
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "success":
        return "default" as const;
      case "failed":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "success":
        return t("completed");
      case "failed":
        return t("failed");
      default:
        return t("pending");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast(t("copySuccess"));
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-full ${
                transaction.type === "deposit"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {transaction.type === "deposit" ? (
                <ArrowDownIcon className="h-4 w-4" />
              ) : (
                <ArrowUpIcon className="h-4 w-4" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {transaction.type === "deposit"
                    ? t("deposit")
                    : t("withdraw")}
                </span>
                <Badge variant={getStatusVariant(transaction.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(transaction.status)}
                    {getStatusText(transaction.status)}
                  </div>
                </Badge>
              </div>

              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">ID:</span>
                  <span className="font-mono text-xs">
                    {transaction.transactionId}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => copyToClipboard(transaction.transactionId)}
                  >
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                </div>

                <div>
                  <span className="font-medium">{t("method")}:</span>{" "}
                  {transaction.method}
                </div>

                {transaction.mt5ID && (
                  <div>
                    <span className="font-medium">MT5 ID:</span>{" "}
                    {transaction.mt5ID}
                  </div>
                )}

                <div>
                  <span className="font-medium">{t("reference")}:</span>{" "}
                  {transaction.ref}
                </div>

                {transaction.depositAddress && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("address")}:</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">
                      {transaction.depositAddress}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() =>
                        copyToClipboard(transaction.depositAddress!)
                      }
                    >
                      <CopyIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                {transaction.hashId && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{t("paymentLink")}:</span>
                    <span
                      className="font-mono text-xs truncate max-w-[200px] cursor-pointer"
                      onClick={() =>
                        window.open(
                          process.env.NEXT_PUBLIC_PAYMENT_URL +
                            transaction.hashId
                        )
                      }
                    >
                      {process.env.NEXT_PUBLIC_PAYMENT_URL}
                      {transaction.hashId}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0"
                      onClick={() =>
                        copyToClipboard(
                          process.env.NEXT_PUBLIC_PAYMENT_URL +
                            transaction.hashId!
                        )
                      }
                    >
                      <CopyIcon className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <div>
                  <span className="font-medium">{t("created")}:</span>{" "}
                  {formatDateTime(transaction.createdAt)}
                </div>

                {transaction.estimatedCompletion &&
                  transaction.status === "pending" && (
                    <div>
                      <span className="font-medium">{t("estimated")}:</span>{" "}
                      {formatDateTime(transaction.estimatedCompletion)}
                    </div>
                  )}

                {transaction.errorMessage &&
                  transaction.status === "failed" && (
                    <div className="text-red-600">
                      <span className="font-medium">{t("error")}:</span>{" "}
                      {transaction.errorMessage}
                    </div>
                  )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div
              className={`text-lg font-bold ${
                transaction.type === "deposit"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "deposit" ? "+" : "-"}
              {transaction.amount.toLocaleString()} {transaction.currency}
            </div>

            {transaction.fee && transaction.fee > 0 && (
              <div className="text-sm text-muted-foreground">
                {t("fee")}: {transaction.fee.toLocaleString()}{" "}
                {transaction.currency}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
