import { AppDataSource } from "../data-source";
import { Setting } from "../entity/Setting";

export async function getSetting(key: string): Promise<any | null> {
  const settingRepository = AppDataSource.getRepository(Setting);
  const setting = await settingRepository.findOne({ where: { key } });
  return setting ? setting.value : null;
}

export async function saveOrUpdateSetting(key: string, value: any): Promise<void> {
  const settingRepository = AppDataSource.getRepository(Setting);

  const existingSetting = await settingRepository.findOne({ where: { key } });
  if (existingSetting) {
    existingSetting.value = value;
    await settingRepository.save(existingSetting);
  } else {
    const newSetting = settingRepository.create({ key, value });
    await settingRepository.save(newSetting);
  }
}

export async function deleteSetting(key: string): Promise<void> {
  const settingRepository = AppDataSource.getRepository(Setting);
  await settingRepository.delete({ key });
}
