'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  ShieldAlert, Globe, Lock, Scan, AlertTriangle, 
  GlobeLockIcon, HomeIcon, ShieldUserIcon, ChevronDown 
} from 'lucide-react';
import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (pathname.includes('/ath') || pathname.includes('/tor') || pathname.includes('/vpn') || pathname.includes('/tunneling')) {
      setOpenMenu('ath');
    } else if (pathname.includes('/ars') || pathname.includes('/portscan') || pathname.includes('/anomaly')) {
      setOpenMenu('ars');
    } else {
      setOpenMenu(null);
    }
  }, [pathname]);

  if (!mounted) return null;

  return (
    <aside className={`w-64 flex-shrink-0 h-[calc(100vh-64px)] flex flex-col px-4 py-4 border-r border-white/10 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <nav className="flex flex-col gap-1">
        <NavItem href="/" icon={<HomeIcon size={20} />} label="Home" theme={theme} active={pathname === '/'} />
        <NavItem href="/dashboard/acr" icon={<ShieldAlert size={20} />} label="ACR" theme={theme} active={pathname === '/dashboard/acr'} />
        
        <CollapsibleNavItem 
          label="ATH" 
          href="/dashboard/ath" 
          icon={<Globe size={20} />} 
          theme={theme}
          isOpen={openMenu === 'ath'}
          active={pathname === '/dashboard/ath'}
        >
          <NavItem href="/dashboard/tor" icon={<Globe size={18} />} label="TOR" theme={theme} isSubItem active={pathname === '/dashboard/tor'} />
          <NavItem href="/dashboard/vpn" icon={<GlobeLockIcon size={18} />} label="VPN" theme={theme} isSubItem active={pathname === '/dashboard/vpn'} />
          <NavItem href="/dashboard/tunneling" icon={<Lock size={18} />} label="Tunneling" theme={theme} isSubItem active={pathname === '/dashboard/tunneling'} />
        </CollapsibleNavItem>

        <NavItem href="/dashboard/azp" icon={<AlertTriangle size={20} />} label="AZP" theme={theme} active={pathname === '/dashboard/azp'} />

        <CollapsibleNavItem 
          label="ARS" 
          href="/dashboard/ars" 
          icon={<ShieldUserIcon size={20} />} 
          theme={theme}
          isOpen={openMenu === 'ars'}
          active={pathname === '/dashboard/ars'}
        >
          <NavItem href="/dashboard/portscan" icon={<Scan size={18} />} label="PortScan" theme={theme} isSubItem active={pathname === '/dashboard/portscan'} />
          <NavItem href="/dashboard/anomaly" icon={<ShieldAlert size={18} />} label="Anomaly" theme={theme} isSubItem active={pathname === '/dashboard/anomaly'} />
        </CollapsibleNavItem>
      </nav>
    </aside>
  );
}

function CollapsibleNavItem({ label, href, icon, theme, children, isOpen, active }: { 
  label: string; href: string; icon: ReactNode; theme?: string; children: ReactNode; isOpen: boolean; active: boolean;
}) {
  return (
    <div className="flex flex-col">
      <Link
        href={href}
        className={`w-full flex h-[48px] items-center justify-between rounded-md px-3 text-sm font-medium transition-colors 
          ${active 
            ? (theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600') 
            : (theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-blue-400' : 'text-gray-700 hover:bg-gray-200 hover:text-blue-600')
          }
        `}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={16} />
        </motion.div>
      </Link>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gray-700/30 dark:border-white/10">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ href, icon, label, theme, isSubItem = false, active = false }: {
  href: string; icon: React.ReactNode; label: string; theme?: string; isSubItem?: boolean; active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex h-[40px] items-center gap-3 rounded-md px-3 text-sm font-medium transition-all
        ${isSubItem ? 'ml-2' : ''}
        ${active 
          ? (theme === 'dark' ? 'text-blue-400 font-bold' : 'text-blue-600 font-bold') 
          : (theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600')
        }
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}