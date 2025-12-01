import { useState } from "react";


export const usePaginationHook = ({
  initpage,
  initlimit,
  initsearch,
  
}:{
  initpage?:number,
  initlimit?:number,
  initsearch?:string,
}) => {
  const [page , setPage] = useState(initpage || 1);
  const [limit , setLimit] = useState(initlimit || 10);
  const [search , setSearch] = useState(initsearch || "");
  
const setPagestate = (page: number, limit: number, search: string) => {
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
}