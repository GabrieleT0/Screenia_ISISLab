import { useEffect, useState } from "react";

const useComponentByUserRole = (token, roles = [], userRole = null) => {
    const [isUsed, setIsUsed] = useState(false);

    useEffect(() => {
        if(!token || !userRole) {
            setIsUsed(false);
            return;
        }

        if (roles.includes(userRole)) {
            setIsUsed(true);
        } else {
            setIsUsed(false);
        }
    }, [token, roles, userRole])

    return isUsed;
}

export default useComponentByUserRole;