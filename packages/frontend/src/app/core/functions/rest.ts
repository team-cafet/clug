export function cleanObjectForSending(elementToClean) {
  const cleanedElement = elementToClean;
  delete cleanedElement.createdAt;
  delete cleanedElement.updatedAt;
  delete cleanedElement.deletedAt;
  for (const props in cleanedElement) {
    if (cleanedElement[props] === null) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete cleanedElement[props];
    }
  }

  return cleanedElement;
}
