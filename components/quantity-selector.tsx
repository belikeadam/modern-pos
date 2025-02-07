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
    <div className="inline-flex items-center rounded-full shadow-sm bg-secondary/10 border border-secondary/30">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-secondary/20"
        onClick={() => value > min && onChange(value - 1)}
        disabled={value <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="px-2 min-w-[2rem] text-center font-medium text-sm" style={{ color: THEME.text }}>
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-secondary/20"
        onClick={() => value < max && onChange(value + 1)}
        disabled={value >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}