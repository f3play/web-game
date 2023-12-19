'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import cn from 'classnames';
import AuthorCard from '@/components/ui/author-card';
import Logo from '@/components/ui/logo';
import LogoIcon from '@/components/ui/logo-icon';
import { MenuItem } from '@/components/ui/collapsible-menu';
import Scrollbar from '@/components/ui/scrollbar';
import Button from '@/components/ui/button';
import { useDrawer } from '@/components/drawer-views/context';
import { useLayout } from '@/lib/hooks/use-layout';
import { Close } from '@/components/icons/close';
import { useClickAway } from '@/lib/hooks/use-click-away';
import { menuItems } from '@/layouts/sidebar/_menu-items';
import routes from '@/config/routes';
//images
import AuthorImage from '@/assets/images/author.jpg';
import { LAYOUT_OPTIONS } from '@/lib/constants';

export default function Sidebar({ className }: { className?: string }) {
  const router = useRouter();
  const { layout } = useLayout();
  const pathname =
    '/' +
    (usePathname()
      ?.split('/')
      .slice(layout === LAYOUT_OPTIONS.MODERN ? 1 : 2)
      .join('/') ?? '');
  const { closeDrawer } = useDrawer();
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLElement>(null);
  useClickAway(ref, () => {
    setOpen(false);
  });

  function isSubMenuActive(
    submenu: Array<{ name: string; icon?: JSX.Element; href: string }>
  ) {
    return submenu?.map((item) => item.href).includes(pathname);
  }

  return (
    <aside
      ref={ref}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className={cn(
        open
          ? 'border-0 shadow-expand xs:w-80 xl:w-72 2xl:w-80 '
          : 'w-24 border-dashed border-gray-200 ltr:border-r rtl:border-l 2xl:w-28',
        'top-0 z-40 h-full w-full max-w-full  bg-body duration-200 ltr:left-0 rtl:right-0  dark:border-gray-700 dark:bg-dark xl:fixed',
        className
      )}
    >
      <div
        className={cn(
          'relative flex h-24 items-center  overflow-hidden px-6 py-4 pt-0 2xl:px-8 3xl:pt-6',
          open ? 'flex-start' : 'justify-center'
        )}
      >
        {!open ? (
          <div onClick={() => setOpen(!open)}>
            <LogoIcon />
          </div>
        ) : (
          <Logo />
        )}

        <div className="md:hidden">
          <Button
            title="Close"
            color="white"
            shape="circle"
            variant="transparent"
            size="small"
            onClick={closeDrawer}
          >
            <Close className="h-auto w-2.5" />
          </Button>
        </div>
      </div>

      <Scrollbar
        style={{
          height: `calc(100% - ${!open ? '170px' : '225px'})`,
          // marginTop: '-28px',
        }}
        className="-mt-4 2xl:-mt-7"
      >
        <div className="px-6 pb-5 2xl:px-8">
          {!open ? (
            <div className="mt-5 2xl:mt-5" onClick={() => setOpen(!open)}>
              {menuItems.map((item, index) => (
                <MenuItem
                  isActive={
                    item.href === pathname ||
                    isSubMenuActive(item.dropdownItems!)
                  }
                  key={'drawer' + item.name + index}
                  href=""
                  icon={item.icon}
                />
              ))}
            </div>
          ) : (
            <div className="mt-5 2xl:mt-8">
              {menuItems.map((item, index) => (
                <MenuItem
                  key={'drawer-full' + item.name + index}
                  name={item.name}
                  href={item.href}
                  icon={item.icon}
                  dropdownItems={item.dropdownItems}
                />
              ))}
            </div>
          )}
        </div>
      </Scrollbar>
      <div className={cn('sticky bottom-0 mt-3 px-8 2xl:mt-4')}>
        {!open ? (
          <motion.div
            initial={{ x: 50, y: -5 }}
            animate={{
              x: 0,
              y: 0,
            }}
            className="cursor-pointer pb-2"
            onClick={() =>
              router.push(
                (layout === LAYOUT_OPTIONS.MODERN ? '' : layout) +
                  routes.profile
              )
            }
          >
            <AuthorCard image={AuthorImage} />
          </motion.div>
        ) : (
          <div>
            <motion.div
              initial={{ y: '80%' }}
              animate={{
                y: 0,
                transition: {
                  delay: 0.1,
                },
              }}
              onClick={() =>
                router.push(
                  (layout === LAYOUT_OPTIONS.MODERN ? '' : layout) +
                    routes.profile
                )
              }
            >
              <AuthorCard
                image={AuthorImage}
                name="Cameron Williamson"
                role="admin"
              />
            </motion.div>
          </div>
        )}
      </div>
      <div className={'absolute bottom-10'}>
        avatar
      </div>
    </aside>
  );
}
