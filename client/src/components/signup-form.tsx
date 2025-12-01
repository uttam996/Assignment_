import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseRegister } from "@/Hooks/ApiHooks/useAuthHook";
import { useUserList } from "@/Hooks/ApiHooks/useUserHook";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    manager_id: "",
  });

  const { data } = useUserList({ role: "MANAGER" });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const { mutateAsync: register, isPending } = UseRegister();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const data:{manager_id?:string} = {
        ...user,
      }
      if(!data.manager_id){
        delete data.manager_id
      }
      await register(user);
      toast.success("User registered successfully");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };
  return (
    <div className={cn("flex flex-col gap-6 ", className)} {...props}>
      <Card className="overflow-hidden ">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <FieldGroup 
            className="flex flex-col items-center justify-center gap-6 p-4 md:p-10"
          >
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">Create your account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email below to create your account
              </p>
            </div>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                name="email"
                onChange={onChange}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                type="text"
                onChange={onChange}
                placeholder="John Doe"
                required
                name="name"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="role">Role</FieldLabel>
              <Select onValueChange={(e) => setUser({ ...user, role: e })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="EMPLOYEE">EMPLOYEE</SelectItem>
                    <SelectItem value="MANAGER">MANAGER</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            {user.role === "EMPLOYEE" && (
              <Field>
                <FieldLabel htmlFor="manager_id">Manager ID</FieldLabel>
                <Select
                  onValueChange={(e) => setUser({ ...user, manager_id: e })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Manager</SelectLabel>
                      {data?.data?.data?.map((user: any) => (
                        <SelectItem key={user?.id} value={user.id}>
                          {user?.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                onChange={onChange}
                name="password"
                type="password"
                required
              />
            </Field>
            <Field>
              <Button 
              onClick={handleRegister}
              disabled={isPending}
              >Create Account</Button>
            </Field>

            <FieldDescription className="text-center">
              Already have an account? <Link to="/login">Login</Link>
            </FieldDescription>
          </FieldGroup>

          <div className="bg-muted relative hidden md:block opacity-50">
            <img
              src={
                "https://images.unsplash.com/photo-1511485977113-f34c92461ad9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80"
              }
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
  );
}
