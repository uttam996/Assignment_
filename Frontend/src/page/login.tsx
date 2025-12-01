import { LoginForm } from "@/components/login-form"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const naivgate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      naivgate("/")
      
    }
    
  }, [])
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  )
}
