import React, { useEffect, useState } from "react";
import PriceCard from "../components/PriceCard";
import Wheel from "../components/Wheel";
import api from "../services/api";
import { getImageUrl } from "../services/servicesApi";
import LoadingWheel from "../components/LoadingWheel";
import { Popup } from "../base_components/Popup";
import { HelmetProvider } from "react-helmet-async";

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
  const [popupOpened, setPopupOpened] = useState(false);
  const [popupContent, setPopupContent] = useState<React.ReactNode>(null);
  const [popupTitle, setPopupTitle] = useState("");
  const [carouselItems, setCarouselItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("api/services/active");
        setServices(response.data);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to fetch services:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (popupOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [popupOpened]);

  useEffect(() => {
    const items = services.map((item, index) => (
      <PriceCard
        key={index}
        title={item.title}
        image={getImageUrl(item.id)}
        description={item.description}
        price={item.price}
        openPopupCallback={(content, title) => {
          setPopupContent(content);
          setPopupTitle(title ?? "");
          setPopupOpened(true);
        }}
        closePopupCallback={() => {
          setPopupOpened(false);
          setPopupContent(null);
          setPopupTitle("");
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
      className="max-w-full box-border py-8 w-full"
      style={{ minHeight: "calc(100vh - 224px)" }}
    >
      <HelmetProvider>
        {" "}
        <title>Prices</title>{" "}
      </HelmetProvider>
      <h1 className="text-3xl pb-6 text-primaryText font-bold text-center font-title">
        Our Prices
      </h1>
      {(!loading && <Wheel items={carouselItems} initialItemWidth={450} />) || (
        <LoadingWheel style={{ height: "calc(100vh - 124px)" }} />
      )}
      <Popup
        isOpen={popupOpened}
        title={popupTitle}
        onClose={onPopupClose}
        className="mobile:w-full narrow:w-full narrow:max-w-500px"
      >
        {popupContent}
      </Popup>
    </div>
  );
};

export default PricesPage;
