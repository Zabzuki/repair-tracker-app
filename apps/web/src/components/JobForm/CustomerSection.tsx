import { useState } from "react";
import { Customer, CreateCustomerInput } from "@garage/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

type Props = {
  customers: Customer[];
  selectedCustomerId: string;
  onChange: (id: string) => void;
  onAddCustomer: (input: CreateCustomerInput) => Customer;
};

export function CustomerSection({
  customers,
  selectedCustomerId,
  onChange,
  onAddCustomer,
}: Props) {
  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = () => {
    if (!name || !phone) return;
    const customer = onAddCustomer({ name, phone });
    onChange(customer.id);
    setName("");
    setPhone("");
    setShowNew(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase">
        Customer
      </h3>

      {!showNew ? (
        <div className="space-y-3">
          <Select value={selectedCustomerId} onValueChange={onChange}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={() => setShowNew(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Customer
          </Button>
        </div>
      ) : (
        <div className="space-y-3 p-4 bg-secondary rounded-lg">
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <Label>Phone *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNew(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              className="flex-1"
              disabled={!name || !phone}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
