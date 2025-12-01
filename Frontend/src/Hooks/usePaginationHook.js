import { useState } from "react";
export const usePaginationHook = ({ initpage, initlimit, initsearch, }) => {
    const [page, setPage] = useState(initpage || 1);
    const [limit, setLimit] = useState(initlimit || 10);
    const [search, setSearch] = useState(initsearch || "");
    const setPagestate = (page, limit, search) => {
        setPage(page);
        setLimit(limit);
        setSearch(search);
    };
    return {
        page,
        limit,
        search,
        setPagestate
    };
};
