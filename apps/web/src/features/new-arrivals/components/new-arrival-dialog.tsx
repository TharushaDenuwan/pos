"use client";

import GalleryView from "@/modules/media/components/gallery-view";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/components/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/components/select";
import { Switch } from "@repo/ui/components/switch";
import { Textarea } from "@repo/ui/components/textarea";
import { IconPhoto, IconSparkles, IconStar, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createNewArrival } from "../actions/create.action";
import { insertNewArrivalSchema, type InsertNewArrival } from "../schemas";

interface NewArrivalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = ["Menswear", "Electronics", "Sale", "Collection"];

export function NewArrivalDialog({ open, onOpenChange }: NewArrivalDialogProps) {
  const [loading, setLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const router = useRouter();

  const form = useForm<InsertNewArrival>({
    resolver: zodResolver(insertNewArrivalSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discount: 0,
      image: "",
      images: [],
      category: "Menswear",
      isFeatured: false,
      isActive: true,
    },
  });

  // Remove image from gallery
  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    form.setValue("images", newImages);

    // If removing the first image, update the main cover image
    if (index === 0 && newImages.length > 0) {
      form.setValue("image", newImages[0]);
    } else if (newImages.length === 0) {
      form.setValue("image", "");
    }
  };

  const onSubmit = async (data: InsertNewArrival) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        discount: Number(data.discount || 0),
        image: data.image,
        images: data.images || [],
        category: data.category,
        isFeatured: data.isFeatured || false,
        isActive: data.isActive
      };
      await createNewArrival(payload);
      toast.success("New arrival added successfully");
      onOpenChange(false);
      form.reset();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to add new arrival");
    } finally {
      setLoading(false);
    }
  };

  const images = form.watch("images") || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-2">
              <IconSparkles className="w-6 h-6 text-primary" />
              Add New Arrival
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Product Details */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest">Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Premium Leather Jacket" {...field} value={field.value ?? ""} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest">Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "Menswear"}>
                          <FormControl>
                            <SelectTrigger className="h-12 rounded-xl">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest">Price ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-black uppercase tracking-widest">Discount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} value={field.value ?? ""} onChange={(e) => field.onChange(Number(e.target.value))} className="h-12 rounded-xl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-black uppercase tracking-widest">Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe the product features and benefits..." {...field} value={field.value ?? ""} className="rounded-xl min-h-[100px] bg-secondary/10 border-none" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Image Gallery */}
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-black uppercase tracking-widest flex items-center justify-between">
                      <span>Product Images</span>
                      <span className="text-[10px] font-normal text-muted-foreground">First image is the cover</span>
                    </FormLabel>
                    <div className="grid grid-cols-4 gap-3">
                      {/* Add Image Button */}
                      <button
                        type="button"
                        onClick={() => setGalleryOpen(true)}
                        className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
                      >
                        <IconPhoto className="text-muted-foreground group-hover:text-primary w-8 h-8" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Add</span>
                      </button>

                      {/* Image Previews */}
                      {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-border group">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />

                          {/* Delete Button */}
                          <button
                            type="button"
                            className="absolute top-1 right-1 p-1.5 bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            onClick={() => removeImage(idx)}
                          >
                            <IconTrash size={14} />
                          </button>

                          {/* Cover Badge */}
                          {idx === 0 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                              <span className="text-[9px] font-black uppercase text-white tracking-widest">Cover</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-yellow-200 dark:border-yellow-800">
                      <div className="space-y-0.5 flex items-center gap-2">
                        <IconStar size={18} className="text-yellow-600 fill-yellow-500" />
                        <FormLabel className="text-xs font-black uppercase tracking-widest">Featured Product</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 p-4 bg-secondary/5">
                      <div className="space-y-0.5">
                        <FormLabel className="text-xs font-black uppercase tracking-widest">Active Status</FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value ?? true}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading} size="lg" className="w-full h-14 rounded-xl font-black italic uppercase tracking-widest text-lg shadow-xl shadow-primary/20">
                  {loading ? "SAVING..." : "Create New Arrival"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <GalleryView
        modal={true}
        modalOpen={galleryOpen}
        setModalOpen={setGalleryOpen}
        onUseSelected={(files) => {
          const currentImages = form.getValues("images") || [];
          const newUrls = files.map(f => f.url);
          const combined = [...currentImages, ...newUrls];

          form.setValue("images", combined, { shouldDirty: true, shouldValidate: true });

          // Set first image as cover if not already set
          if (!form.getValues("image") && combined.length > 0) {
            form.setValue("image", combined[0]);
          }

          setGalleryOpen(false);
          toast.success(`${files.length} image(s) added to gallery`);
        }}
      />
    </>
  );
}
