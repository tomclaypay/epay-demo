"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import {
  UserIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  WalletIcon,
  TrendingUpIcon,
  BarChart3Icon,
  CopyIcon,
  HeadphonesIcon,
  UserPlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";

export function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

  const menuItems = [
    {
      id: "account",
      label: t("myAccount"),
      icon: UserIcon,
      href: "/account",
    },
    {
      id: "deposit",
      label: t("deposit"),
      icon: ArrowDownIcon,
      href: "/deposit",
    },
    {
      id: "withdraw",
      label: t("withdraw"),
      icon: ArrowUpIcon,
      href: "/withdraw",
    },
    {
      id: "history",
      label: t("transactionHistory"),
      icon: ClockIcon,
      href: "/history",
    },
    {
      id: "wallet",
      label: t("digitalWallet"),
      icon: WalletIcon,
      href: "/wallet",
    },
    {
      id: "analytics",
      label: t("analytics"),
      icon: BarChart3Icon,
      href: "/analytics",
      hasDropdown: true,
    },
    {
      id: "copy-trading",
      label: t("copyTrading"),
      icon: CopyIcon,
      href: "/copy-trading",
    },
    {
      id: "performance",
      label: t("performance"),
      icon: TrendingUpIcon,
      href: "/performance",
      hasDropdown: true,
    },
    {
      id: "support",
      label: t("supportCenter"),
      icon: HeadphonesIcon,
      href: "/support",
      // badge: "New",
    },
    // {
    //   id: "referral",
    //   label: t("inviteFriends"),
    //   icon: UserPlusIcon,
    //   href: "/referral",
    // },
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleItemClick = (item: any) => {
    if (item.hasDropdown) {
      toggleExpanded(item.id);
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <div className="w-64 bg-background border-r border-border h-screen flex flex-col">
      {/* Collapse button */}
      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Menu items */}
      <div className="flex-1 py-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-3 h-auto text-left font-normal ${
                pathname === item.href
                  ? "bg-primary/10 text-primary border-r-2 border-primary"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={() => handleItemClick(item)}
            >
              <item.icon className="h-4 w-4 mr-3 shrink-0" />
              <span className="flex-1 text-sm">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {item.badge}
                </Badge>
              )}
              {item.hasDropdown && (
                <ChevronDownIcon
                  className={`h-4 w-4 ml-2 transition-transform ${
                    expandedItems.includes(item.id) ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>

            {/* Dropdown content */}
            {item.hasDropdown && expandedItems.includes(item.id) && (
              <div className="ml-8 py-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-muted-foreground"
                >
                  Báo cáo chi tiết
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm text-muted-foreground"
                >
                  Thống kê giao dịch
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
