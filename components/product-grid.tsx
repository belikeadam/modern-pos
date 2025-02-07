"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Product } from "@/types/product"
import { ProductCard } from "./product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type React from "react"
import { THEME } from "@/constants/config"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product, quantity: number, customizations?: { size: string; sugar: string }) => void
  cartRef: React.RefObject<HTMLButtonElement>
}

export function ProductGrid({ products, onAddToCart, cartRef }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 12 // Adjust this value based on screen size

  useEffect(() => {
    setCurrentPage(0)
  }, []) // Removed unnecessary dependency 'products'

  const totalPages = Math.ceil(products.length / itemsPerPage)
  const displayedProducts = products.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0))

  const getCartPosition = () => {
    if (!cartRef.current) return null
    const rect = cartRef.current.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  }

  const gridClassName = `grid gap-4 mb-4 ${
    displayedProducts.length <= 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-lg"
      : displayedProducts.length <= 4
        ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-3xl"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 max-w-7xl"
  } mx-auto`

  return (
    <>
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-xl font-semibold mb-4" style={{ color: THEME.text }}>
            No items available in this category
          </p>
          <svg className="w-24 h-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      ) : (
        <motion.div className={gridClassName} layout>
          <AnimatePresence mode="wait">
            {displayedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard
                  product={product}
                  onAdd={(quantity, customizations) => onAddToCart(product, quantity, customizations)}
                  cartPosition={getCartPosition()}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 0}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages - 1}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </>
  )
}

