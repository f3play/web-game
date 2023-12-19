'use client';

import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import { useIsMounted } from '@/lib/hooks/use-is-mounted';
import { useIsDarkMode } from '@/lib/hooks/use-is-dark-mode';
import { useLayout } from '@/lib/hooks/use-layout';
import lightLogo from '@/assets/images/logo.svg';
import darkLogo from '@/assets/images/logo.png';
import routes from '@/config/routes';
import { LAYOUT_OPTIONS } from '@/lib/constants';

export default function Logo() {
  const { layout } = useLayout();
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  return (
    <AnchorLink
      href={{
        pathname: routes.home,
      }}
      className="flex items-center mx-auto select-none"
    >
      <Image className={'rounded-xl grayscale subpixel-antialiased'} src={darkLogo} alt={'Panda force'} width={145} height={500} priority/>
      {/*<span className="relative flex overflow-hidden">*/}
      {/*  {isMounted && isDarkMode && (*/}
      {/*    <Image className={'mx-auto'} src={darkLogo} alt="Criptic" height={500} priority />*/}
      {/*  )}*/}
      {/*  {isMounted && !isDarkMode && (*/}
      {/*    <Image src={lightLogo} alt="Criptic" height={24} priority />*/}
      {/*  )}*/}
      {/*</span>*/}
    </AnchorLink>
  );
}
