import { useUserList } from "@/Hooks/ApiHooks/useUserHook";
import { columns } from "./column";
import { DataTable } from "./date-table";

export const Userlist = () => {
  const { data, isLoading } = useUserList({});

  console.log(data);

  return (
    <div className="container mx-auto py-10 space-y-6">
      {isLoading ? (
        <div className="flex justify-center py-20 text-lg font-medium animate-pulse">
          Loading users...
        </div>
      ) : (
        <DataTable columns={columns} data={data?.data?.data || []} />
      )}
    </div>
  );
};
