import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
  
    <ClerkProvider>
        <div className="flex flex-col w-full h-full">
            <Navbar />
            {children}
            {/* <Toaster /> */}
        </div>
    </ClerkProvider>
  );
}

