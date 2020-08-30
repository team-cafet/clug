import { useEffect, useState } from "react";
import { getUserInfo } from "../services/auth.service";

export const useUserOrganisation = (): [number, any]=> {
  const [orgID, setOrgID] = useState(0);

  useEffect(() => {
    const userInfo = getUserInfo();
    if (userInfo?.organisation?.id) {
      setOrgID(userInfo?.organisation.id);
    }
  }, []);

  return [orgID, setOrgID];
}