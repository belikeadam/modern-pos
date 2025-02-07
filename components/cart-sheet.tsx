"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { CartItem } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingCart, X, ChevronDown, ChevronUp } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CURRENCY, TAX_RATE, ORDER_STEPS, THEME } from "@/constants/config"
import { useSwipeable } from 'react-swipeable';

interface CartSheetProps {
  cart: CartItem[]
  onUpdateQuantity: (index: number, quantity: number) => void
  onRemoveItem: (index: number) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSheet({ cart, onUpdateQuantity, onRemoveItem, open, onOpenChange }: CartSheetProps) {
  const [discount, setDiscount] = useState("")
  const [isDiscountOpen, setIsDiscountOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  const [swipedIndex, setSwipedIndex] = useState<number | null>(null);

  const handleSwipe = (index: number) => {
    setSwipedIndex(index);
  };

  const handleRemove = (index: number) => {
    onRemoveItem(index);
    setSwipedIndex(null);
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity >= 1) {
      onUpdateQuantity(index, quantity);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      const index = parseInt(eventData.event.target.closest('[data-index]')?.dataset.index || '-1');
      if (!isNaN(index) && index >= 0) {
        handleSwipe(index);
      }
    },
    onSwipedRight: () => setSwipedIndex(null),
    trackMouse: true,
    preventDefaultTouchmoveEvent: true
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0" style={{ backgroundColor: THEME.background }}>
        <SheetHeader className="p-6 border-b" style={{ borderColor: THEME.primary }}>
          <SheetTitle className="flex items-center gap-3 text-2xl" style={{ color: THEME.primary }}>
            <ShoppingCart className="w-6 h-6" />
            Your Order
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-[calc(100vh-10rem)]">
          <div className="p-4 mb-4">
            <div className="flex justify-between mb-2">
              {ORDER_STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`text-sm font-medium ${index === currentStep ? "text-primary" : "text-gray-400"}`}
                  style={{ color: index === currentStep ? THEME.primary : THEME.text }}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full"
                style={{ width: `${((currentStep + 1) / ORDER_STEPS.length) * 100}%`, backgroundColor: THEME.primary }}
              ></div>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <AnimatePresence>
              {cart.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="relative select-none"
                  style={{ borderColor: THEME.primary }}
                  data-index={index}
                  {...swipeHandlers}
                >
                  <div className={`p-6 border-b ${swipedIndex === index ? 'translate-x-[-80px]' : ''} transition-transform duration-200`} style={{ borderColor: THEME.primary }}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-lg" style={{ color: THEME.text }}>
                            {item.name}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1" style={{ color: THEME.text }}>
                          {item.customizations?.size}, {item.customizations?.sugar}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          className="w-16 text-center"
                          style={{ color: THEME.text }}
                          value={item.quantity.toString()}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) {
                              handleQuantityChange(index, value);
                            }
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(index, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold text-lg" style={{ color: THEME.primary }}>
                        {CURRENCY.symbol}
                        {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {swipedIndex === index && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1/2 right-2 -translate-y-1/2 h-12 w-12"
                      onClick={() => handleRemove(index)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t p-6 space-y-6" style={{ borderColor: THEME.primary }}>
            <Collapsible open={isDiscountOpen} onOpenChange={setIsDiscountOpen}>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground" style={{ color: THEME.text }}>
                      Subtotal
                    </span>
                    <span style={{ color: THEME.text }}>
                      {CURRENCY.symbol}
                      {subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground" style={{ color: THEME.text }}>
                      Tax ({(TAX_RATE * 100).toFixed(0)}%)
                    </span>
                    <span style={{ color: THEME.text }}>
                      {CURRENCY.symbol}
                      {tax.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Separator style={{ backgroundColor: THEME.primary }} />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold" style={{ color: THEME.text }}>
                    Total
                  </span>
                  <span className="text-2xl font-bold" style={{ color: THEME.primary }}>
                    {CURRENCY.symbol}
                    {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </Collapsible>

            <Button
              className="w-full h-12 text-lg font-semibold"
              disabled={cart.length === 0}
              style={{
                background: `linear-gradient(45deg, ${THEME.primary}, ${THEME.secondary})`,
                color: THEME.background,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              onClick={() => setCurrentStep((prev) => (prev + 1) % ORDER_STEPS.length)}
            >
              {currentStep === ORDER_STEPS.length - 1 ? "Place Order" : "Continue"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}