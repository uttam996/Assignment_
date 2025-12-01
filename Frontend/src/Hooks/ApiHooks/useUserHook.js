import { API } from "@/api.config";
import { useQuery } from "@tanstack/react-query";
export const useUserList = ({ role }) => {
    const params = {};
    if (role) {
        params.role = role;
    }
    const getUser = async () => {
        return API.get("/user/list", { params: params });
    };
    return useQuery({
        queryKey: ["user"],
        queryFn: getUser,
    });
};
