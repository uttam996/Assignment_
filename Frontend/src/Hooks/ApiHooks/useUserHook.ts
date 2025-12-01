import { API } from "@/api.config";
import { useQuery } from "@tanstack/react-query";

export const useUserList = ({role}: {role?: string}) => {

const params:{
  role?: string
}={}
if(role){
  params.role=role
}
  const getUser = async () => {
    return API.get("/user/list", {params: params});
  };
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    
  });
};