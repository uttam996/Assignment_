import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ApproveOrReject, useCloseRequest, useRequestLog, } from "@/Hooks/ApiHooks/useRequestHook";
import { useUserStore } from "@/Store/store";
import { useState } from "react";
import { toast } from "sonner";
export const columns = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            const color = status === "CREATED"
                ? "bg-yellow-500/20 text-yellow-700"
                : status === "APPROVED"
                    ? "bg-blue-500/20 text-blue-700"
                    : status === "REJECTED"
                        ? "bg-red-500/20 text-red-700"
                        : "bg-green-500/20 text-green-700";
            return (_jsx("span", { className: `px-2 py-1 rounded text-xs font-semibold ${color}`, children: status }));
        },
    },
    {
        header: "Assigned To",
        accessorKey: "assigned_to",
        cell: ({ row }) => row.original.assigned_to?.name || "-",
    },
    {
        header: "Created By",
        accessorKey: "created_by",
        cell: ({ row }) => row.original.created_by?.name || "-",
    },
    {
        header: "Manager",
        accessorKey: "manager",
        cell: ({ row }) => row.original.manager?.name || "-",
    },
    {
        id: "created_at",
        header: "Created At",
        cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
    },
    // ⭐ ACTION COLUMN (Dynamic)
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => _jsx(ActionCell, { row: row }),
    },
    {
        id: "logs",
        header: "Logs",
        cell: ({ row }) => _jsx(ViewLogModal, { row: row }),
    },
];
function ActionCell(row) {
    let status = row?.row?.original?.status;
    const { mutateAsync, isPending } = ApproveOrReject();
    const { mutateAsync: closeMutate, isPending: isPendingClose } = useCloseRequest();
    const user = useUserStore((state) => state.user);
    const isassignedManager = user?.id === row?.row?.original?.manager?.id;
    const isassignedUser = user?.id === row?.row?.original?.assigned_to?.id;
    const handeleApproveOrReject = async (status) => {
        try {
            const data = {
                request_id: row?.row?.original?.id,
                status,
            };
            await mutateAsync(data);
        }
        catch (error) {
            return toast.error(error?.response?.data?.message ||
                error.message ||
                "Something went wrong");
        }
    };
    const closeRequest = async (data) => {
        try {
            await closeMutate(data);
            toast.success("Request Closed");
        }
        catch (error) {
            return toast.error(error?.response?.data?.message ||
                error.message ||
                "Something went wrong");
        }
    };
    return (_jsxs("div", { className: "flex gap-2", children: [status === "CREATED" && isassignedManager && (_jsxs(_Fragment, { children: [_jsx(Button, { size: "sm", onClick: () => handeleApproveOrReject("APPROVED"), disabled: isPending, className: "bg-green-600 text-white hover:bg-green-700", children: "Approve" }), _jsx(Button, { onClick: () => handeleApproveOrReject("REJECTED"), disabled: isPending, size: "sm", className: "bg-red-600 text-white hover:bg-red-700", children: "Reject" })] })), status === "APPROVED" && isassignedUser && (_jsx(Button, { size: "sm", className: "bg-purple-600 text-white hover:bg-purple-700", onClick: () => closeRequest({ request_id: row?.row?.original?.id }), disabled: isPendingClose, children: "Close" })), (status === "REJECTED" || status === "CLOSED") && (_jsx("span", { className: "text-muted-foreground text-sm italic", children: "No Actions" }))] }));
}
export const ViewLogModal = ({ row }) => {
    const [open, setOpen] = useState(false);
    const [requestId, setRequestId] = useState("");
    // Call API only when open === true and requestId is set
    const { data: logs } = useRequestLog(requestId, open && !!requestId);
    const handleOpen = () => {
        setRequestId(row.original.id); // set id first
        setOpen(true); // then open modal
    };
    const handleClose = () => {
        setOpen(false);
        setRequestId(""); // clear so API won't call again
    };
    const recentLogs = logs?.data?.logs || [];
    return (_jsxs(Dialog, { open: open, onOpenChange: (isOpen) => {
            if (!isOpen)
                handleClose();
        }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsx(Button, { variant: "outline", onClick: handleOpen, children: "View Log" }) }), _jsxs(DialogContent, { className: "max-w-md", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: "Request Logs" }) }), _jsxs("div", { className: "space-y-4 mt-2", children: [recentLogs?.map((log) => (_jsxs("div", { className: "rounded-md border p-3 bg-muted/20", children: [_jsx("div", { className: "font-semibold", children: log.title }), _jsx("div", { className: "text-sm text-muted-foreground", children: log.description }), _jsx(Separator, { className: "my-2" }), _jsxs("div", { className: "text-xs flex justify-between text-muted-foreground", children: [_jsxs("span", { children: ["By: ", _jsx("b", { children: log.created_by })] }), _jsx("span", { children: new Date(log.created_at).toLocaleString() })] })] }, log.id))), recentLogs.length === 0 && (_jsx("p", { className: "text-center text-muted-foreground text-sm", children: "No logs found." }))] })] })] }));
};
