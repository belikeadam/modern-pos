import { Minus, Plus } from "lucide-react"
import { THEME } from "@/constants/config"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full shadow-sm bg-secondary/10 border border-secondary/30">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-secondary/20 focus:bg-secondary/20 transition-colors"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <motion.span
        key={value}
        className="px-2 min-w-[2rem] text-center font-medium text-sm"
        style={{ color: THEME.text }}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
      >
        {value}
      </motion.span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-secondary/20 focus:bg-secondary/20 transition-colors"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}