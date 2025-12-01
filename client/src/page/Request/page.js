import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRequestList } from "@/Hooks/ApiHooks/useRequestHook";
import { columns } from "./column";
import { DataTable } from "./date-table";
import { CreateRequestModal } from "./CreateRequest";
import { useUserStore } from "@/Store/store";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, } from "@/components/ui/pagination";
import { usePaginationHook } from "@/Hooks/usePaginationHook";
export const RequestList = () => {
    const { page, limit, setPagestate } = usePaginationHook({
        initpage: 1,
        initlimit: 10,
        initsearch: "",
    });
    const { data, isLoading } = useRequestList({
        page,
        limit,
        search: "",
    });
    const user = useUserStore((state) => state?.user);
    const total = data?.data?.total || 0;
    const totalPages = Math.ceil(total / limit);
    return (_jsxs("div", { className: "container mx-auto py-10 space-y-6", children: [_jsx("div", { className: "flex justify-end", children: user?.role === "EMPLOYEE" && _jsx(CreateRequestModal, {}) }), isLoading ? ("loading ..") : (_jsxs(_Fragment, { children: [_jsx(DataTable, { columns: columns, data: data?.data?.requests || [] }), _jsx("div", { className: "pt-4 flex justify-center", children: _jsx(Pagination, { children: _jsxs(PaginationContent, { className: "flex gap-2 justify-center", children: [_jsx(PaginationItem, { children: _jsx(PaginationPrevious, { onClick: () => page > 1 && setPagestate(page - 1, limit, ""), className: page === 1 ? "pointer-events-none opacity-50" : "" }) }), _jsxs("p", { className: "text-sm text-muted-foreground px-3", children: ["Page ", _jsx("span", { className: "font-medium", children: page }), " of", " ", _jsx("span", { className: "font-medium", children: totalPages })] }), _jsx(PaginationItem, { children: _jsx(PaginationNext, { onClick: () => page < totalPages && setPagestate(page + 1, limit, ""), className: page === totalPages
                                                ? "pointer-events-none opacity-50"
                                                : "" }) })] }) }) })] }))] }));
};
