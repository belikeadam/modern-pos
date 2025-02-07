"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Subcategory } from "@/types/product"
import { THEME } from "@/constants/config"

interface SubcategoryNavProps {
  subcategories: Subcategory[]
  activeSubcategory: string
  onSubcategoryChange: (subcategoryId: string) => void
}

export function SubcategoryNav({ subcategories, activeSubcategory, onSubcategoryChange }: SubcategoryNavProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 5

  const totalPages = Math.ceil(subcategories.length / itemsPerPage)
  const displayedSubcategories = subcategories.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 0))

  useEffect(() => {
    setCurrentPage(0)
  }, [])

  const showPagination = subcategories.length > itemsPerPage

  return (
    <div className="flex items-center justify-center space-x-2">
      {showPagination && (
        <Button variant="ghost" size="sm" onClick={prevPage} disabled={currentPage === 0} className="px-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {displayedSubcategories.map((subcategory) => (
        <Button
          key={subcategory.id}
          variant={activeSubcategory === subcategory.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onSubcategoryChange(subcategory.id)}
          style={{
            backgroundColor: activeSubcategory === subcategory.id ? THEME.secondary : "transparent",
            color: activeSubcategory === subcategory.id ? THEME.background : THEME.text,
          }}
        >
          {subcategory.name}
        </Button>
      ))}
      {showPagination && (
        <Button variant="ghost" size="sm" onClick={nextPage} disabled={currentPage === totalPages - 1} className="px-2">
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

