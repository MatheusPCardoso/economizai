"use client";

import { Button } from "@/src/components/ui/button";
import { Card } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import AccountCreationForm from "@features/wallet-creation/form";
import { observer } from "mobx-react-lite";
import Image from "next/image";

const AccountCreationPage = observer(() => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-[950px] h-2/3 px-5">
        <div className="flex-1 flex flex-row">
          <div className="flex w-[50%] px-5">
            <div className="flex flex-col gap-10 items-center justify-center w-full h-full">
              <span className="text-2xl font-semibold">
                Bem vindo(a) a criação de carteira &#129297;
              </span>
              <div className="w-full">
                <AccountCreationForm />
              </div>
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="w-[50%] flex items-center justify-center">
            <Image
              src={"/assets/images/wallet-creation.png"}
              alt={""}
              width={400}
              height={400}
            />
          </div>
        </div>
      </Card>
    </div>
  );
});

export default AccountCreationPage;
