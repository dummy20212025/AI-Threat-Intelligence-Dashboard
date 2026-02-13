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
  const { theme, resolvedTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Auto-expand menus based on current path
    if (pathname.includes('/ath') || pathname.includes('/tor') || pathname.includes('/vpn') || pathname.includes('/tunneling')) {
      setOpenMenu('ath');
    } else if (pathname.includes('/ars') || pathname.includes('/portscan') || pathname.includes('/anomaly')) {
      setOpenMenu('ars');
    } else {
      setOpenMenu(null);
    }
  }, [pathname]);

  // Use resolvedTheme for more accurate dark mode detection
  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  if (!mounted) return null;

  return (
    <aside 
      className={`
        /* Positioning Logic */
        sticky top-[64px] z-30
        
        /* Layout & Sizing */
        w-64 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto
        flex flex-col px-4 py-6 border-r transition-colors duration-500
        
        /* Theme Logic */
        ${isDark 
          ? 'bg-gray-900 border-slate-800 shadow-[20px_0_30px_-15px_rgba(0,0,0,0.5)]' 
          : 'bg-gray-100 border-gray-200 shadow-[10px_0_15px_-3px_rgba(0,0,0,0.02)]'}
      `}
    >
      <nav className="flex flex-col gap-2">
        <NavItem href="/" icon={<HomeIcon size={20} />} label="Home" isDark={isDark} active={pathname === '/'} />
        <NavItem href="/dashboard/acr" icon={<ShieldAlert size={20} />} label="ACR" isDark={isDark} active={pathname === '/dashboard/acr'} />
        
        <CollapsibleNavItem 
          label="ATH" 
          href="/dashboard/ath" 
          icon={<Globe size={20} />} 
          isDark={isDark}
          isOpen={openMenu === 'ath'}
          active={pathname === '/dashboard/ath'}
        >
          <NavItem href="/dashboard/tor" icon={<Globe size={18} />} label="TOR" isDark={isDark} isSubItem active={pathname === '/dashboard/tor'} />
          <NavItem href="/dashboard/vpn" icon={<GlobeLockIcon size={18} />} label="VPN" isDark={isDark} isSubItem active={pathname === '/dashboard/vpn'} />
          <NavItem href="/dashboard/tunneling" icon={<Lock size={18} />} label="Tunneling" isDark={isDark} isSubItem active={pathname === '/dashboard/tunneling'} />
        </CollapsibleNavItem>

        <NavItem href="/dashboard/azp" icon={<AlertTriangle size={20} />} label="AZP" isDark={isDark} active={pathname === '/dashboard/azp'} />

        <CollapsibleNavItem 
          label="ARS" 
          href="/dashboard/ars" 
          icon={<ShieldUserIcon size={20} />} 
          isDark={isDark}
          isOpen={openMenu === 'ars'}
          active={pathname === '/dashboard/ars'}
        >
          <NavItem href="/dashboard/portscan" icon={<Scan size={18} />} label="PortScan" isDark={isDark} isSubItem active={pathname === '/dashboard/portscan'} />
          <NavItem href="/dashboard/anomaly" icon={<ShieldAlert size={18} />} label="Anomaly" isDark={isDark} isSubItem active={pathname === '/dashboard/anomaly'} />
        </CollapsibleNavItem>
      </nav>
      
      {/* Footer hint for the Sidebar */}
      <div className="mt-auto py-4 border-t border-gray-500/10">
        <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
          Security Ops Center
        </p>
      </div>
    </aside>
  );
}

function CollapsibleNavItem({ label, href, icon, isDark, children, isOpen, active }: { 
  label: string; href: string; icon: ReactNode; isDark: boolean; children: ReactNode; isOpen: boolean; active: boolean;
}) {
  return (
    <div className="flex flex-col">
      <Link
        href={href}
        className={`w-full flex h-[48px] items-center justify-between rounded-xl px-3 text-sm font-medium transition-all duration-300
          ${active 
            ? (isDark ? 'bg-blue-600/10 text-blue-400 shadow-inner' : 'bg-blue-50 text-blue-600') 
            : (isDark ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900')
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
            <div className={`ml-4 mt-1 flex flex-col gap-1 border-l ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ href, icon, label, isDark, isSubItem = false, active = false }: {
  href: string; icon: React.ReactNode; label: string; isDark: boolean; isSubItem?: boolean; active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex h-[40px] items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-200
        ${isSubItem ? 'ml-4' : ''}
        ${active 
          ? (isDark ? 'text-blue-400 bg-blue-400/5' : 'text-blue-600 bg-blue-50/50') 
          : (isDark ? 'text-slate-500 hover:text-slate-200 hover:bg-slate-900' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')
        }
      `}
    >
      <span className={active ? 'scale-110' : 'opacity-70'}>{icon}</span>
      <span className={active ? 'font-bold tracking-tight' : ''}>{label}</span>
    </Link>
  );
}