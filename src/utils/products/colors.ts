import colors from "../../pages/data/products/colors.json";

interface Color {
  color_image_url?: string;
  color_name_en?: string;
  color_name?: string;
}

export const colorNameMap = colors.reduce(
  (acc: Record<string, string>, cur: Color) => {
    if (cur.color_image_url && cur.color_name_en) {
      acc[cur.color_name_en.toUpperCase()] = cur.color_name as string;
    }
    return acc;
  },
  {} as Record<string, string>
);
