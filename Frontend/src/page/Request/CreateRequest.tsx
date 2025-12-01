import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRequestCreate } from "@/Hooks/ApiHooks/useRequestHook";
import { useUserList } from "@/Hooks/ApiHooks/useUserHook";
import { useUserStore } from "@/Store/store";
import { useState } from "react";
import { toast } from "sonner";

export const CreateRequestModal = () => {
  const [open, setOpen] = useState(false);

  const mutation = useRequestCreate();
  const { data } = useUserList({ role: "EMPLOYEE" });
  const user = useUserStore((state: any) => state.user);

  const [createdata, setCreatedata] = useState({
    title: "",
    description: "",
    assigned_to: "",
  });

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(createdata);
      toast.success("Request created successfully");

      setCreatedata({
        title: "",
        description: "",
        assigned_to: "",
      });

      setOpen(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-black text-white hover:bg-gray-900 h-9 px-4">
          Create Request
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md p-5">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-semibold">
            Create New Request
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-1">
          {/* Title */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              className="h-9"
              placeholder="Enter title"
              value={createdata.title}
              onChange={(e) =>
                setCreatedata({ ...createdata, title: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              rows={3}
              className="resize-none"
              placeholder="Enter description"
              value={createdata.description}
              onChange={(e) =>
                setCreatedata({ ...createdata, description: e.target.value })
              }
            />
          </div>

          {/* Assign To */}
          <div className="space-y-1">
            <Label>Assign To</Label>
            <Select
              value={createdata.assigned_to}
              onValueChange={(e) =>
                setCreatedata({ ...createdata, assigned_to: e })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {data?.data?.data
                  ?.filter((el: any) => el.id !== user.id)
                  .map((emp: any) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              className="w-full h-9 bg-black text-white hover:bg-gray-900"
              disabled={mutation.isPending}
              onClick={handleSubmit}
            >
              {mutation.isPending ? "Creating..." : "Create Request"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

