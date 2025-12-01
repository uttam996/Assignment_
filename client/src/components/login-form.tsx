import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { UseLogin } from "@/Hooks/ApiHooks/useAuthHook"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/Store/store"
import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [form, setForm] = React.useState({
    email: "",
    password: "",

  })

  const setToken = useUserStore((state: any) => state.setToken)
  const handleOnchnage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    })
  }

  const {
    mutateAsync: login, isPending
  } = UseLogin()
  const navigate = useNavigate()

  const onSubmit = async () => {
    try {
      const data = await login(form)
      const token = data?.data?.token
      localStorage.setItem("token", token)
      setToken(token)

      navigate("/request")

      setForm({
        email: "",
        password: "",
      })
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong")
    }

  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your  account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  required
                  onChange={handleOnchnage}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password"

                  >Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password"
                  onChange={handleOnchnage}

                  required />
              </Field>
              <Field>
                <Button onClick={onSubmit} disabled={isPending} >Login</Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/signup">Sign up</Link>
              </FieldDescription>
            </FieldGroup>
          </div>
          <div className="bg-muted relative hidden md:block opacity-20">


            <img
              src={"https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />

          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
