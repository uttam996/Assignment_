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
    cell: ({ row }: any) => {
      const role = row.getValue("role");

      return (
        <Badge
          variant={role === "MANAGER" ? "default" : "outline"}
          className="px-3 py-1"
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }: any) => {
      const manager = row.original?.manager;
      return manager ? (
        <span className="text-sm text-muted-foreground">
          {manager.name}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground italic">
          No Manager
        </span>
      );
    },
  },
];
