import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";
import type { JSX } from "@emotion/react/jsx-runtime";

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();

  return (
    <LoginForm
      onSuccess={() => navigate("/dashboard", { replace: true })}
    />
  );
}


