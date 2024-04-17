import { Image } from "@nextui-org/image";
import SignUpForm from "./signup";

export default function page() {
  return (
    <div className="flex md:mx-10 my-5 gap-5 max-md:items-center max-md:gap-10 max-md:flex-col-reverse">
      <SignUpForm />
      <div className="w-1/2 max-md:w-2/3">
        <Image alt="LiftFeed" src="/assets/signupimage.jpg" isBlurred />
      </div>
    </div>
  );
}
