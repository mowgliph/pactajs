
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  FilePlus, 
  FolderOpen, 
  Bell, 
  Users, 
  LogOut,
  BarChart3,
  Building2,
  Truck,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Contracts', href: '/contracts', icon: FileText, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Supplements', href: '/supplements', icon: FilePlus, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Clients', href: '/clients', icon: Building2, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Suppliers', href: '/suppliers', icon: Truck, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Authorized Signers', href: '/authorized-signers', icon: UserCheck, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Documents', href: '/documents', icon: FolderOpen, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Reports', href: '/reports', icon: BarChart3, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['admin', 'manager', 'editor', 'viewer'] },
  { name: 'Users & Roles', href: '/users', icon: Users, roles: ['admin'] },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout, hasPermission } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasPermission(role as any))
  );

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">PACTA Web</h1>
        <p className="text-sm text-muted-foreground">Contract Management</p>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4 space-y-2">
        <div className="px-3 py-2 text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize mt-1">
            Role: {user?.role}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
