"use client"

import { useState, useRef, useEffect } from "react"
import { ProductGrid } from "@/components/product-grid"
import { CartSheet } from "@/components/cart-sheet"
import { CategoryBar } from "@/components/category-bar"
import { SubcategoryNav } from "@/components/subcategory-nav"
import type { Category, CartItem, Product, ProductCustomizations } from "@/types/product"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  ShoppingCart,
  Coffee,
  Pizza,
  IceCream,
  Sandwich,
  Salad,
  BeefIcon as Burger,
  Cake,
  CoffeeIcon as Cocktail,
  Utensils,
  Apple,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { THEME } from "@/constants/config"

const CATEGORIES: Category[] = [
  {
    id: "drinks",
    name: "Drinks",
    icon: Coffee,
    subcategories: [
      { id: "hot-drinks", name: "Hot Drinks", parentId: "drinks" },
      { id: "cold-drinks", name: "Cold Drinks", parentId: "drinks" },
      { id: "smoothies", name: "Smoothies", parentId: "drinks" },
    ],
  },
  {
    id: "food",
    name: "Food",
    icon: Pizza,
    subcategories: [
      { id: "main-dishes", name: "Main Dishes", parentId: "food" },
      { id: "sides", name: "Sides", parentId: "food" },
      { id: "desserts", name: "Desserts", parentId: "food" },
    ],
  },
  {
    id: "snacks",
    name: "Snacks",
    icon: Apple,
    subcategories: [
      { id: "fruits", name: "Fruits", parentId: "snacks" },
      { id: "nuts", name: "Nuts", parentId: "snacks" },
      { id: "chips", name: "Chips", parentId: "snacks" },
    ],
  },
  {
    id: "breakfast",
    name: "Breakfast",
    icon: Sandwich,
    subcategories: [
      { id: "eggs", name: "Eggs", parentId: "breakfast" },
      { id: "pancakes", name: "Pancakes", parentId: "breakfast" },
      { id: "cereals", name: "Cereals", parentId: "breakfast" },
    ],
  },
  {
    id: "lunch",
    name: "Lunch",
    icon: Salad,
    subcategories: [
      { id: "sandwiches", name: "Sandwiches", parentId: "lunch" },
      { id: "salads", name: "Salads", parentId: "lunch" },
      { id: "soups", name: "Soups", parentId: "lunch" },
    ],
  },
  {
    id: "dinner",
    name: "Dinner",
    icon: Utensils,
    subcategories: [
      { id: "steaks", name: "Steaks", parentId: "dinner" },
      { id: "pasta", name: "Pasta", parentId: "dinner" },
      { id: "seafood", name: "Seafood", parentId: "dinner" },
    ],
  },
  {
    id: "burgers",
    name: "Burgers",
    icon: Burger,
    subcategories: [
      { id: "beef-burgers", name: "Beef Burgers", parentId: "burgers" },
      { id: "chicken-burgers", name: "Chicken Burgers", parentId: "burgers" },
      { id: "veggie-burgers", name: "Veggie Burgers", parentId: "burgers" },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    icon: Cake,
    subcategories: [
      { id: "cakes", name: "Cakes", parentId: "desserts" },
      { id: "ice-cream", name: "Ice Cream", parentId: "desserts" },
      { id: "cookies", name: "Cookies", parentId: "desserts" },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    icon: Cocktail,
    subcategories: [
      { id: "soft-drinks", name: "Soft Drinks", parentId: "beverages" },
      { id: "juices", name: "Juices", parentId: "beverages" },
      { id: "alcoholic", name: "Alcoholic", parentId: "beverages" },
    ],
  },
  {
    id: "specials",
    name: "Specials",
    icon: IceCream,
    subcategories: [
      { id: "daily-specials", name: "Daily Specials", parentId: "specials" },
      { id: "seasonal", name: "Seasonal", parentId: "specials" },
      { id: "chef-choice", name: "Chef's Choice", parentId: "specials" },
    ],
  },
]

const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "French Vanilla Fantasy",
    price: 5.99,
    icon: Coffee,
    categoryId: "drinks",
    subcategoryId: "hot-drinks",
    customizable: true,
    description: "Smooth and creamy vanilla flavored coffee",
    popular: true  // This is now valid
  },
  // ...
]

export default function Page() {
  const isMobile = useIsMobile()

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [activeSubcategory, setActiveSubcategory] = useState(CATEGORIES[0].subcategories[0].id)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const cartButtonRef = useRef<HTMLButtonElement>(null)

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (product: Product, quantity: number, customizations?: ProductCustomizations) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && JSON.stringify(item.customizations) === JSON.stringify(customizations)
      )

      if (existingItem) {
        return prevCart.map((item) =>
          item === existingItem ? { ...item, quantity: item.quantity + quantity } : item
        )
      }

      return [...prevCart, { ...product, quantity, customizations }]
    })
  }

  const updateCartItemQuantity = (index: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item)).filter((item) => item.quantity > 0)
    )
  }

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index))
  }

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory)
  const subcategories = currentCategory?.subcategories || []

  const handleSubcategoryChange = async (subcategoryId: string) => {
    setIsLoading(true)
    setActiveSubcategory(subcategoryId)
    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background" style={{ backgroundColor: THEME.background }}>
      <header
        className="flex items-center justify-between p-4 sticky top-0 bg-background/80 backdrop-blur-sm z-50"
        style={{ borderColor: THEME.primary }}
      >
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: THEME.primary }}>
          Café POS
        </h1>
        {!isMobile && (
          <span style={{ color: THEME.text }}>
            {cart.length} items
          </span>
        )}
        {isMobile && (
          <Button
            ref={cartButtonRef}
            variant="outline"
            size="icon"
            onClick={() => setIsCartOpen(true)}
            className="h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110 relative"
            style={{ borderColor: THEME.primary, color: THEME.primary, backgroundColor: THEME.background }}
          >
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  style={{
                    backgroundColor: THEME.secondary,
                    color: THEME.background
                  }}
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        )}
      </header>
      <div className={`h-[calc(100vh-4rem)] ${isMobile ? "flex flex-col" : "grid grid-cols-[4fr_1fr]"}`}>
        <div className="flex flex-col">
          <nav className="bg-background/80 backdrop-blur-sm sticky top-[4rem] z-40 py-2">
            <CategoryBar
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onCategoryChange={(categoryId) => {
                setActiveCategory(categoryId)
                setActiveSubcategory(CATEGORIES.find((c) => c.id === categoryId)?.subcategories[0].id || "")
              }}
            />
            <div className="mt-2">
              <SubcategoryNav
                subcategories={subcategories}
                activeSubcategory={activeSubcategory}
                onSubcategoryChange={handleSubcategoryChange}
              />
            </div>
          </nav>

          <main className="flex-1 overflow-auto p-4">
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            {!isLoading && (
              <ProductGrid
                products={PRODUCTS.filter(
                  (p) => p.categoryId === activeCategory && p.subcategoryId === activeSubcategory
                )}
                onAddToCart={addToCart}
                cartRef={cartButtonRef}
              />
            )}
          </main>
        </div>
        {!isMobile && (
          <CartSheet
            cart={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeCartItem}
          />
        )}
      </div>

      {isMobile && (
        <CartSheet
          cart={cart}
          onUpdateQuantity={updateCartItemQuantity}
          onRemoveItem={removeCartItem}
          open={isCartOpen}
          onOpenChange={setIsCartOpen}
        />
      )}
    </div>
  )
}