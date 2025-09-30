// Bank transfer configuration for donations
export const BANK_DETAILS = {
  bankName: "BANK OF PALESTINE",
  branch: "Beitunia Sub Branch", 
  iban: "PS73PALS045802224590013000000",
  swiftCode: "PALSPS22",
  currencyPin: "1",
  accountNumber: "222459",
  accountName: "FRIENDS OF FREEDOM AND JUSTICE",
  registrationNumber: "RA-22537-C",
  registrationDate: "26/2/2008"
}

// Format currency for display
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}
