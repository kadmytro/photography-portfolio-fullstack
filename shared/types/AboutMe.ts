export interface AboutMe {
  title: string;
  text: string;
}

export const isValidAboutMe = (data: any): data is AboutMe => {
  return (
    (data.title === undefined || typeof data.title === "string") &&
    (data.text === undefined || typeof data.text === "string")
  );
};
