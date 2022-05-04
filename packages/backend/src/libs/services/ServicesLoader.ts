import serviceConfig from '../../config/services';

export class ServicesLoader {
  public static async load() {
    for (const loadableService of serviceConfig.loadbleServices) {
      await loadableService.getInstance().load();
    }
  }
  
}
