import { Minus, Plus } from "lucide-react"
import { THEME } from "@/constants/config"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
}

export function QuantitySelector({ value, onChange, min = 1, max = 99 }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center bg-secondary/20 rounded-full px-2 py-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full hover:bg-secondary/40"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-8 text-center font-medium" style={{ color: THEME.text }}>
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 rounded-full hover:bg-secondary/40"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}