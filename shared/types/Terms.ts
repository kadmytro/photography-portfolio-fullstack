export interface Terms {
    title: string;
    text: string;
  }
  
  export const isValidTerms = (data: any): data is Terms => {
    return (
      (data.title === undefined || typeof data.title === "string") &&
      (data.text === undefined || typeof data.text === "string")
    );
  };
  