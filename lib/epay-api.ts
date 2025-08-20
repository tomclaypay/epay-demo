class EpayAPI {
  private baseUrl = process.env.NEXT_PUBLIC_EPAY_API_URL;

  // Deposit APIs
  async createDeposit(data: { mt5Id: string; amount: number; ref: string }) {
    const response = await fetch(`${this.baseUrl}/deposits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_EPAY_API_KEY || "",
      },
      body: JSON.stringify({
        ...data,
        callback: process.env.NEXT_PUBLIC_CALLBACK_URL, // Replace with your callback URL
      }),
    });
    console.log("response", response);
    if (!response.ok) throw new Error("Failed to create deposit");
    return response.json();
  }

  // Withdraw APIs
  async createWithdraw(data: {
    bankNameDest: string;
    bankAccountNumberDest: string;
    bankAccountNameDest: string;
    amount: number;
    ref: string;
    mt5Id: string;
  }) {
    const response = await fetch(`${this.baseUrl}/withdrawals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_EPAY_API_KEY || "",
      },
      body: JSON.stringify({
        ...data,
        callback: process.env.NEXT_PUBLIC_CALLBACK_URL, // Replace with your callback URL
      }),
    });
    if (!response.ok) throw new Error("Failed to create withdraw");
    return response.json();
  }

  //Get wallet address
  async getWalletAddress(data: {
    chainName: string;
    customerId: string;
    mt5Id: string;
  }) {
    const response = await fetch(`${this.baseUrl}/wallets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_EPAY_API_KEY || "",
      },
      body: JSON.stringify({
        ...data,
        callback: process.env.NEXT_PUBLIC_CALLBACK_URL, // Replace with your callback URL
      }),
    });
    if (!response.ok) throw new Error("Failed to fetch wallet address");
    return response.json();
  }
  // Withdrawal crypto
  async createWithdrawalCrypto(data: {
    customerId: string;
    chainName: string;
    mt5Id: string;
    ref: string;
    usdAmount: number;
    toAddress: string;
  }) {
    const response = await fetch(`${this.baseUrl}/withdrawals/crypto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_EPAY_API_KEY || "",
      },
      body: JSON.stringify({
        ...data,
        callback: process.env.NEXT_PUBLIC_CALLBACK_URL, // Replace with your callback URL
      }),
    });
    if (!response.ok) throw new Error("Failed to create withdraw");
    return response.json();
  }

  //Get bank withdrawal
  async getBankWithdrawal() {
    const response = await fetch(`${this.baseUrl}/bank-withdrawals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.NEXT_PUBLIC_EPAY_API_KEY || "",
      },
    });
    if (!response.ok) throw new Error("Failed to fetch bank withdrawal");
    return response.json();
  }
}

export { EpayAPI };
export const epayAPI = new EpayAPI();
