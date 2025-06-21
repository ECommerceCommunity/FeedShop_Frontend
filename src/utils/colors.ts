import colors from '../pages/products/data/musinsa_colors.json'

export const colorNameMap = colors.reduce((acc, cur) => {
  if (cur.color_image_url && cur.color_name_en) {
    acc[cur.color_name_en.toUpperCase()] = cur.color_name
  }
  return acc
}, {} as Record<string, string>)
