"use client";

import { Button } from "@components/ui/button";
import { Form } from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useStore } from "@store/store.context";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { authStore } = useStore();
  const form = useForm<Inputs>();
  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const success = await authStore.authenticate(data.email, data.password);
    if (success) {
      router.replace("/dashboard");
      return toast.success("Login realizado com sucesso!");
    }
    toast.error("Email ou senha inválidos!");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div>
          <label htmlFor="email">Email</label>
          <Input {...form.register("email")} autoComplete="off" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <Input
            {...form.register("password")}
            type="password"
            autoComplete="off"
          />
        </div>
        <Button type="submit" className="mt-4 w-full">
          Entrar
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
