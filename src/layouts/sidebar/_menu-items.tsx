import routes from "@/config/routes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faDragon,
  faRankingStar,
  faStore,
  faTableList,
  faUserGroup,
  faTicket, faArrowUpRightFromSquare
} from "@fortawesome/free-solid-svg-icons"
import {CompassIcon} from "@/components/icons/compass";
import {HistoryIcon} from "@/components/icons/history";

export const menuItems = [  {
    name: "TOURNAMENT",
    icon: <FontAwesomeIcon icon={faRankingStar} className={"h-6 w-6"} />,
    href: routes.home,
    dropdownItems: [
      {
        name: 'DASHBOARD',
        icon: <CompassIcon />,
        href: routes.home,
      },
      {
        name: 'HISTORY',
        icon: <HistoryIcon />,
        href: routes.tournament_history,
      },
    ],
  },
  {
    name: "SUMMON",
    icon: <FontAwesomeIcon icon={faDragon} className={"h-6 w-6"} />,
    href: routes.summon,
  },
  {
    name: "MY NFT",
    icon: <FontAwesomeIcon icon={faTableList} className={"h-6 w-6"} />,
    href: routes.myNfts,
  },
  {
    name: "MARKETPLACE",
    icon: <FontAwesomeIcon icon={faStore} className={"h-6 w-6"} />,
    href: routes.marketplace,
  },
  {
    name: "LOTTERY",
    icon: <FontAwesomeIcon icon={faTicket} className={"h-6 w-6"} />,
    href: routes.lottery,
  },
  {
    name: "REFERRAL",
    icon: <FontAwesomeIcon icon={faUserGroup} className={"h-6 w-6"} />,
    href: routes.referral,
  },
]
