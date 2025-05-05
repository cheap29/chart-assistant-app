// src/components/ToggleTags.tsx
type Option = { key: string; label: string };
export default function ToggleTags({
  options,
  selected,
  onChange,
}: {
  options: Option[];
  selected: string[];
  onChange: (newSel: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.key}
          className={`px-3 py-1 rounded-full border transition-colors ${
            selected.includes(opt.key)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
          }`}
          onClick={() =>
            onChange(
              selected.includes(opt.key)
                ? selected.filter((k) => k !== opt.key)
                : [...selected, opt.key]
            )
          }
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
