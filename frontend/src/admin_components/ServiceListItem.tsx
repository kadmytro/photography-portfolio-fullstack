import React, { useEffect, useState } from "react";
import LoadingWheel from "../components/LoadingWheel";
import ImageUploader from "../base_components/ImageUploader";
import { getImageUrl } from "../services/servicesApi";
import Input from "../base_components/Input";
import api from "../services/api";
import TextArea from "../base_components/TextArea";
import Button from "../base_components/Button";
import ServiceItem from "../types/ServiceItem";

interface ServiceListItemProps {
  service: ServiceItem;
  editingServiceId: number | null;
  setEditingServiceId: (serviceId: React.SetStateAction<number | null>) => void;
  deleteService?: (id: number) => Promise<void> | null;
  updateService: (service: ServiceItem) => void;
  cancelCallback: () => void;
  cacheInvalidationKey?: number;
}

const ServiceListItem: React.FC<ServiceListItemProps> = ({
  service,
  editingServiceId,
  setEditingServiceId,
  deleteService = null,
  updateService,
  cancelCallback,
  cacheInvalidationKey,
}) => {
  const isEditingService = editingServiceId === service.id;
  const isNewService = service.id === -1;
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    isEditingService ? service : null
  );
  const [saving, setSaving] = useState(false);
  const imageChangedCallback = (file?: File) => {
    if (editingService) {
      setEditingService({ ...editingService, image: file });
    }
  };

  const handleCancel = () => {
    setEditingServiceId(null);
    setError(null);
    cancelCallback();
  };

  const handleEdit = () => {
    if (editingServiceId === service.id) {
      handleCancel();
      return;
    }
    handleCancel();
    setEditingServiceId(service.id);
  };

  const handleDelete = () => {
    if (deleteService) {
      deleteService(service.id);
    }
  };

  const handleToggleActive = () => {
    if (editingService) {
      setEditingService({
        ...editingService,
        isActive: !editingService.isActive,
      });
    }
  };

  useEffect(() => {
    if (editingServiceId === service.id) {
      setEditingService(service);
    } else if (!saving) {
      setEditingService(null);
    }
  }, [editingServiceId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (editingService) {
      setEditingService({ ...editingService, [name]: value });
    }
  };

  const handleSave = async () => {
    if (!editingService || editingService.title.trim() === "") {
      setError("Service title cannot be empty."); //TODO CHECKS FOR ALL THE FIELDS TO BE FILLED
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", editingService.title);
      formData.append("description", editingService.description);
      formData.append("price", editingService.price);
      formData.append("isActive", String(editingService.isActive));
      formData.append("ordinal", editingService.ordinal?.toString() ?? "");
      if (editingService.image && editingService.image instanceof File) {
        formData.append("image", editingService.image);
      }

      if (editingService.id === -1) {
        const response = await api.post(`api/services/`, formData);
        updateService({ ...editingService, id: response.data });
      } else {
        await api.put(`api/services/${editingService.id}`, formData);
        updateService(editingService);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to update service:", error);
      }
    } finally {
      setSaving(false);
      setEditingService(null);
      setEditingServiceId(null);
    }
  };

  return (
    <li
      key={service.id}
      className={`p-4 narrow:max-w-lg wide:max-w-4xl rounded relative shadow bg-card text-cardText ${
        isEditingService ? "pt-10" : ""
      }`}
    >
      {
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          {saving && (
            <div className="absolute z-20 inset-0 bg-primary bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
              <LoadingWheel />
            </div>
          )}
          <div className="flex mobile:flex-col wide:flex-row justify-between narrow:gap-2 items-center">
            <div className="flex-1 w-full min-w-200px">
              <ImageUploader
                initialSource={
                  isNewService
                    ? null
                    : getImageUrl(service.id, cacheInvalidationKey)
                }
                editing={!!editingService}
                imageChangeCallback={imageChangedCallback}
                maxFileSize={10}
              />
            </div>
            <div className="flex-1 space-y-2 w-full px-4">
              {!isNewService && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <div onClick={handleEdit} data-tooltip="Edit the service">
                    <div className="svg-mask edit-icon w-7 h-7 bg-cardText right-0 cursor-pointer hover:scale-125 transition-all" />
                  </div>
                  <div onClick={handleDelete} data-tooltip="Delete the service">
                    <div className="svg-mask delete-icon w-7 h-7 bg-red-700 right-6 top-0 cursor-pointer hover:scale-125 transition-all" />
                  </div>
                </div>
              )}
              <Input
                type="text"
                name="title"
                label="Title"
                readOnly={!editingService}
                value={editingService ? editingService.title : service.title}
                onChange={handleChange}
              />
              <TextArea
                label="Description"
                name="description"
                readOnly={!editingService}
                value={
                  editingService
                    ? editingService?.description
                    : service.description
                }
                onChange={handleChange}
                className="min-h-200px"
              />
              <Input
                type="text"
                name="price"
                label="Price"
                readOnly={!editingService}
                value={editingService ? editingService?.price : service.price}
                onChange={handleChange}
              />
              <Input
                type="number"
                name="ordinal"
                label="Ordinal"
                readOnly={!editingService}
                value={
                  editingService ? editingService.ordinal : service.ordinal
                }
                onChange={handleChange}
              />
              <div className="mb-4">
                <input
                  type="checkbox"
                  className={isEditingService ? "cursor-pointer" : ""}
                  checked={
                    editingService ? editingService?.isActive : service.isActive
                  }
                  readOnly={!isEditingService}
                  onChange={handleToggleActive}
                  id="isActive"
                />
                <label
                  htmlFor="isActive"
                  className={isEditingService ? "ml-2 cursor-pointer" : "ml-2"}
                >
                  Active
                </label>
              </div>

              <div
                className="justify-end space-x-2"
                style={{
                  display: editingService ? "flex" : "none",
                }}
              >
                <Button
                  buttonType="normal"
                  onClick={handleCancel}
                  text="Cancel"
                ></Button>
                <Button
                  buttonType="default"
                  onClick={handleSave}
                  text="Save"
                ></Button>
              </div>
            </div>
          </div>
        </>
      }
    </li>
  );
};

export default ServiceListItem;
