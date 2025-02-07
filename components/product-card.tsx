"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product, ProductCustomizations } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { CURRENCY, THEME } from "@/constants/config"
import { CustomizeModal } from "./customize-modal"

interface ProductCardProps {
  product: Product
  onAdd: (quantity: number, customizations?: ProductCustomizations) => void
  cartPosition: { x: number; y: number } | null
}

export function ProductCard({ product, onAdd, cartPosition }: ProductCardProps) {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)

  const handleAdd = async (quantity: number, customizations?: ProductCustomizations) => {
    if (!cartPosition) return

    const card = document.getElementById(`product-${product.id}`)
    if (!card) return

    const cardRect = card.getBoundingClientRect()
    const clone = card.cloneNode(true) as HTMLElement
    clone.style.position = "fixed"
    clone.style.left = `${cardRect.left}px`
    clone.style.top = `${cardRect.top}px`
    clone.style.width = `${cardRect.width}px`
    clone.style.height = `${cardRect.height}px`
    clone.style.transition = "all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)"
    clone.style.zIndex = "100"
    clone.style.pointerEvents = "none"
    document.body.appendChild(clone)

    await new Promise((resolve) => setTimeout(resolve, 50))
    clone.style.transform = `translate(${cartPosition.x - cardRect.left - cardRect.width / 2}px, ${
      cartPosition.y - cardRect.top - cardRect.height / 2
    }px) scale(0.2) rotate(720deg)`
    clone.style.opacity = "0"

    await new Promise((resolve) => setTimeout(resolve, 500))

    document.body.removeChild(clone)
    onAdd(quantity, customizations)
  }

  const Icon = product.icon

  return (
    <>
      <motion.div
        id={`product-${product.id}`}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowCustomizeModal(true)}
        className="cursor-pointer"
      >
        <Card
          className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          style={{ backgroundColor: THEME.background }}
        >
          <CardContent className="p-4">
            <motion.div
              className="flex items-center justify-between"
              style={{ color: THEME.text }}
            >
              <Icon className="w-6 h-6" />
              <span className="text-lg font-semibold">{product.name}</span>
              <span className="text-lg font-semibold">
                {CURRENCY.symbol}
                {product.price.toFixed(2)}
              </span>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {showCustomizeModal && (
          <CustomizeModal product={product} onClose={() => setShowCustomizeModal(false)} onAddToCart={handleAdd} />
        )}
      </AnimatePresence>
    </>
  )
}