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
import { apiService } from "@/lib/api-service";
import { epayAPI } from "@/lib/epay-api";

export default function DepositPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedCrypto, setSelectedCrypto] = useState("TRON");
  const [amount, setAmount] = useState("");
  const [actualAmount, setActualAmount] = useState("");
  const [img, setImg] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  const depositOptions = [
    {
      id: "vietqr",
      name: t("vietqrBank"),
      icon: CreditCardIcon,
      description: t("depositViaBankTransfer"),
      processingTime: `${t("instant")} - 15 ${t("minutes")}`,
      fee: t("free"),
      limits: "10 - 11,000 USD",
    },
    {
      id: "crypto",
      name: t("crypto"),
      icon: CoinsIcon,
      description: t("depositViaCrypto"),
      processingTime: `5 - 30 ${t("minutes")}`,
      fee: t("free"),
      limits: "10 - 200,000 USD",
    },
  ];

  const cryptoOptions = [
    { value: "BSC", label: "BNB Smart Chain (BEP20)" },
    { value: "TRON", label: "Tron (TRC20)" },
    { value: "ETHEREUM", label: "Ethereum (ERC20)" },
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleBack = () => {
    setSelectedOption(null);
    setAmount("");
    setSelectedCrypto("");
  };

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      if (selectedOption === "vietqr") {
        const response = await apiService.createDeposit({
          method: selectedOption || "vietqr",
          amount: Number(amount),
        });
        window.open(
          process.env.NEXT_PUBLIC_PAYMENT_URL + response.hashId,
          "_blank",
          "noreferrer"
        );
        setSelectedOption(null);
      } else {
        const data = await epayAPI.getWalletAddress({
          chainName: selectedCrypto,
          customerId: "1",
          mt5Id: "1",
        });
        setWalletAddress(data.address);
        const res = await fetch("/api/qr", {
          method: "POST",
          body: JSON.stringify({ text: data.address, size: 300 }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          alert("Generate QR failed");
          return;
        }
        const blob = await res.blob();
        setImg(URL.createObjectURL(blob));
      }
      setIsLoading(false);
      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const renderDepositForm = () => {
    const option = depositOptions.find((opt) => opt.id === selectedOption);
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
            <CardTitle>{t("depositInfo")}</CardTitle>
            <CardDescription>
              {t("processingTime")}: {option.processingTime} • {t("fee")}:{" "}
              {option.fee} • {t("limits")}: {option.limits}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedOption === "crypto" && (
              <div className="space-y-2">
                <Label htmlFor="crypto-select">{t("network")}</Label>
                <Select
                  value={selectedCrypto}
                  onValueChange={setSelectedCrypto}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectNetwork")} />
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
            {selectedOption === "vietqr" && (
              <div className="space-y-2">
                <Label htmlFor="amount">{t("amount")}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder={t("enterVNDAmount")}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    const actualAmount = Number(e.target.value) / 23000;
                    setActualAmount(actualAmount.toFixed(2));
                  }}
                />
              </div>
            )}

            {selectedOption === "vietqr" && (
              <div className="space-y-2">
                <Label htmlFor="actualAmount">{t("usdAmount")} </Label>
                <Input
                  id="actualAmount"
                  type="number"
                  value={actualAmount}
                  disabled
                />
              </div>
            )}

            {/* {selectedOption === "vietqr" && (
              <div className="space-y-2">
                <Label htmlFor="bank">{t("bankName")}</Label>
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
            )} */}

            <Button
              disabled={isLoading}
              className="w-full"
              size="lg"
              onClick={onSubmit}
            >
              {t("submit")}
            </Button>
          </CardContent>
        </Card>
        {selectedOption === "crypto" && (
          <Card>
            <CardHeader>
              <CardTitle>{t("depositWalletAddress")}</CardTitle>
              <CardDescription>
                {t("depositWalletAddressDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {img && (
                <div className="flex flex-col items-center justify-center">
                  <img src={img} alt="qr" width={300} height={300} />
                  <p className="text-center">
                    {t("walletAddress")}: {walletAddress}
                  </p>
                  <a href={img} download="qr.png">
                    Tải ảnh QR
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        )}
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
                <h1 className="text-2xl font-bold mb-2">{t("depositTitle")}</h1>
                <p className="text-muted-foreground">
                  {t("selectPaymentMethod")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {depositOptions.map((option) => (
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
                          <span className="text-green-600">{option.fee}</span>
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
            renderDepositForm()
          )}
        </main>
      </div>
    </div>
  );
}
