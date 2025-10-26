import Logo from "@components/logo";
import { Card } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import LoginForm from "@features/login/form";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-[750px] h-[480px] flex flex-row p-10">
        <div className="w-[45%] flex items-center">
          <Logo
            variant="full"
            alt="Logo"
            width={300}
            height={300}
            className="m-auto"
          />
        </div>
        <Separator
          orientation="vertical"
          className="bg-primary w-1 opacity-50"
        />
        <div className="w-[45%] h-full flex items-center">
          <LoginForm />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
