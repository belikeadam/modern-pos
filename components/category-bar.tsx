"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Category } from "@/types/product"
import { THEME } from "@/constants/config"

interface CategoryBarProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryBar({ categories, activeCategory, onCategoryChange }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      const scrollAmount = clientWidth / 2
      const newScrollLeft = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount

      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" })

      setShowLeftArrow(newScrollLeft > 0)
      setShowRightArrow(newScrollLeft + clientWidth < scrollWidth)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        const { scrollWidth, clientWidth } = scrollRef.current
        setShowRightArrow(scrollWidth > clientWidth)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="relative flex items-center max-w-screen-xl mx-auto">
      {showLeftArrow && (
        <div className="absolute left-0 z-10 flex items-center h-full">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative ml-2" 
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />  
          </Button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-1 px-12" // Added px-12 for safe space
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "ghost"}
              className="flex-shrink-0 px-3"
              onClick={() => onCategoryChange(category.id)}
              style={{
                backgroundColor: activeCategory === category.id ? THEME.primary : "transparent",
                color: activeCategory === category.id ? THEME.background : THEME.text,
              }}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="font-medium text-sm">{category.name}</span>
            </Button>
          )
        })}
      </div>

      {showRightArrow && (
        <div className="absolute right-0 z-10 flex items-center h-full">
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent" />
          <Button 
            variant="ghost" 
            size="icon"
            className="relative mr-2"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}