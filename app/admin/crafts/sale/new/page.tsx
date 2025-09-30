"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PackagePlus } from "lucide-react"
import { SaleForm } from "../components"

export default function NewSaleItemPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F8F5F0] to-[#F0EDE8] embroidery-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin/crafts">
              <Button variant="outline" className="border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520] hover:text-black">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Crafts
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-[#DAA520] to-[#B8941C] rounded-lg">
              <PackagePlus className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">
                Create New Sale Item
              </h1>
              <p className="text-gray-600">
                Add a new embroidery item for sale with pricing and contact information
              </p>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-4xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-[#DAA520]/20 p-8">
            <SaleForm />
          </div>
        </div>
      </div>
    </div>
  )
}
