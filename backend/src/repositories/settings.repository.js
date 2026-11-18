
import { prisma } from '../config/database.js';

export const settingsRepository = {
  // Retrieve all system settings, ordered by key
  list: () =>
    prisma.systemSetting.findMany({
      orderBy: {
        key: 'asc',
      },
    }),

  // Create a setting or update its existing value
  upsert: (key, value) =>
    prisma.systemSetting.upsert({
      where: {
        key,
      },

      create: {
        key,
        value,
      },

      update: {
        value,
      },
    }),
};
