export const translations = {
  vi: {
    // Header
    balance: "USD",

    // Sidebar
    myAccount: "Tài khoản của tôi",
    deposit: "Nạp tiền",
    withdraw: "Rút tiền",
    transactionHistory: "Lịch sử giao dịch",
    digitalWallet: "Ví tiền ký thuật số",
    analytics: "Phân tích",
    copyTrading: "Sao chép giao dịch",
    performance: "Hiệu suất",
    supportCenter: "Trung tâm Hỗ trợ Khách hàng",
    inviteFriends: "Mời bạn bè tham gia và kiếm thu nhập",

    // Deposit/Withdraw
    depositTitle: "Nạp Tiền",
    withdrawTitle: "Rút Tiền",
    selectPaymentMethod: "Chọn phương thức thanh toán",
    vietqrBank: "VietQR Bank",
    crypto: "Crypto",
    backToOptions: "Quay lại",
    depositInfo: "Thông tin nạp tiền",
    selectCrypto: "Chọn mang lưới",
    enterCryptoAmount: "Nhập số lượng",
    enterVNDAmount: "Nhập số tiền",
    selectBank: "Chọn ngân hàng",
    depositViaBankTransfer: "Nạp tiền vào tài khoản qua ngân hàng",
    depositViaCrypto: "Nạp tiền qua cryptocurrency",

    withdrawViaBankTransfer: "Rút tiền về tài khoản ngân hàng",
    withdrawViaCrypto: "Rút tiền qua cryptocurrency",
    withdrawInfo: "Thông tin rút tiền",
    withdrawAmount: "Số tiền rút",
    enterCryptoAddress: "Nhập địa chỉ ví crypto",
    bank: "Ngân hàng",
    enterBankAccount: "Nhập số tài khoản ngân hàng",
    enterAccountHolder: "Nhập tên chủ tài khoản",
    confirmWithdraw: "Xác nhận rút tiền",
    selectWithdrawMethod: "Chọn phương thức rút tiền phù hợp",
    usdAmount: "Số tiền USD",
    depositWalletAddress: "Địa chỉ ví nạp tiền",
    depositWalletAddressDescription:
      "Vui lòng nạp đúng mạng lưới đã chọn, nếu nạp sai mạng lưới sẽ bị mất",
    // Forms
    selectNetwork: "Chọn mạng lưới",
    amount: "Số tiền",
    bankAccount: "Số tài khoản ngân hàng",
    bankName: "Tên ngân hàng",
    accountHolder: "Tên chủ tài khoản",
    walletAddress: "Địa chỉ ví",
    network: "Mạng lưới",
    submit: "Xác nhận",

    // Payment methods
    processingTime: "Thời gian xử lý",
    fee: "Phí giao dịch",
    limits: "Hạn mức",
    instant: "Tức thời",
    minutes: "phút",
    free: "Miễn phí",
    workingDays: "ngày làm việc",

    // Messages
    redirecting: "Đang chuyển hướng đến trang nạp tiền...",
  },
  en: {
    // Header
    balance: "USD",

    // Sidebar
    myAccount: "My Account",
    deposit: "Deposit",
    withdraw: "Withdraw",
    transactionHistory: "Transaction History",
    digitalWallet: "Digital Wallet",
    analytics: "Analytics",
    copyTrading: "Copy Trading",
    performance: "Performance",
    supportCenter: "Customer Support Center",
    inviteFriends: "Invite Friends and Earn",

    // Deposit/Withdraw
    depositTitle: "Deposit",
    withdrawTitle: "Withdraw",
    selectPaymentMethod: "Select payment method",
    vietqrBank: "VietQR Bank",
    crypto: "Crypto",
    backToOptions: "Back to options",
    depositInfo: "Deposit info",
    selectCrypto: "Select cryptocurrency",
    enterCryptoAmount: "Enter amount",
    enterVNDAmount: "Enter amount",
    selectBank: "Select bank",
    depositViaBankTransfer: "Deposit to bank account",
    depositViaCrypto: "Deposit to wallet",

    withdrawViaBankTransfer: "Withdraw to bank account",
    withdrawViaCrypto: "Withdraw to wallet",
    withdrawInfo: "Withdraw info",
    withdrawAmount: "Withdraw amount",
    enterCryptoAddress: "Enter crypto address",
    bank: "Bank",
    enterBankAccount: "Enter bank account number",
    enterAccountHolder: "Enter account holder name",
    confirmWithdraw: "Confirm withdraw",
    selectWithdrawMethod: "Select withdraw method",
    usdAmount: "USD amount",
    depositWalletAddress: "Deposit wallet address",
    depositWalletAddressDescription:
      "Please load the correct network selected, if you load the wrong network it will be lost.",

    // Forms
    selectNetwork: "Select network",
    amount: "Amount",
    bankAccount: "Bank account number",
    bankName: "Bank name",
    accountHolder: "Account holder name",
    walletAddress: "Wallet address",
    network: "Network",
    submit: "Submit",

    // Payment methods
    processingTime: "Processing time",
    fee: "Transaction fee",
    limits: "Limits",
    instant: "Instant",
    minutes: "minutes",
    free: "Free",
    workingDays: "working days",

    // Messages
    redirecting: "Redirecting to deposit page...",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.vi;
