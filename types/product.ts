import { LucideIcon } from "lucide-react"

export interface Category {
  id: string
  name: string
  icon: LucideIcon // Update this line
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  parentId: string
}
export interface ProductCustomizations {
  size: string
  sugar: string
}
export interface Product {
  id: string
  name: string
  price: number
  icon: LucideIcon
  description?: string
  categoryId: string
  subcategoryId: string
  customizable: boolean
  popular?: boolean  // Add this optional property

}

export interface CartItem extends Product {
  quantity: number
  customizations?: {
    size: string
    sugar: string
  }
}

