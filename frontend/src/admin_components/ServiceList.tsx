import React, { useEffect, useState } from "react";
import api from "../services/api";
import LoadingWheel from "../components/LoadingWheel";
import Button from "../base_components/Button";
import ServiceListItem from "./ServiceListItem";
import ServiceItem from "../types/ServiceItem";

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState<ServiceItem | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  function updateService(service: ServiceItem): void {
    const isOld = services.some((s) => s.id === service.id);
    if (!isOld) {
      setNewService(null);
    }
    const updatedServices = isOld
      ? services.map((s) => (s.id === service.id ? service : s))
      : [...services, service];

    setServices(updatedServices);
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await api.delete(`api/services/${id}`);
        setServices(services.filter((service) => service.id !== id));
      } catch (error) {
        console.error("Failed to delete service:", error);
      }
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
    return <LoadingWheel />;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
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
