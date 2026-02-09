import { useRef } from "react";
import { Camera, X } from "lucide-react";

type Props = {
  photos: string[];
  onChange: (photos: string[]) => void;
};

export function PhotoUploader({ photos, onChange }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  const upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onChange([...photos, ev.target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const remove = (index: number) => {
    onChange(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Photos</label>

      <div className="flex flex-wrap gap-3">
        {photos.map((p, i) => (
          <div
            key={i}
            className="relative w-20 h-20 rounded-lg overflow-hidden"
          >
            <img src={p} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="w-20 h-20 border-2 border-dashed rounded-lg flex flex-col items-center justify-center"
        >
          <Camera className="w-5 h-5" />
        </button>

        <input
          ref={ref}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={upload}
        />
      </div>
    </div>
  );
}
