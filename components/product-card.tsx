"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/types/product"
import { Card, CardContent } from "@/components/ui/card"
import { CURRENCY, THEME } from "@/constants/config"
import { CustomizeModal } from "./customize-modal"

interface ProductCardProps {
  product: Product
  onAdd: (quantity: number, customizations?: Record<string, string>) => void
  cartPosition: { x: number; y: number } | null
}

export function ProductCard({ product, onAdd, cartPosition }: ProductCardProps) {
  const [showCustomizeModal, setShowCustomizeModal] = useState(false)

  const handleAdd = async (quantity: number, customizations?: Record<string, string>) => {
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
              className="flex flex-col items-center justify-center mb-2"
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Icon className="w-10 h-10" style={{ color: THEME.primary }} />
            </motion.div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-base tracking-tight" style={{ color: THEME.text }}>
                {product.name}
              </h3>
              <p className="text-xs text-gray-600" style={{ color: THEME.text }}>
                {product.description}
              </p>
              <p className="text-lg font-bold" style={{ color: THEME.primary }}>
                {CURRENCY.symbol}
                {product.price.toFixed(2)}
              </p>
              {product.popular && (
                <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
            </div>
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

