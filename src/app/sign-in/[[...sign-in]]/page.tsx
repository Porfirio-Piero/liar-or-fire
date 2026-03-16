import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-zinc-900 border border-zinc-800 shadow-xl",
            headerTitle: "text-white text-2xl",
            headerSubtitle: "text-zinc-400",
            socialButtonsBlockButton: "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
            dividerLine: "bg-zinc-700",
            dividerText: "text-zinc-500",
            formFieldLabel: "text-zinc-300",
            formFieldInput: "bg-zinc-800 border-zinc-700 text-white focus:border-violet-500",
            formButtonPrimary: "bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500",
            footerActionLink: "text-violet-400 hover:text-violet-300",
          },
        }}
        routing="path"
        path="/sign-in"
      />
    </div>
  );
}