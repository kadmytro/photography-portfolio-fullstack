import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";
import Button from "../base_components/Button";
import ServiceListItem from "./ServiceListItem";
import ServiceItem from "../types/ServiceItem";

interface ServiceListProps {
  openPopupCallback?: (content: React.ReactNode, title?: string) => void;
  closePopupCallback?: () => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  openPopupCallback,
  closePopupCallback,
}) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState<ServiceItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cacheInvalidationKey, setCacheInvalidationKey] = useState(new Date().getTime());

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("api/services");
        setServices(response.data);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getPopupContent = (
    message: string,
    onConfirmCallback: React.MouseEventHandler<HTMLButtonElement> | undefined,
    onCancelCallback: React.MouseEventHandler<HTMLButtonElement> | undefined
  ): React.ReactNode => {
    return (
      <div className="px-4 pb-12 pt-4 min-h-200px narrow:min-w-400px max-w-lg text-center border-t-1 border-primaryText border-opacity-30 relative content-center">
        <p className="max-w-md">{message}</p>
        <div className="narrow:w-80 w-4/5 absolute right-1/2 translate-x-1/2 bottom-2 flex gap-4 justify-around">
          <Button
            buttonType="default"
            text="Yes"
            className="flex-1"
            onClick={onConfirmCallback}
          />
          <Button
            buttonType="danger"
            text="No"
            className="flex-1"
            onClick={onCancelCallback}
          />
        </div>
      </div>
    );
  };

  function updateService(service: ServiceItem): void {
    const isOld = services.some((s) => s.id === service.id);
    if (!isOld) {
      setNewService(null);
    }
    const updatedServices = isOld
      ? services.map((s) => (s.id === service.id ? service : s))
      : [...services, service];

    setCacheInvalidationKey(new Date().getTime());
    setServices(updatedServices);
  }

  const handleDelete = async (id: number) => {
    const deleteCallback = async () => {
      try {
        await api.delete(`api/services/${id}`);
        setServices(services.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Failed to delete service:", error);
      } finally {
        if (closePopupCallback) {
          closePopupCallback();
        }
      }
    };

    const popupContent = getPopupContent(
      `Are you sure you want to delete the service "${
        services.find((i) => i.id === id)?.title ?? ""
      }"?`,
      deleteCallback,
      closePopupCallback
    );

    if (openPopupCallback) {
      openPopupCallback(popupContent, "Please confirm the action");
    }
  };

  const handleAddNewService = () => {
    handleCancel();
    setNewService({
      id: -1,
      title: "",
      description: "",
      price: "",
      isActive: true,
    });
    setEditingServiceId(-1);

    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  const handleCancel = () => {
    setEditingServiceId(null);
    setNewService(null);
  };

  if (loading) {
    return <LoadingWheel className="flex-1" />;
  }

  return (
    <div className="max-w-3xl mx-auto mobile:p-1 narrow:p-2 wide:p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <ul className="space-y-4">
        {services.map((service) => (
          <ServiceListItem
            key={service.id}
            service={service}
            editingServiceId={editingServiceId}
            deleteService={handleDelete}
            setEditingServiceId={setEditingServiceId}
            updateService={updateService}
            cancelCallback={handleCancel}
            cacheInvalidationKey={cacheInvalidationKey}
          />
        ))}

        {newService && (
          <ServiceListItem
            key="newService"
            service={newService}
            editingServiceId={editingServiceId}
            setEditingServiceId={setEditingServiceId}
            updateService={updateService}
            cancelCallback={handleCancel}
            cacheInvalidationKey={cacheInvalidationKey}
          />
        )}
      </ul>
      <div className="flex justify-center mt-4">
        {!newService && (
          <Button
            text="+ Add new"
            buttonType="default"
            onClick={handleAddNewService}
            className="font-bold"
          ></Button>
        )}
      </div>
    </div>
  );
};

export default ServiceList;
