"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

const STATUS_OPTIONS = [
  { label: "All", value: "__all__" },
  { label: "Initiated", value: "Initiated" },
  { label: "Quotation", value: "Quotation" },
  { label: "Approved", value: "Approved" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
  { label: "Invoiced", value: "Invoiced" },
];

export interface StatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="w-full max-w-xs">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
