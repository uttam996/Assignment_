import { jsx as _jsx } from "react/jsx-runtime";
import { Badge } from "@/components/ui/badge";
export const columns = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.getValue("role");
            return (_jsx(Badge, { variant: role === "MANAGER" ? "default" : "outline", className: "px-3 py-1", children: role }));
        },
    },
    {
        accessorKey: "manager",
        header: "Manager",
        cell: ({ row }) => {
            const manager = row.original?.manager;
            return manager ? (_jsx("span", { className: "text-sm text-muted-foreground", children: manager.name })) : (_jsx("span", { className: "text-sm text-muted-foreground italic", children: "No Manager" }));
        },
    },
];
