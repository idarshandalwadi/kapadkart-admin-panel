import { useRef } from 'react'

const PRESET_COLORS = [
  { name: 'Amber / Gold', hex: '#d97706' },
  { name: 'Warm Ochre', hex: '#b45309' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Rose', hex: '#e11d48' },
  { name: 'Purple', hex: '#7c3aed' },
]

/**
 * Visual Color Picker Input with native picker swatch and hex text sync
 *
 * @param {Object} props
 * @param {string} props.value - Current hex color value (e.g. '#d97706')
 * @param {Function} props.onChange - Callback with the new hex string
 * @param {string} [props.placeholder='#d97706'] - Placeholder
 * @param {string} [props.name] - Input name
 */
export default function ColorPickerInput({
  value = '',
  onChange,
  placeholder = '#d97706',
  name,
}) {
  const colorInputRef = useRef(null)

  // Normalize hex value for the native <input type="color"> (must be 7-char valid #RRGGBB)
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(value)
  const pickerValue = isValidHex ? value : (placeholder.startsWith('#') && placeholder.length === 7 ? placeholder : '#d97706')

  const handleColorChange = (e) => {
    onChange(e.target.value.toLowerCase())
  }

  const handleTextChange = (e) => {
    let val = e.target.value.trim()
    if (val && !val.startsWith('#') && /^[0-9A-Fa-f]{1,6}$/.test(val)) {
      val = `#${val}`
    }
    onChange(val)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {/* Clickable Color Swatch */}
        <div
          onClick={() => colorInputRef.current?.click()}
          className="relative size-10.5 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 border-border shadow-xs transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: value || placeholder || '#d97706' }}
          title="Click to open color picker"
        >
          <input
            ref={colorInputRef}
            type="color"
            value={pickerValue}
            onChange={handleColorChange}
            className="absolute inset-0 size-full cursor-pointer opacity-0"
            aria-label="Pick color"
          />
        </div>

        {/* Hex Text Field */}
        <div className="relative flex-1">
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleTextChange}
            placeholder={placeholder}
            maxLength={7}
            className="w-full rounded-xl border border-border bg-light px-3.5 py-2.5 font-mono text-sm font-semibold tracking-wide text-ink uppercase outline-none focus:border-accent"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-xs text-muted hover:text-ink cursor-pointer"
              title="Clear color"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Preset Swatches */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset.hex}
            type="button"
            onClick={() => onChange(preset.hex)}
            className="size-5 cursor-pointer rounded-full border border-black/15 shadow-2xs transition-transform hover:scale-125 focus:scale-125 focus:outline-none"
            style={{ backgroundColor: preset.hex }}
            title={`${preset.name} (${preset.hex})`}
            aria-label={preset.name}
          />
        ))}
      </div>
    </div>
  )
}
