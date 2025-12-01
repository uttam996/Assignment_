import { API } from "@/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export const useRequestList = ({ page, limit, search }: { page: number; limit: number; search: string }) => {
  const getList = async () => {
    return API.get("/requests", { params: { page, limit, search } });
  };
  return useQuery({
    queryKey: ["requestList"],
    queryFn: getList,
  });
};

export const useRequestCreate = () => {
  const queryClient = useQueryClient();
  const createRequest = async (data: {
    title: string;
    description: string;
    assigned_to: string;
  }) => {
    return API.post("/requests/create", data);
  };
  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requestList"],
      });
    },
  });
};

export const ApproveOrReject = () => {
  const queryClient = useQueryClient();
  const approveOrReject = async (data: {
    request_id: string;
    status: string;
    remarks?: string;
  }) => {
    return API.patch("/requests/update", data);
  };
  return useMutation({
    mutationFn: approveOrReject,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requestList"],
      });
    },
  });
};

export const useCloseRequest = () => {
  const queryClient = useQueryClient();
  const closeRequest = async (data: { request_id: string }) => {
    return API.post("/requests/close", data);
  };
  return useMutation({
    mutationFn: closeRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["requestList"],
      });
    },
  });
};

export const useRequestLog = (request_id: string, enabled?: boolean) => {
  const getList = async () => {
    return API.get(`/requests/log/${request_id}`);
  };
  return useQuery({
    queryKey: ["requestLog"],
    queryFn: getList,
    enabled: enabled,
  });
};
