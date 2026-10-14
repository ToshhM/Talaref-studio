export type PodcastCameraCount = 1 | 2;
export type PodcastEditingPackage = "none" | "30min" | "45-60min";

export const PODCAST_CAMERA_OPTIONS: {
  cameraCount: PodcastCameraCount;
  label: string;
  price: number;
}[] = [
  { cameraCount: 1, label: "1 caméra", price: 75 },
  { cameraCount: 2, label: "2 caméras", price: 150 },
];

export const PODCAST_EDITING_OPTIONS: {
  id: PodcastEditingPackage;
  label: string;
  description: string;
  price: number;
}[] = [
  {
    id: "none",
    label: "Sans montage",
    description: "Tournage uniquement",
    price: 0,
  },
  {
    id: "30min",
    label: "Montage 30 min",
    description: "Épisode de 30 min + 2 reels",
    price: 250,
  },
  {
    id: "45-60min",
    label: "Montage 45 min – 1 h",
    description: "Épisode de 45 min à 1 h + 5 reels",
    price: 350,
  },
];

export function getPodcastOptionsPrice(
  cameraCount: PodcastCameraCount,
  editingPackage: PodcastEditingPackage
): number {
  const cameraOption = PODCAST_CAMERA_OPTIONS.find(
    (option) => option.cameraCount === cameraCount
  );
  const editingOption = PODCAST_EDITING_OPTIONS.find(
    (option) => option.id === editingPackage
  );

  if (!cameraOption || !editingOption) {
    throw new Error("Options de podcast invalides.");
  }

  return cameraOption.price + editingOption.price;
}

export function getPodcastOptionsLabel(
  cameraCount: PodcastCameraCount,
  editingPackage: PodcastEditingPackage
): string {
  const cameraOption = PODCAST_CAMERA_OPTIONS.find(
    (option) => option.cameraCount === cameraCount
  );
  const editingOption = PODCAST_EDITING_OPTIONS.find(
    (option) => option.id === editingPackage
  );

  if (!cameraOption || !editingOption) {
    throw new Error("Options de podcast invalides.");
  }

  return `${cameraOption.label} · ${editingOption.description}`;
}
