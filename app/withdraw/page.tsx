"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeftIcon, CreditCardIcon, CoinsIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Sidebar } from "@/components/sidebar";
import { useLanguage } from "@/contexts/language-context";

export default function WithdrawPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const { t } = useLanguage();

  const withdrawOptions = [
    {
      id: "vietqr",
      name: "VietQR Bank",
      icon: CreditCardIcon,
      description: t("withdrawViaBankTransfer"),
      processingTime: "1 - 3 " + t("workingDays"),
      fee: "1%",
      limits: "50 - 50,000 USD",
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: CoinsIcon,
      description: t("withdrawViaCrypto"),
      processingTime: "10 - 60 " + t("minutes"),
      fee: "Network fee",
      limits: "20 - 100,000 USD",
    },
  ];

  const cryptoOptions = [
    { value: "USDT", label: "USDT (TRC20)" },
    { value: "BTC", label: "Bitcoin (BTC)" },
    { value: "ETH", label: "Ethereum (ETH)" },
    { value: "BNB", label: "BNB (BSC)" },
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleBack = () => {
    setSelectedOption(null);
    setAmount("");
    setSelectedCrypto("");
    setAddress("");
  };

  const renderWithdrawForm = () => {
    const option = withdrawOptions.find((opt) => opt.id === selectedOption);
    if (!option) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {t("backToOptions")}
          </Button>
          <div className="flex items-center gap-3">
            <option.icon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">{option.name}</h2>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("withdrawInfo")}</CardTitle>
            <CardDescription>
              {t("processingTime")}: {option.processingTime} • {t("fee")}:{" "}
              {option.fee} • {t("limits")}: {option.limits}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedOption === "crypto" && (
              <div className="space-y-2">
                <Label htmlFor="crypto-select">Chọn loại cryptocurrency</Label>
                <Select
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {cryptoOptions.map((crypto) => (
                      <SelectItem key={crypto.value} value={crypto.value}>
                        {crypto.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">{t("withdrawAmount")}</Label>
              <Input
                id="amount"
                type="number"
                placeholder={
                  selectedOption === "crypto"
                    ? t("enterCryptoAmount")
                    : t("enterVNDAmount")
                }
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {selectedOption === "crypto" ? (
              <div className="space-y-2">
                <Label htmlFor="address">{t("walletAddress")}</Label>
                <Input
                  id="address"
                  placeholder={t("enterCryptoAddress")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="bank">{t("bank")}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectBank")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vietcombank">Vietcombank</SelectItem>
                      <SelectItem value="techcombank">Techcombank</SelectItem>
                      <SelectItem value="bidv">BIDV</SelectItem>
                      <SelectItem value="mbbank">MB Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-number">{t("bankAccount")}</Label>
                  <Input
                    id="account-number"
                    placeholder={t("enterBankAccount")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account-name">{t("accountHolder")}</Label>
                  <Input
                    id="account-name"
                    placeholder={t("enterAccountHolder")}
                  />
                </div>
              </>
            )}

            <Button className="w-full" size="lg">
              {t("confirmWithdraw")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          {!selectedOption ? (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  {t("withdrawTitle")}
                </h1>
                <p className="text-muted-foreground">
                  {t("selectWithdrawMethod")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {withdrawOptions.map((option) => (
                  <Card
                    key={option.id}
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <option.icon className="h-8 w-8 text-primary" />
                        <div>
                          <CardTitle className="text-lg">
                            {option.name}
                          </CardTitle>
                          <CardDescription>
                            {option.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("processingTime")}:
                          </span>
                          <span>{option.processingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("fee")}:
                          </span>
                          <span className="text-orange-600">{option.fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {t("limits")}:
                          </span>
                          <span>{option.limits}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            renderWithdrawForm()
          )}
        </main>
      </div>
    </div>
  );
}
