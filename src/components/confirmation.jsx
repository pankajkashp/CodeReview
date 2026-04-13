import { useEffect } from "react";
import { supabase } from "../supabaseclient";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirm = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/"); // redirect to main app
      }
    };

    handleConfirm();
  }, []);

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>✅ Email Confirmed</h1>
      <p>Redirecting...</p>
    </div>
  );
}