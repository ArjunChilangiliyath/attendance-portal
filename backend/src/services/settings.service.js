
import { settingsRepository } from '../repositories/settings.repository.js';

export const settingsService = {
  list: () => settingsRepository.list(),

  update: async (settings) => {
    await Promise.all(
      Object.entries(settings).map(([key, value]) =>
        settingsRepository.upsert(key, value)
      )
    );

    return settingsRepository.list();
  }
};
