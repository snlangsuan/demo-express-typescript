export const camelCase = (word: string): string => {
  const str = word
    .toLowerCase()
    .replace(/[^A-Za-z0-9]/g, ' ')
    .split(' ')
    .reduce((result, word) => result + capitalize(word.toLowerCase()))
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export const capitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
}
