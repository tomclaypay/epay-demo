"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionSuccess } from "@/components/transaction-success";

interface TransactionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  onViewHistory?: () => void;
  transaction: {
    transactionId: string;
    type: "deposit" | "withdraw";
    method: string;
    amount: number;
    currency: string;
    estimatedCompletion?: string;
    fee?: number;
  } | null;
}

export function TransactionSuccessModal({
  isOpen,
  onClose,
  transaction,
  onBack,
  onViewHistory,
}: TransactionSuccessModalProps) {
  if (!transaction) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {transaction.type === "deposit"
              ? "Deposit Successful"
              : "Withdrawal Successful"}
          </DialogTitle>
        </DialogHeader>
        <TransactionSuccess
          amount={transaction.amount}
          method={transaction.method}
          currency="USD"
          type={transaction.type}
          onClose={onClose}
          onBack={onBack}
          onViewHistory={onViewHistory}
        />
      </DialogContent>
    </Dialog>
  );
}
