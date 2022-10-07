/* Lowercase just first letter. With exceptions. Ugh. */
export function lowercaseKeys(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      // Certified G W O S S
      // TODO: Refactor me
      let formattedKey;
      if (key === 'ID') {
        formattedKey = 'id';
      } else {
        formattedKey = key.charAt(0).toLowerCase() + key.slice(1);
      }

      return [formattedKey, value];
    })
  );
}
