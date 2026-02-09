type MechanicItemProps = {
  name: string;
  color: string;
};

export function MechanicItem({ name, color }: MechanicItemProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
        style={{ backgroundColor: color }}
      >
        {name.charAt(0)}
      </div>
      <span className="text-muted-foreground">Assigned to</span>
      <span className="font-medium">{name}</span>
    </div>
  );
}
