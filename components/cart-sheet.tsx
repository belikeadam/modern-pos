"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CartItem } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShoppingCart, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { CURRENCY, TAX_RATE, ORDER_STEPS, THEME } from "@/constants/config"
import { QuantitySelector } from "@/components/quantity-selector"
import { useIsMobile } from "@/hooks/use-mobile"

interface CartSheetProps {
  cart: CartItem[]
  onUpdateQuantity: (index: number, quantity: number) => void
  onRemoveItem: (index: number) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CartSheet({ cart, onUpdateQuantity, onRemoveItem, open, onOpenChange }: CartSheetProps) {
  const isMobile = useIsMobile()
  const [currentStep, setCurrentStep] = useState(0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const CartContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: THEME.primary }}>
        <h2 className="text-xl font-semibold" style={{ color: THEME.primary }}>Your Order</h2>
        <span style={{ color: THEME.text }}>{cart.length} items</span>
      </div>

      <div className="flex-1 overflow-auto">
        {cart.map((item, index) => (
          <div
            key={item.id}
            className="p-4 border-b"
            style={{ borderColor: THEME.primary }}
          >
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="font-medium" style={{ color: THEME.text }}>{item.name}</h3>
                {item.customizations && (
                  <p className="text-sm opacity-70" style={{ color: THEME.text }}>
                    {item.customizations.size}, {item.customizations.sugar}
                  </p>
                )}
              </div>
              <span className="font-semibold" style={{ color: THEME.primary }}>
                {CURRENCY.symbol}{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <QuantitySelector
                value={item.quantity}
                onChange={(value) => onUpdateQuantity(index, value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t" style={{ borderColor: THEME.primary }}>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span style={{ color: THEME.text }}>Subtotal</span>
            <span style={{ color: THEME.text }}>{CURRENCY.symbol}{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: THEME.text }}>Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
            <span style={{ color: THEME.text }}>{CURRENCY.symbol}{tax.toFixed(2)}</span>
          </div>
          <Separator style={{ backgroundColor: THEME.primary }} />
          <div className="flex justify-between text-lg font-semibold">
            <span style={{ color: THEME.text }}>Total</span>
            <span style={{ color: THEME.primary }}>{CURRENCY.symbol}{total.toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full"
          disabled={cart.length === 0}
          style={{
            background: `linear-gradient(45deg, ${THEME.primary}, ${THEME.secondary})`,
            color: THEME.background,
          }}
          onClick={() => setCurrentStep((prev) => (prev + 1) % ORDER_STEPS.length)}
        >
          {currentStep === ORDER_STEPS.length - 1 ? "Place Order" : "Continue"}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full p-0">
          <CartContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="h-full">
      <CartContent />
    </div>
  )
}