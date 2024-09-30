export interface Settings {
  homeMaxPhotos?: number;
  galleryMaxPhotos?: number;
  gallerySelectedCategories?: (number | string)[];
}

export const isValidSettingsObject = (settings: any): settings is Settings => {
  return (
    typeof settings.homeMaxPhotos === "number" &&
    typeof settings.galleryMaxPhotos == "number" &&
    Array.isArray(settings.gallerySelectedCategories) &&
    settings.gallerySelectedCategories.length > 0
  );
};
