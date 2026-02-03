"use client";
import GalleryView from "@/modules/media/components/gallery-view";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { Textarea } from "@repo/ui/components/textarea";
import {
  CheckCircleIcon,
  ClipboardListIcon,
  DollarSignIcon,
  FileTextIcon,
  ImageIcon,
  MapPinIcon,
  PhoneIcon,
  PlayIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createJob } from "../actions/create.action";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

const tabs = [
  {
    id: "initiated",
    label: "Initiated",
    icon: UserIcon,
    description: "Basic job information and client details",
  },
  {
    id: "quotation",
    label: "Quotation",
    icon: FileTextIcon,
    description: "Job description, hours, and tasks",
  },
  {
    id: "approved",
    label: "Approved",
    icon: CheckCircleIcon,
    description: "Approval notes and confirmation",
  },
  {
    id: "in-progress",
    label: "In Progress",
    icon: PlayIcon,
    description: "Task management and updates",
  },
  {
    id: "completed",
    label: "Completed",
    icon: ImageIcon,
    description: "Completion photos and final details",
  },
  {
    id: "invoiced",
    label: "Invoiced",
    icon: DollarSignIcon,
    description: "Invoice details and billing information",
  },
];

export function NewJob() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("initiated");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<any>({
    jobTitle: "",
    address: {
      formattedAddress: "",
      latitude: 0,
      longitude: 0,
    },
    contactDetails: {
      phoneNumber: "",
      email: "",
      workPhoneNumber: "",
    },
    jobNumber: "",
    dueDate: undefined,
    description: "",
    estimatedHours: 0,
    photos: [],
    status: "Initiated",
    priority: "Medium",
    tasks: [],
    approvalNotes: "",
    invoiceDetails: "",
  });

  // Task management handlers
  const handleTaskChange = (idx: number, field: string, value: string) => {
    setFormData((prev: any) => {
      const updatedTasks = prev.tasks.map((task: any, i: number) =>
        i === idx ? { ...task, [field]: value } : task
      );
      return { ...prev, tasks: updatedTasks };
    });
  };

  const handleAddTask = () => {
    setFormData((prev: any) => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        {
          title: "",
          description: "",
          status: "Pending",
        },
      ],
    }));
  };

  const handleRemoveTask = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      tasks: prev.tasks.filter((_: any, i: number) => i !== idx),
    }));
  };

  // Handle changes for top-level fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle changes for nested address fields
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: { address: any }) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Handle changes for nested contactDetails fields
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: { contactDetails: any }) => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [name]: value,
      },
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image removal
  const handleImageRemove = (idx: number) => {
    setFormData((prev: { photos: any[] }) => ({
      ...prev,
      photos: prev.photos.filter((_: string, i: number) => i !== idx),
    }));
  };

  // Handle gallery select
  const handleGallerySelect = (selectedFiles: { url: string }[]) => {
    setFormData((prev: { photos: any }) => ({
      ...prev,
      photos: [...prev.photos, ...selectedFiles.map((f) => f.url)],
    }));
    setGalleryOpen(false);
  };

  // Reverse geocode to get address from lat/lng
  const getAddressFromLatLng = useCallback(
    async (lat: number, lng: number) => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      return "";
    },
    [GOOGLE_MAPS_API_KEY]
  );

  // When user clicks on map
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    const address = await getAddressFromLatLng(lat, lng);
    setFormData((prev: any) => ({
      ...prev,
      address: {
        ...prev.address,
        latitude: lat,
        longitude: lng,
        formattedAddress: address,
      },
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.jobTitle ||
      !formData.address.formattedAddress ||
      !formData.contactDetails.phoneNumber
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for createJob
      const payload = {
        ...formData,
        address: {
          ...formData.address,
          latitude: Number(formData.address.latitude),
          longitude: Number(formData.address.longitude),
        },
        contactDetails: {
          ...formData.contactDetails,
        },
        estimatedHours:
          formData.estimatedHours === undefined ||
          formData.estimatedHours === null
            ? undefined
            : Number(formData.estimatedHours),
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        tasks: formData.tasks,
        // Combine description with approval notes or invoice details based on context
        description:
          formData.approvalNotes ||
          formData.invoiceDetails ||
          formData.description,
      };

      await createJob(payload);
      toast.success("Job created successfully!");

      // Reset form
      setFormData({
        jobTitle: "",
        address: {
          formattedAddress: "",
          latitude: 0,
          longitude: 0,
        },
        contactDetails: {
          phoneNumber: "",
          email: "",
          workPhoneNumber: "",
        },
        jobNumber: "",
        dueDate: undefined,
        description: "",
        estimatedHours: 0,
        photos: [],
        status: "Initiated",
        priority: "Medium",
        tasks: [],
        approvalNotes: "",
        invoiceDetails: "",
      });

      setActiveTab("initiated");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create job. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Maps setup
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  // Default center
  const defaultCenter = {
    lat: formData.address.latitude || 24.8607,
    lng: formData.address.longitude || 67.0011,
  };

  const addressInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoaded || !addressInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      addressInputRef.current,
      {
        types: ["geocode"],
        componentRestrictions: { country: "pk" },
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) return;
      setFormData((prev: any) => ({
        ...prev,
        address: {
          ...prev.address,
          formattedAddress: place.formatted_address || "",
          latitude: place.geometry?.location?.lat() ?? 0,
          longitude: place.geometry?.location?.lng() ?? 0,
        },
      }));
    });
  }, [isLoaded]);

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "initiated":
        return (
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="jobTitle">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="jobNumber">Job Number</Label>
                  <Input
                    id="jobNumber"
                    name="jobNumber"
                    value={formData.jobNumber}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    name="priority"
                    value={formData.priority}
                    onValueChange={(value) =>
                      handleSelectChange("priority", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <MapPinIcon className="h-5 w-5 text-cyan-600" />
                Address
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="formattedAddress">
                    Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="formattedAddress"
                    name="formattedAddress"
                    ref={addressInputRef}
                    value={formData.address.formattedAddress}
                    onChange={handleAddressChange}
                    required
                    placeholder="Start typing address..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    value={formData.address.latitude}
                    onChange={handleAddressChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    value={formData.address.longitude}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
              <div className="mt-4" style={{ height: 250 }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "250px" }}
                    center={{
                      lat: formData.address.latitude || defaultCenter.lat,
                      lng: formData.address.longitude || defaultCenter.lng,
                    }}
                    zoom={formData.address.latitude ? 15 : 5}
                    onClick={handleMapClick}
                  >
                    {formData.address.latitude &&
                      formData.address.longitude && (
                        <Marker
                          position={{
                            lat: formData.address.latitude,
                            lng: formData.address.longitude,
                          }}
                        />
                      )}
                  </GoogleMap>
                ) : (
                  <div>Loading map...</div>
                )}
                <div className="text-xs text-muted-foreground mt-2">
                  Click on the map to select a location
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <PhoneIcon className="h-5 w-5 text-cyan-600" />
                Contact Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.contactDetails.phoneNumber}
                    onChange={handleContactChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.contactDetails.email}
                    onChange={handleContactChange}
                  />
                </div>
                <div className="grid gap-2 sm:col-span-2">
                  <Label htmlFor="workPhoneNumber">Work Phone Number</Label>
                  <Input
                    id="workPhoneNumber"
                    name="workPhoneNumber"
                    value={formData.contactDetails.workPhoneNumber}
                    onChange={handleContactChange}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "quotation":
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the job requirements and scope..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    name="estimatedHours"
                    type="number"
                    value={formData.estimatedHours ?? ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={
                      formData.dueDate
                        ? typeof formData.dueDate === "string"
                          ? formData.dueDate
                          : formData.dueDate.toISOString().split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardListIcon className="h-5 w-5 text-cyan-600" />
                  Tasks
                </h3>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddTask}
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              {formData.tasks.length === 0 && (
                <div className="text-muted-foreground text-sm">
                  No tasks added yet.
                </div>
              )}
              <div className="space-y-4">
                {formData.tasks.map((task: any, idx: number) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-muted/10 relative"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveTask(idx)}
                      aria-label="Remove task"
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`task-title-${idx}`}>Title</Label>
                        <Input
                          id={`task-title-${idx}`}
                          name="title"
                          value={task.title}
                          onChange={(e) =>
                            handleTaskChange(idx, "title", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`task-status-${idx}`}>Status</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            handleTaskChange(idx, "status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label htmlFor={`task-desc-${idx}`}>Description</Label>
                      <Textarea
                        id={`task-desc-${idx}`}
                        name="description"
                        value={task.description}
                        onChange={(e) =>
                          handleTaskChange(idx, "description", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "approved":
        return (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="approvalNotes">Approval Notes</Label>
              <Textarea
                id="approvalNotes"
                name="approvalNotes"
                value={formData.approvalNotes}
                onChange={handleChange}
                rows={6}
                placeholder="Add approval notes, client feedback, or any special instructions..."
              />
            </div>
          </div>
        );

      case "in-progress":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ClipboardListIcon className="h-5 w-5 text-cyan-600" />
                Task Management
              </h3>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Manage and update task progress
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddTask}
                >
                  <PlusIcon className="h-4 w-4 mr-1" /> Add Task
                </Button>
              </div>
              {formData.tasks.length === 0 && (
                <div className="text-muted-foreground text-sm">
                  No tasks added yet.
                </div>
              )}
              <div className="space-y-4">
                {formData.tasks.map((task: any, idx: number) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-muted/10 relative"
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveTask(idx)}
                      aria-label="Remove task"
                    >
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`task-title-${idx}`}>Title</Label>
                        <Input
                          id={`task-title-${idx}`}
                          name="title"
                          value={task.title}
                          onChange={(e) =>
                            handleTaskChange(idx, "title", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`task-status-${idx}`}>Status</Label>
                        <Select
                          value={task.status}
                          onValueChange={(value) =>
                            handleTaskChange(idx, "status", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label htmlFor={`task-desc-${idx}`}>Description</Label>
                      <Textarea
                        id={`task-desc-${idx}`}
                        name="description"
                        value={task.description}
                        onChange={(e) =>
                          handleTaskChange(idx, "description", e.target.value)
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "completed":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ImageIcon className="h-5 w-5 text-cyan-600" />
                Completion Photos
              </h3>
              <div className="grid gap-2">
                <Label>Photos</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.photos.map((img: string, idx: number) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`uploaded-${idx}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        onClick={() => handleImageRemove(idx)}
                        aria-label="Remove image"
                      >
                        <Trash2Icon className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setGalleryOpen(true)}
                    className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-cyan-400 rounded hover:bg-cyan-50 transition"
                    aria-label="Add image"
                  >
                    <PlusIcon className="w-6 h-6 text-cyan-600" />
                  </button>
                </div>
              </div>
              <GalleryView
                modal={true}
                activeTab="library"
                onUseSelected={handleGallerySelect}
                modalOpen={galleryOpen}
                setModalOpen={setGalleryOpen}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Completion Notes</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add completion notes, final details, or any observations..."
              />
            </div>
          </div>
        );

      case "invoiced":
        return (
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="invoiceDetails">Invoice Details</Label>
              <Textarea
                id="invoiceDetails"
                name="invoiceDetails"
                value={formData.invoiceDetails}
                onChange={handleChange}
                rows={6}
                placeholder="Add invoice details, billing information, payment terms, etc..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1200px] h-[90vh] flex flex-col p-0">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-0">
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>
              Navigate through the tabs to complete all job details. Required
              fields are marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 overflow-hidden">
            {/* Left Sidebar - Tabs */}
            <div className="w-64 flex-shrink-0 border-r bg-gray-50/50 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-cyan-100 text-cyan-700 border border-cyan-200"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{tab.label}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-6">
                {renderTabContent()}
              </div>

              <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-gray-50/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      disabled={isSubmitting}
                    >
                      <XIcon className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    {activeTab !== "initiated" && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const currentIndex = tabs.findIndex(
                            (tab) => tab.id === activeTab
                          );
                          if (currentIndex > 0) {
                            setActiveTab(tabs[currentIndex - 1].id);
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        Previous
                      </Button>
                    )}
                    {activeTab !== "invoiced" ? (
                      <Button
                        type="button"
                        onClick={() => {
                          const currentIndex = tabs.findIndex(
                            (tab) => tab.id === activeTab
                          );
                          if (currentIndex < tabs.length - 1) {
                            setActiveTab(tabs[currentIndex + 1].id);
                          }
                        }}
                        disabled={isSubmitting}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        {isSubmitting ? "Creating..." : "Create Job"}
                      </Button>
                    )}
                  </div>
                </div>
              </DialogFooter>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
