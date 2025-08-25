export interface Account {
  id: string;
  email: string;
  name: string;
  balances: {
    [currency: string]: number;
  };
  verified: boolean;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: "fiat" | "crypto";
  currency: string;
  icon: string;
  processingTime: string;
  fee: string;
  limits: {
    min: number;
    max: number;
  };
  available: boolean;
}

export interface Transaction {
  id: string;
  type: "deposit" | "withdraw";
  method: string;
  currency: string;
  amount: number;
  fee: number;
  status: "pending" | "completed" | "failed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  details?: any;
}

export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

class ApiService {
  private baseUrl = "/api";

  // Account APIs
  async getAccount(): Promise<Account> {
    const response = await fetch(`${this.baseUrl}/account`);
    if (!response.ok) throw new Error("Failed to fetch account");
    return response.json();
  }

  // Payment Methods APIs
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await fetch(`${this.baseUrl}/payment-methods`);
    if (!response.ok) throw new Error("Failed to fetch payment methods");
    return response.json();
  }

  // Deposit APIs
  async createDeposit(data: {
    amount: number;
    method: string;
    walletAddress?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to create deposit");
    return response.json();
  }

  // Withdraw APIs
  async createWithdraw(data: {
    method: string;
    amount: number;
    bankNameDest?: string;
    bankAccountNumberDest?: string;
    bankAccountNameDest?: string;
    walletAddress?: string;
    chainName?: string;
  }) {
    const response = await fetch(`${this.baseUrl}/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("response", response);
    if (!response.ok) throw new Error("Failed to create withdraw");
    return response.json();
  }

  // Transaction APIs
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: "deposit" | "withdraw";
    search?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page)
      searchParams.append("offset", (params.page - 1).toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.type) searchParams.append("type", params.type);
    if (params?.status) searchParams.append("status", params.status);
    if (params?.search) searchParams.append("search", params.search);

    const response = await fetch(
      `${this.baseUrl}/transactions?${searchParams}`
    );
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  }

  // Exchange Rate APIs
  async getExchangeRates(): Promise<ExchangeRate[]> {
    const response = await fetch(`${this.baseUrl}/exchange-rates`);
    if (!response.ok) throw new Error("Failed to fetch exchange rates");
    return response.json();
  }

  async getExchangeRate(from: string, to: string): Promise<ExchangeRate> {
    const response = await fetch(
      `${this.baseUrl}/exchange-rates?from=${from}&to=${to}`
    );
    if (!response.ok) throw new Error("Failed to fetch exchange rate");
    return response.json();
  }
}

export { ApiService };
export const apiService = new ApiService();
