import React, { useEffect, useState } from "react";
import PriceCard from "../components/PriceCard";
import Wheel from "../components/Wheel";
import api from "../services/api";
import { getImageUrl } from "../services/servicesApi";
import LoadingWheel from "../components/LoadingWheel";
import { Popup } from "../base_components/Popup";

interface ServiceItem {
  id: number;
  title: string;
  description: string;
  price: string;
  isActive: boolean;
}

const PricesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupOpened, setPopupOpened] = useState(true);
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("api/services/active");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const items = services.map((item, index) => (
      <PriceCard
        key={index}
        title={item.title}
        image={getImageUrl(item.id)}
        description={item.description}
        price={item.price}
        openPopupCallback={(form) => {
          setPopupContent(form);
          setPopupOpened(true);
        }}
        closePopupCallback={() => {
          setPopupOpened(false);
          setPopupContent(null);
        }}
      />
    ));
    setCarouselItems(items);
  }, [services]);

  const onPopupClose = () => {
    setPopupOpened(false);
  };

  return (
    <div
      className=" max-w-full px-5 box-border py-8 w-full"
      style={{ minHeight: "calc(100vh - 224px)" }}
    >
      <h1 className="text-3xl pb-6 text-primaryText font-bold text-center font-title">
        Our Prices
      </h1>
      {(!loading && <Wheel items={carouselItems} itemWidth={450} />) || (
        <LoadingWheel style={{ height: "calc(100vh - 124px)" }} />
      )}
      <Popup isOpen={popupOpened} title="Contact us" onClose={onPopupClose}>
        {popupContent}
      </Popup>
    </div>
  );
};

export default PricesPage;
