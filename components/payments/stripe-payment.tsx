'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Copy, Building2, MapPin, CreditCard, Hash, Banknote } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BankTransferProps {
  amount?: number
  donationType?: 'one-time' | 'monthly'
}

export default function BankTransfer({ amount, donationType }: BankTransferProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { toast } = useToast()

  const bankDetails = {
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

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
      })
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Palestinian Flag Header */}
      <div className="relative h-4 rounded-t-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
        {/* Triangle pointing RIGHT into the flag, covering all 3 stripes */}
        <div className="absolute top-0 left-0 w-0 h-0 border-l-[16px] border-l-red-600 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent"></div>
      </div>

      {/* Bank Information Card */}
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-red-600" />
            Bank Transfer Information
            {/* Small flag decoration */}
            <div className="ml-auto w-8 h-5 relative opacity-60">
              <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
              <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
              <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
              {/* Triangle pointing RIGHT, covering all stripes */}
              <div className="absolute top-0 left-0 w-0 h-0 border-l-[8px] border-l-red-600 border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent"></div>
            </div>
          </CardTitle>
          {amount && (
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {donationType === 'monthly' ? 'Monthly Donation' : 'One-time Donation'}
              </Badge>
              <span className="text-lg font-semibold">${amount}</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Bank Details */}
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center">
                <Building2 className="w-4 h-4 mr-2 text-red-600" />
                <div>
                  <p className="font-medium text-gray-800">Bank Name</p>
                  <p className="text-sm text-gray-600">{bankDetails.bankName}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.bankName, 'Bank Name')}
                className="flex-shrink-0 hover:bg-red-50"
              >
                {copiedField === 'Bank Name' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-green-700" />
                <div>
                  <p className="font-medium text-gray-800">Branch</p>
                  <p className="text-sm text-gray-600">{bankDetails.branch}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.branch, 'Branch')}
                className="flex-shrink-0 hover:bg-green-50"
              >
                {copiedField === 'Branch' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-green-50 border-2 border-red-200 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CreditCard className="w-4 h-4 mr-2 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">IBAN</p>
                  <p className="text-sm font-mono text-red-700 font-semibold">{bankDetails.iban}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.iban, 'IBAN')}
                className="flex-shrink-0 hover:bg-red-100"
              >
                {copiedField === 'IBAN' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-red-600" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center">
                <Hash className="w-4 h-4 mr-2 text-black" />
                <div>
                  <p className="font-medium text-gray-800">SWIFT Code</p>
                  <p className="text-sm font-mono text-gray-700 font-semibold">{bankDetails.swiftCode}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.swiftCode, 'SWIFT Code')}
                className="flex-shrink-0 hover:bg-gray-100"
              >
                {copiedField === 'SWIFT Code' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
              <div className="flex items-center">
                <Banknote className="w-4 h-4 mr-2 text-green-700" />
                <div>
                  <p className="font-medium text-gray-800">Account Number</p>
                  <p className="text-sm font-mono text-gray-700 font-semibold">{bankDetails.accountNumber}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account Number')}
                className="flex-shrink-0 hover:bg-green-50"
              >
                {copiedField === 'Account Number' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-500" />
                )}
              </Button>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 via-white to-red-50 border-2 border-green-200 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-green-800">Account Name</p>
                  <p className="text-sm text-green-700 font-semibold">{bankDetails.accountName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankDetails.accountName, 'Account Name')}
                  className="flex-shrink-0 hover:bg-green-100"
                >
                  {copiedField === 'Account Name' ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-green-700" />
                  )}
                </Button>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800">Organization Details</p>
              <p className="text-sm text-gray-600">Registration: {bankDetails.registrationNumber}</p>
              <p className="text-sm text-gray-600">Date: {bankDetails.registrationDate}</p>
              <p className="text-sm text-gray-600">Currency PIN: {bankDetails.currencyPin}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Instructions Card */}
      <Card className="w-full shadow-lg border-0">
        {/* Palestinian Flag Header */}
        <div className="relative h-3">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-black"></div>
          <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
          <div className="absolute top-2/3 left-0 w-full h-1/3 bg-green-700"></div>
          {/* Triangle pointing RIGHT into the flag, covering all 3 stripes */}
          <div className="absolute top-0 left-0 w-0 h-0 border-l-[12px] border-l-red-600 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent"></div>
        </div>
        
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-700" />
            How to Transfer Money
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 shadow-sm">
                1
              </div>
              <div>
                <h4 className="font-medium text-gray-800">For International Transfers</h4>
                <p className="text-sm text-gray-600">
                  Use the IBAN and SWIFT code for international wire transfers. Contact your bank and provide all the details above.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 shadow-sm">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-800">For Local Transfers (Palestine)</h4>
                <p className="text-sm text-gray-600">
                  You can use the account number and bank name for local transfers within Palestine.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 shadow-sm">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Online Banking</h4>
                <p className="text-sm text-gray-600">
                  Log into your online banking and create a new payee using the account details above. 
                  Use "FRIENDS OF FREEDOM AND JUSTICE" as the beneficiary name.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 shadow-sm">
                4
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Mobile Banking Apps</h4>
                <p className="text-sm text-gray-600">
                  Most mobile banking apps support international transfers. Add the account as a new recipient and transfer funds.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 shadow-sm">
                5
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Confirmation</h4>
                <p className="text-sm text-gray-600">
                  After completing the transfer, please keep your transaction receipt for your records. 
                  Thank you for your generous support!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Some banks may charge fees for international transfers. 
              Please check with your bank for applicable charges before proceeding.
            </p>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 via-white to-green-50 border border-red-200 rounded-lg">
            <p className="text-gray-800 text-sm">
              <strong>Note:</strong> All donations go directly to supporting our mission of promoting peace, 
              justice, and human rights. Thank you for your contribution to this important cause.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
