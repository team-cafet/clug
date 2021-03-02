export class APIMessageList {
  public static UNEXPECTED_ERROR = 
    (error: any): string => `Unexpected error: ${error}`;
    public static NO_RESOURCE_FOUND_WITH_ID = (id: number): string =>
    `Resource with ${id} does not exist`;
  public static NO_RESOURCE_FOUND = 'This resource does not exist';
  public static NO_PERMISSION_TO_MODIFY = 'You do not have permission to modify this resource';
}