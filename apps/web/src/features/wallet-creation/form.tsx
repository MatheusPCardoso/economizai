"use client";

import { Button } from "@components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useStore } from "@store/store.context";
import { ChevronLeft, SquareArrowOutUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface WalletCreationInputs {
  name: string;
}

const WalletCreationForm = () => {
  const { walletStore } = useStore();
  const router = useRouter();
  const form = useForm<WalletCreationInputs>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: WalletCreationInputs) => {
    if (!data.name.trim()) return toast.warning("Preencha o nome da carteira");
    await walletStore.createWallet(data.name);
    router.push("/dashboard");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da carteira</FormLabel>
              <FormControl>
                <Input value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button
            className="mt-10 w-[45%]"
            type="button"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft />
            Voltar
          </Button>
          <Button
            className="mt-10 w-[45%] flex items-center justify-center"
            type="submit"
          >
            Criar
            <SquareArrowOutUpRight />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default WalletCreationForm;
