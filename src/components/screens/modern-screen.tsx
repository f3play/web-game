'use client';

import cn from 'classnames';
import Avatar from '@/components/ui/avatar';

//images
import AuthorImage from '@/assets/images/author.jpg';
import ActionSlider from "@/components/ui/actions";
import RankingTable from "@/components/dashboard/ranking-table";
import RewardEstimate from "@/components/ui/reward-estimate";

export default function ModernScreen() {
  return (
    <>
      <div className="flex flex-wrap">
        <div
          className="mb-8 w-full sm:mb-0 sm:ltr:pr-6 sm:rtl:pl-6">
          <ActionSlider/>
        </div>
        {/*<div className="w-full sm:w-1/2 md:w-64 lg:w-72 2xl:w-80 3xl:w-[358px]">*/}
        {/*  <div*/}
        {/*    className="flex h-full 2xl:h-72 3xl:h-[350px] flex-col justify-center rounded-lg bg-white p-6 shadow-card dark:bg-light-dark xl:p-8">*/}
        {/*    <Avatar*/}
        {/*      image={AuthorImage}*/}
        {/*      alt="Player image"*/}
        {/*      className="mx-auto mb-6"*/}
        {/*      size="lg"*/}
        {/*    />*/}
        {/*    <h3 className="mb-2 text-center text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 3xl:mb-3">*/}
        {/*      Ranking*/}
        {/*    </h3>*/}
        {/*    <div*/}
        {/*      className="mb-7 text-center font-medium tracking-tighter text-gray-900 dark:text-white xl:text-2xl 3xl:mb-8 3xl:text-[32px]">*/}
        {/*      123*/}
        {/*    </div>*/}
        {/*    /!*<TopupButton />*!/*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>

      <div className="flex flex-wrap mt-8">
        <div
          className={cn(
            'w-full'
          )}
        >
          <RankingTable/>
        </div>
        {/*<div*/}
        {/*  className={cn(*/}
        {/*    'order-first mb-8 grid w-full grid-cols-1 gap-6 sm:mb-10 sm:grid-cols-2 lg:order-1 lg:mb-0 lg:flex lg:w-72 lg:flex-col 2xl:w-80 3xl:w-[358px]'*/}
        {/*  )}*/}
        {/*>*/}
        {/*<OverviewChart />*/}
        {/*<RewardEstimate/>*/}
        {/*</div>*/}
      </div>
    </>
  );
}
