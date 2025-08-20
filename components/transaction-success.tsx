"use client";

import {
  CheckCircle,
  Copy,
  ArrowLeft,
  History,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

interface TransactionSuccessProps {
  type: "deposit" | "withdraw";
  amount: number;
  currency: string;
  method: string;
  estimatedCompletion?: string;
  onBack?: () => void;
  onViewHistory?: () => void;
}

export function TransactionSuccess({
  type,
  amount,
  currency,
  method,
  estimatedCompletion,
  onBack,
  onViewHistory,
}: TransactionSuccessProps) {
  const { t } = useLanguage();

  const getMethodDisplay = (method: string) => {
    switch (method) {
      case "vietqr":
        return "VietQR Bank";
      case "crypto":
        return "Cryptocurrency";
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {type === "deposit" ? t("depositSuccess") : t("withdrawSuccess")}
            </h1>
            <p className="text-gray-600">
              {type === "deposit"
                ? t("depositSuccessMessage")
                : t("withdrawSuccessMessage")}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            {amount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t("amount")}:</span>
                <span className="font-semibold text-lg">
                  {type === "withdraw" ? "-" : "+"}
                  {amount} {currency}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("method")}:</span>
              <span className="font-medium">{getMethodDisplay(method)}</span>
            </div>

            {estimatedCompletion && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  {t("estimatedCompletion")}:
                </span>
                <span className="font-medium">1 - 3 {t("workingDays")}</span>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              {type === "deposit"
                ? t("depositProcessingNote")
                : t("withdrawProcessingNote")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onViewHistory}
              className="w-full"
              variant="default"
            >
              <History className="w-4 h-4 mr-2" />
              {t("viewTransactionHistory")}
            </Button>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {type === "deposit" ? t("backToDeposit") : t("backToWithdraw")}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">{t("needHelp")}</p>
            <Button variant="link" size="sm" className="text-xs">
              <ExternalLink className="w-3 h-3 mr-1" />
              {t("contactSupport")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
