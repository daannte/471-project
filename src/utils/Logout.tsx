import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("ucid");
    window.location.reload();
  }, []);

  return null;
}

export default Logout;
