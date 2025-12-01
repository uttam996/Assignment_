import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  ApproveOrReject,
  useCloseRequest,
  useRequestLog,
} from "@/Hooks/ApiHooks/useRequestHook";
import { useUserStore } from "@/Store/store";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { toast } from "sonner";

export const columns: ColumnDef<any>[] = [
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
      const color =
        status === "CREATED"
          ? "bg-yellow-500/20 text-yellow-700"
          : status === "APPROVED"
          ? "bg-blue-500/20 text-blue-700"
          : status === "REJECTED"
          ? "bg-red-500/20 text-red-700"
          : "bg-green-500/20 text-green-700";

      return (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
          {status}
        </span>
      );
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
    cell: ({ row }) => <ActionCell row={row} />,
  },
  {
    id: "logs",
    header: "Logs",
    cell: ({ row }) => <ViewLogModal row={row} />,
  },
];

function ActionCell(row: any) {
  let status = row?.row?.original?.status;
  const { mutateAsync, isPending } = ApproveOrReject();
  const { mutateAsync: closeMutate, isPending: isPendingClose } =
    useCloseRequest();

const user = useUserStore((state: any) => state.user);
const isassignedManager = user?.id === row?.row?.original?.manager?.id;
const isassignedUser = user?.id === row?.row?.original?.assigned_to?.id;

  const handeleApproveOrReject = async (status: string) => {
    try {
      const data = {
        request_id: row?.row?.original?.id,
        status,
      };
      await mutateAsync(data);
    } catch (error: any) {
      return toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const closeRequest = async (data: { request_id: string }) => {
    try {
      await closeMutate(data);
      toast.success("Request Closed");
    } catch (error: any) {
      return toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="flex gap-2">
      
      {status === "CREATED" && isassignedManager && (
        <>
          <Button
            size="sm"
            onClick={() => handeleApproveOrReject("APPROVED")}
            disabled={isPending}
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            onClick={() => handeleApproveOrReject("REJECTED")}
            disabled={isPending}
            size="sm"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Reject
          </Button>
        </>
      )}

      {status === "APPROVED" && isassignedUser && (
        <Button
          size="sm"
          className="bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => closeRequest({ request_id: row?.row?.original?.id })}
          disabled={isPendingClose}
        >
          Close
        </Button>
      )}

      {(status === "REJECTED" || status === "CLOSED") && (
        <span className="text-muted-foreground text-sm italic">No Actions</span>
      )}
    </div>
  );
}

export const ViewLogModal = ({ row }: any) => {
  const [open, setOpen] = useState(false);
  const [requestId, setRequestId] = useState<string>("");

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

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleClose();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleOpen}>
          View Log
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Request Logs</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {recentLogs?.map((log: any) => (
            <div key={log.id} className="rounded-md border p-3 bg-muted/20">
              <div className="font-semibold">{log.title}</div>
              <div className="text-sm text-muted-foreground">
                {log.description}
              </div>

              <Separator className="my-2" />

              <div className="text-xs flex justify-between text-muted-foreground">
                <span>
                  By: <b>{log.created_by}</b>
                </span>
                <span>{new Date(log.created_at).toLocaleString()}</span>
              </div>
            </div>
          ))}

          {recentLogs.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">
              No logs found.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
