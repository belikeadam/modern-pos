export interface Category {
  id: string
  name: string
  icon: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  parentId: string
}

export interface Product {
  id: string
  name: string
  price: number
  icon: string
  description?: string
  categoryId: string
  subcategoryId: string
  customizable: boolean
}

export interface CartItem extends Product {
  quantity: number
  customizations?: {
    size: string
    sugar: string
  }
}

