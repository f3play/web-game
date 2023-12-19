export const parseType = (value: string) => {
  const MappingType = new Map<string, string>([
    ["1", "maruko"],
    ["2", "panda"],
    ["3", "boy"],
    ["4", "quby"],
    ["5", "dogee"],
    ["6", "shibafat"],
    ["7", "tobee"],
    ["8", "meowy"],
    ["9", "sir"],
  ])

  return MappingType.get(value)
}

export const parseRarity = (value: string) => {
  const MappingRarity = new Map<string, string>([
    ["1", "common"],
    ["2", "uncommon"],
    ["3", "rare"],
    ["4", "epic"],
    ["5", "legendary"],
  ])

  return MappingRarity.get(value)
}
