import cn from 'classnames';
import {useLayout} from '@/lib/hooks/use-layout';
import {LAYOUT_OPTIONS} from '@/lib/constants';


export default function RewardEstimate() {
  const {layout} = useLayout();
  return (
    <div
      className={cn(
        'rounded-lg bg-white p-6 shadow-card dark:bg-light-dark sm:p-8',
        {
          'w-full lg:w-[49%]': layout === LAYOUT_OPTIONS.RETRO,
        }
      )}
    >
      <h3 className="mb-6 text-base font-medium uppercase">Reward estimate</h3>
      <div className={'border-b border-dashed border-gray-600 w-full mb-6'}></div>
      <div className="mb-5 grid grid-cols-6 items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span className={'col-span-2'}>Rank</span>
        <span className={'col-span-2 text-center'}>4H</span>
        <span className={'col-span-2'}>Tournament</span>
      </div>
      <div
        className="mb-5 grid grid-cols-6 justify-between text-sm text-gray-900 last:mb-0 dark:text-white gap-y-5"
      >
        <div className="col-span-2 flex items-center gap-2 text-center">
          1
        </div>
        <span className={'col-span-2 text-center'}>15</span>
        <span className={'col-span-2'}>200</span>

        <div className="col-span-2 flex items-center gap-2 text-center">
          2 - 10
        </div>
        <span className={'col-span-2 text-center'}>5</span>
        <span className={'col-span-2'}>70</span>
        <div className="col-span-2 flex items-center gap-2 text-center">
          11 - 20
        </div>
        <span className={'col-span-2 text-center'}>3</span>
        <span className={'col-span-2'}>30</span>
      </div>
    </div>
  );
}
