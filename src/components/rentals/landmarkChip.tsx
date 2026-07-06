import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

type Props = { icon: string; label: string };

export default function LandmarkChip({ icon, label }: Props) {
  const navigate = useNavigate();

  return (
    <Badge
      variant="outline"
      onClick={() => navigate(`/search?landmark=${encodeURIComponent(label)}`)}
      className="cursor-pointer gap-1 rounded-full border-green-200 bg-green-50 px-1 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 active:scale-95"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Badge>
  );
}