export function checkFileTypeFromName(
  filename: string,
  authorizedExtensions: string[]
): null | string {
  for (const extension of authorizedExtensions) {
    if (filename.endsWith(extension)) {
      return extension;
    }
  }

  return null;
}
