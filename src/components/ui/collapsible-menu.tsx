'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { useMeasure } from '@/lib/hooks/use-measure';
import { useLayout } from '@/lib/hooks/use-layout';
import ActiveLink from '@/components/ui/links/active-link';
import { ChevronDown } from '@/components/icons/chevron-down';
import { LAYOUT_OPTIONS } from '@/lib/constants';
import routes from '@/config/routes';
import classNames from 'classnames';

// const NoSsrMotionSpan = dynamic(() => import('framer-motion').then((mod) => mod.motion), {ssr: false});

type MenuItemProps = {
  name?: string;
  icon: React.ReactNode;
  href: string;
  dropdownItems?: DropdownItemProps[];
  isActive?: boolean;
  target?: boolean
};

type DropdownItemProps = {
  name: string;
  href: string;
};

export function MenuItem({
  name,
  icon,
  href,
  dropdownItems,
  isActive,
  target = false
}: MenuItemProps) {
  const { layout } = useLayout();
  const pathname =
    '/' +
    (usePathname()
      ?.split('/')
      .slice(1)
      .join('/') ?? '');
  const [isOpen, setIsOpen] = useState(false);
  const [ref, { height }] = useMeasure<HTMLUListElement>();
  const isChildrenActive =
    dropdownItems && dropdownItems.some((item) => item.href === pathname);
  useEffect(() => {
    if (isChildrenActive) {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="mb-2 min-h-[48px] list-none last:mb-0">
      {dropdownItems?.length ? (
        <>
          <div
            className={cn(
              'relative flex h-12 cursor-pointer items-center justify-between whitespace-nowrap  rounded-lg px-4 text-sm transition-all',
              isChildrenActive
                ? 'text-white'
                : 'text-gray-500 hover:text-brand dark:hover:text-white'
            )}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="z-[1] flex items-center ltr:mr-3 rtl:ml-3">
              <span className={cn('ltr:mr-3 rtl:ml-3')}>{icon}</span>
              {name}
            </span>
            <span
              className={`z-[1] transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown />
            </span>

            {isChildrenActive && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="menu-item-active-indicator"
              />
            )}
          </div>

          <div
            style={{
              height: isOpen ? height : 0,
            }}
            className="ease-[cubic-bezier(0.33, 1, 0.68, 1)] overflow-hidden transition-all duration-[350ms]"
          >
            <ul ref={ref}>
              {dropdownItems.map((item, index) => (
                <li className="first:pt-2" key={index}>
                  <ActiveLink
                    target={target ? '#': ''}
                    href={{
                      pathname: item.href,
                    }}
                    className="flex items-center rounded-lg p-3 text-sm text-gray-500 transition-all before:h-1 before:w-1 before:rounded-full before:bg-gray-500 hover:text-brand ltr:pl-6 before:ltr:mr-5 rtl:pr-6 before:rtl:ml-5 dark:hover:text-white"
                    activeClassName="!text-brand dark:!text-white dark:before:!bg-white before:!bg-brand before:!w-2 before:!h-2 before:-ml-0.5 before:ltr:!mr-[18px] before:rtl:!ml-[18px] !font-medium"
                  >
                    {item.name}
                  </ActiveLink>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <ActiveLink
          href={href}
          target={target ? '#': ''}
          className={cn(
            'relative flex h-12 items-center whitespace-nowrap rounded-lg px-4 text-sm text-gray-500 transition-all hover:text-brand dark:hover:text-white',
            {
              'bg-brand':
                href &&
                (href === pathname ||
                  (href !== '/' && pathname.startsWith(href) ||
                    (href == '/' && pathname.startsWith('/tournament')))
                ),
            }
          )}
          activeClassName="!text-white"
        >
          <div
            className={cn(
              'relative z-[1] duration-100 before:absolute before:-right-3 before:top-[50%] before:h-1 before:w-1 before:-translate-y-2/4 before:rounded-full before:bg-none ltr:mr-3 rtl:ml-3',
              {
                'text-white': isActive || (href === pathname ||
                  (href !== '/' && pathname.startsWith(href)) ||
                  (href == '/' && pathname.startsWith('/tournament'))),
                'text-gray-500': !isActive && !name,
              }
            )}
          >
            {icon}
          </div>
          <div
            className={classNames('relative z-[1]', {
              'text-white':
                href &&
                (href === pathname ||
                  (href !== '/' && pathname.startsWith(href)) ||
                  (href == '/' && pathname.startsWith('/tournament')))
                  ,
            })}
          >
            {name}
          </div>

          {href &&
            (href === pathname ||
              (href !== '/' && pathname.startsWith(href)) || (href == '/' && pathname.startsWith('/tournament'))) && (
              <motion.span
                className="absolute bottom-0 left-0 right-0 h-full w-full rounded-lg bg-brand shadow-large"
                layoutId="menu-item-active-indicator"
              />
            )}
        </ActiveLink>
      )}
    </div>
  );
}
