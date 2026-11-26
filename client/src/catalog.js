export const categories = ["Audio", "Cameras", "Computing", "Accessories"];

export function filterEquipment(equipment, { category = "All equipment", available = false, query = "" } = {}) {
  const needle = query.trim().toLowerCase();
  return equipment.filter((item) =>
    (category === "All equipment" || item.category === category) &&
    (!available || item.status === "available") &&
    `${item.name} ${item.assetTag} ${item.description || ""}`.toLowerCase().includes(needle)
  );
}
