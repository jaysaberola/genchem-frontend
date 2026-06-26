import { useEffect, useState } from "react";
import { layoutPresetService, LayoutPreset } from "@/services/layoutPresetService";

type Props = {
  onSelect: (content: string) => void;
};

export default function SelectPreset({ onSelect }: Props) {
  const [presets, setPresets] = useState<LayoutPreset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    layoutPresetService.getAll().then((res) => {
      setPresets(res.data.filter((p: LayoutPreset) => p.is_active));
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-muted mb-2">Loading presets…</p>;
  if (!presets.length) return <p className="text-muted mb-2">No presets available</p>;

  return (
    <div className="row g-2 mb-3">
      {presets.map((preset) => (
        <div className="col-6 col-sm-4 col-md-2" key={preset.id}>
          <div
            className="card"
            role="button"
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(preset.content)}
          >
            {preset.thumbnail && (
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${preset.thumbnail}`}
                alt={preset.name}
                className="card-img-top"
                style={{
                  height: 60,
                  objectFit: "cover",
                }}
              />
            )}

            <div className="card-body p-1 text-center">
              <small
                className="fw-semibold text-truncate d-block"
                title={preset.name}
              >
                {preset.name}
              </small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
