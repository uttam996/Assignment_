import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
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
    const user = useUserStore((state) => state.user);
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
        }
        catch (error) {
            toast.error(error?.response?.data?.message || error.message || "Something went wrong");
        }
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: setOpen, children: [_jsx(DialogTrigger, { children: _jsx(Button, { className: "bg-black text-white hover:bg-gray-900 h-9 px-4", children: "Create Request" }) }), _jsxs(DialogContent, { className: "max-w-md p-5", children: [_jsx(DialogHeader, { className: "pb-2", children: _jsx(DialogTitle, { className: "text-lg font-semibold", children: "Create New Request" }) }), _jsxs("div", { className: "space-y-3 mt-1", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { children: "Title" }), _jsx(Input, { className: "h-9", placeholder: "Enter title", value: createdata.title, onChange: (e) => setCreatedata({ ...createdata, title: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { children: "Description" }), _jsx(Textarea, { rows: 3, className: "resize-none", placeholder: "Enter description", value: createdata.description, onChange: (e) => setCreatedata({ ...createdata, description: e.target.value }) })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { children: "Assign To" }), _jsxs(Select, { value: createdata.assigned_to, onValueChange: (e) => setCreatedata({ ...createdata, assigned_to: e }), children: [_jsx(SelectTrigger, { className: "h-9", children: _jsx(SelectValue, { placeholder: "Select user" }) }), _jsx(SelectContent, { children: data?.data?.data
                                                    ?.filter((el) => el.id !== user.id)
                                                    .map((emp) => (_jsxs(SelectItem, { value: emp.id, children: [emp.name, " (", emp.email, ")"] }, emp.id))) })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { className: "w-full h-9 bg-black text-white hover:bg-gray-900", disabled: mutation.isPending, onClick: handleSubmit, children: mutation.isPending ? "Creating..." : "Create Request" }) })] })] })] }));
};
