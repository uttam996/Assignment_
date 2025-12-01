import { jsx as _jsx } from "react/jsx-runtime";
import { useUserList } from "@/Hooks/ApiHooks/useUserHook";
import { columns } from "./column";
import { DataTable } from "./date-table";
export const Userlist = () => {
    const { data, isLoading } = useUserList({});
    console.log(data);
    return (_jsx("div", { className: "container mx-auto py-10 space-y-6", children: isLoading ? (_jsx("div", { className: "flex justify-center py-20 text-lg font-medium animate-pulse", children: "Loading users..." })) : (_jsx(DataTable, { columns: columns, data: data?.data?.data || [] })) }));
};
