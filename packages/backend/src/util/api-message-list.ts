export const API_MESSAGE_LIST = {
  GENERAL: {
    UNEXPECTED_ERROR: (error: any): string => `Unexpected error: ${error}`,
    NO_RESOURCE_FOUND_WITH_ID: (id: number): string =>
      `Resource with ${id} does not exist`,
    NO_RESOURCE_FOUND: 'This resource does not exist',
    NO_PERMISSION_TO_MODIFY:
      'You do not have permission to modify this resource',
  },
};
