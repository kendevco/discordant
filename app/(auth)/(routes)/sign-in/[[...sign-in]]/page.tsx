import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-custom-gradient bg-gradient animate-gradientShift">
        <div className="absolute inset-0 bg-overlay-pattern opacity-45 bg-overlay bg-repeat mix-blend-overlay animate-blurEffect"></div>
      </div>
      <div className="relative flex flex-col gap-y-8 justify-center items-center">
        <span className="md:text-8xl font-mono text-center text-6xl">
          Hi there!
        </span>
        <SignIn />
      </div>
    </div>
  );
}
