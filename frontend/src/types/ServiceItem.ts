export default interface ServiceItem {
  id: number;
  title: string;
  description: string;
  price: string;
  isActive: boolean;
  image?: File | string; // Image can be a File or URL string
  ordinal?: number;
}
