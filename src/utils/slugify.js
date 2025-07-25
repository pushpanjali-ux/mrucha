export const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
