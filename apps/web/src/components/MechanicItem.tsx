export function MechanicItem({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0)}
      </div>
      <span>{name}</span>
    </div>
  );
}
