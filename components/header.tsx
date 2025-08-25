"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BellIcon,
  GlobeIcon,
  HelpCircleIcon,
  MoreHorizontalIcon,
  SettingsIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api-service";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const getBalance = async () => {
      const response = await apiService.getAccount();
      setBalance(
        Number(
          typeof response.balances[0] === "object"
            ? response.balances[0]?.available
            : response.balances[0] || 0
        )
      );
    };
    getBalance();
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-foreground">DEMO</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Balance */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background">
            <span className="text-sm font-medium">
              {balance.toFixed(2)} {t("balance")}
            </span>
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={`Switch to ${language === "vi" ? "English" : "Tiếng Việt"}`}
          >
            <GlobeIcon className="h-4 w-4" />
            <span className="ml-1 text-xs font-medium">
              {language.toUpperCase()}
            </span>
          </Button>
          <Button variant="ghost" size="icon">
            <HelpCircleIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <SettingsIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
