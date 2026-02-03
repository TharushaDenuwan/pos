"use client";
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
import { Textarea } from "@repo/ui/components/textarea";
import { PlusIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createWorker } from "../actions/create.action";
import { InsertWorker } from "../schemas";

export function NewWorker() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InsertWorker>({
    name: "",
    email: "",
    phoneNumber: "",
    availability: "Full Time",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createWorker(formData);
      toast.success("Worker created successfully!");
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        availability: "Full Time",
        notes: "",
      });
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create worker. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New Worker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Create New Worker</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new worker. Required fields are
              marked with *.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-grow overflow-y-auto px-8 mt-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="availability">Availability</Label>
                <select
                  id="availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="On Call">On Call</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex-shrink-0 mt-6 px-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              <XIcon className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              {isSubmitting ? "Creating..." : "Create Worker"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
