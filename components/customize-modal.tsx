"use client"

import { useState } from "react"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CUSTOMIZATION_OPTIONS, CURRENCY } from "@/constants/config"

interface CustomizeModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (quantity: number, customizations: Record<string, string>) => void
}

export function CustomizeModal({ product, onClose, onAddToCart }: CustomizeModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [customizations, setCustomizations] = useState<Record<string, string>>({
    size: "Small",
    sugar: "Normal Sugar",
  })

  const totalPrice = (
    (product.price + CUSTOMIZATION_OPTIONS.size.find((s) => s.label === customizations.size)?.price || 0) * quantity
  ).toFixed(2)

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[350px]">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Size</Label>
            <RadioGroup
              defaultValue={customizations.size}
              onValueChange={(value) => setCustomizations((prev) => ({ ...prev, size: value }))}
              className="flex flex-wrap gap-2"
            >
              {CUSTOMIZATION_OPTIONS.size.map((size) => (
                <div key={size.label} className="flex items-center">
                  <RadioGroupItem value={size.label} id={`size-${size.label}`} className="peer sr-only" />
                  <Label
                    htmlFor={`size-${size.label}`}
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    {size.label}
                    {size.price > 0 && (
                      <span className="ml-2 text-xs">
                        +{CURRENCY.symbol}
                        {size.price.toFixed(2)}
                      </span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Sugar Level</Label>
            <RadioGroup
              defaultValue={customizations.sugar}
              onValueChange={(value) => setCustomizations((prev) => ({ ...prev, sugar: value }))}
              className="flex flex-wrap gap-2"
            >
              {CUSTOMIZATION_OPTIONS.sugar.map((sugar) => (
                <div key={sugar.label} className="flex items-center">
                  <RadioGroupItem value={sugar.label} id={`sugar-${sugar.label}`} className="peer sr-only" />
                  <Label
                    htmlFor={`sugar-${sugar.label}`}
                    className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    {sugar.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </Button>
            <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
              +
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-lg font-bold">
            Total: {CURRENCY.symbol}
            {totalPrice}
          </p>
          <Button onClick={() => onAddToCart(quantity, customizations)}>Add to Cart</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

