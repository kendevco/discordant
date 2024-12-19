// path: app/(main)/layout.tsx
import { NavigationProvider } from "@/components/providers/navigation-provider";
import { UnifiedNavigationProvider } from "@/components/providers/unified-navigation-provider";
import { GeistSans } from 'geist/font/sans'

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps): JSX.Element {
  return (
    <NavigationProvider>
      <UnifiedNavigationProvider>
        <div className={`flex h-screen dark ${GeistSans.className}`}>
          <main className="flex-1 h-full text-gray-100 bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900">
            {children}
          </main>
        </div>
      </UnifiedNavigationProvider>
    </NavigationProvider>
  );
}

export default MainLayout;

