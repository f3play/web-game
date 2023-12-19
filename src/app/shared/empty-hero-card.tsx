'use client'

import classNames from "classnames";
import Image from "next/image";

export default function EmptyCard({}) {
  return (
    <div
      className={classNames(
        'relative grid h-[350px] w-56 place-self-center overflow-hidden rounded-lg bg-white' +
        ' shadow transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:shadow-large dark:bg-light-dark'
      )}
    >
      <Image
        className="block place-self-center"
        src={'/assets/Icon/plus.svg'}
        width={80}
        height={450}
        alt=""
      />
    </div>
  );
}