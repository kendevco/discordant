// /app/(main)/layout.tsx

import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full">
        <div className="h-full flex w-[72px] z-30 flex-col fixed inset-y-0">
          <NavigationSidebar />
        </div>
        <main className="h-full w-full pl-[72px]">{children}</main>
      </div>
    </>
  );
};

export default MainLayout;
