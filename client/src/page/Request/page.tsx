import { useRequestList } from "@/Hooks/ApiHooks/useRequestHook";
import { columns } from "./column";
import { DataTable } from "./date-table";
import { CreateRequestModal } from "./CreateRequest";
import { useUserStore } from "@/Store/store";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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

  const user = useUserStore((state: any) => state?.user);

  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto py-10 space-y-6">

      {/* Top Create Button */}
      <div className="flex justify-end">
        {user?.role === "EMPLOYEE" && <CreateRequestModal />}
      </div>

      {/* Table */}
      {isLoading ? (
        "loading .."
      ) : (
        <>
          <DataTable columns={columns} data={data?.data?.requests || []} />

          {/* Bottom Pagination */}
          <div className="pt-4 flex justify-center">
            <Pagination>
              <PaginationContent className="flex gap-2 justify-center">
                
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      page > 1 && setPagestate(page - 1, limit, "")
                    }
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                <p className="text-sm text-muted-foreground px-3">
                  Page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span>
                </p>

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < totalPages && setPagestate(page + 1, limit, "")
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

              </PaginationContent>
            </Pagination>
          </div>
        </>
      )}
    </div>
  );
};
