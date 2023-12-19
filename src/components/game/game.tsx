import Image from "next/image"
import { motion } from "framer-motion"
import { useWaitForTransaction } from "wagmi"
import {
  LotteryAddress,
  LotteryTokenAddress,
  TournamentAddress,
  TournamentContract,
} from "@/config/contracts"
import { ethers } from "ethers"
import { useGamePlayerInfo } from "@/hooks/useGamePlayerInfos"
import { useMultiNFTAttribute } from "@/hooks/useNFT"
import { toast } from "react-hot-toast"
import { use, useEffect, useState } from "react"
import GameResult from "../battle/game/game-result"
import classNames from "classnames"
import { useRouter } from "next/navigation"
import { Hero } from "@/models/hero"
import Button from "@/components/ui/button"
import { sleep } from "@/utils/number"
import { skip } from "node:test"
import { set } from "react-hook-form"
import { GameMarketplace } from "@/components/icons/game-marketplace"
import PageLoading from "@/app/shared/page-loading"


function GameCounter({ value }: { value: Number }) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
      <motion.div
        className="box mt-[32px] text-[80px] font-bold text-black"
        animate={{
          scale: [0.5, 1.4, 1],
          rotate: [0, 0, 0],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          times: [0, 0.3, 0.7],
          repeat: Infinity,
        }}
      >
        {value}
      </motion.div>
    </div>
  )
}

export default function Game({
  txHash,
  account,
  opponent,
  round,
}: {
  txHash: string
  account: string
  opponent: string
  round: string
}) {
  const [counter, setCounter] = useState(4)
  const [isWin, setIsWin] = useState(undefined)
  const [hasLottery, setHasLottery] = useState(undefined)
  const [imageLoaded, setImageLoaded] = useState(0)
  const [isLoadedImages, setIsLoadedImages] = useState(false)
  const router = useRouter()

  const { data: playerInfo } = useGamePlayerInfo(account, round)
  const { data: opponentInfo } = useGamePlayerInfo(opponent, round)

  const squadInfos = useMultiNFTAttribute(
    playerInfo?.squad.filter((i) => !!i).map((i) => i.toString()) || [],
  )

  const opSquadInfos = useMultiNFTAttribute(
    opponentInfo?.squad.filter((i) => !!i).map((i) => i.toString()) || [],
  )

  const { data: result, isError } = useWaitForTransaction({
    hash: txHash,
  })

  const [isEnded, setIsEnded] = useState(false)

  const backToPreviousPage = () => {
    router.replace("/tournament")
  }

  const sleep = (ms: Number) => new Promise(resolve => setTimeout(resolve, ms));

  const getHeroHP = (rarity: string) => {
    switch (rarity) {
      case "common":
        return Math.floor(Math.random() * 30) + 120;
      case "uncommon":
        return Math.floor(Math.random() * 40) + 160;
      case "rare":
        return Math.floor(Math.random() * 50) + 210;
      case "epic":
        return Math.floor(Math.random() * 60) + 270;
      case "legendary":
        return Math.floor(Math.random() * 70) + 340;
    }
  }

  const getHeroDamage = (rarity: string) => {
    switch (rarity) {
      case "common":
        return Math.floor(Math.random() * 10) + 70;
      case "uncommon":
        return Math.floor(Math.random() * 10) + 85;
      case "rare":
        return Math.floor(Math.random() * 10) + 100;
      case "epic":
        return Math.floor(Math.random() * 20) + 130;
      case "legendary":
        return Math.floor(Math.random() * 30) + 160;
    }
  }

  const getFirstStopGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#64748b"
      case "uncommon":
        return "#84cc16"
      case "rare":
        return "#6366f1"
      case "epic":
        return "#7e22ce"
      case "legendary":
        return "#f59e0b"
    }
  }

  const getSecondStopGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#cbd5e1"
      case "uncommon":
        return "#bef264"
      case "rare":
        return "#a5b4fc"
      case "epic":
        return "#a855f7"
      case "legendary":
        return "#fcd34d"
    }
  }

  const getCoordinates = (length: number, width: number, height: number) => {
    let coordinatesX
    let coordinatesY
    switch (length) {
      case 1:
        coordinatesX = [width * 0.18]
        coordinatesY = [height * 0.5]
        return { coordinatesX, coordinatesY }
      case 2:
        coordinatesX = [width * 0.18, width * 0.18]
        coordinatesY = [height * 0.35, height * 0.65]
        return { coordinatesX, coordinatesY }
      case 3:
        coordinatesX = [width * 0.12, width * 0.18, width * 0.12]
        coordinatesY = [height * 0.25, height * 0.5, height * 0.75]
        return { coordinatesX, coordinatesY }
    }
  }

  useEffect(() => {
    if (isError) {
      toast.error("Failed to execute Battle transaction")
      return router.back()
    }

    if (!result) {
      return
    }

    async function checkResult(result: any) {
      const hasLotteryLog = result.logs.some(
        (i: any) =>
          i.address.toLocaleLowerCase() ==
          LotteryTokenAddress.toLocaleLowerCase(),
      )
      setHasLottery(hasLotteryLog)

      const log = result.logs.filter(
        (i: any) =>
          i.address.toLocaleLowerCase() ==
          TournamentAddress.toLocaleLowerCase(),
      )[0]
      const iface = new ethers.Interface(TournamentContract.abi)
      const decodedData = await iface.parseLog({
        data: log.data,
        topics: log.topics,
      })

      const isWin = decodedData.args[2]
      setIsWin(isWin)
    }
    checkResult(result)


  }, [result, isError])

  useEffect(() => {
    if (!isLoadedImages || counter > 0 || isWin == undefined) {
      return
    }

    const canvas = document.getElementById("game")
    const ctx = canvas.getContext("2d")

    const gameWidth = window.innerWidth - 400
    //1520
    const gameHeight = window.innerHeight - 136
    //834

    canvas.width = gameWidth
    canvas.height = gameHeight

    const power = squadInfos.reduce((acc, hero) => acc + hero.attack + hero.defense, 0)
    const opPower = opSquadInfos.reduce((acc, hero) => acc + hero.attack + hero.defense, 0)
    let battleResult = isWin ? "win" : "lose"
    battleResult = power > opPower ? "stronger_" + battleResult : "weaker_" + battleResult
    const heroRadius = canvas.height / 10
    const fontSize = canvas.height < 600 ? 30 : 48

    class Projectile {
      constructor(game, x, y, distanceX, distanceY, targetIndex, damage, critical, type) {
        this.game = game
        this.x = x
        this.y = y
        this.typeProjectile = Math.floor(Math.random() * 5) + 1
        this.image = document.getElementById(`projectile${this.typeProjectile}_1`)
        this.width = heroRadius * 1.5
        this.height = heroRadius * 1.5
        this.distanceX = distanceX
        this.distanceY = distanceY
        this.targetX = type == 'ally' ? x + distanceX - heroRadius : x + distanceX + heroRadius
        this.targetIndex = targetIndex
        this.damage = damage
        this.markedForDeletion = false
        this.critical = critical
        this.counter = 1
        this.type = type
      }
      update() {
        this.x += this.distanceX * this.game.elapsed
        this.y += this.distanceY * this.game.elapsed
        this.image = document.getElementById(`projectile${this.typeProjectile}_${this.counter}`)
        this.counter++
        if (this.counter > 64) {
          this.counter = 1
        }
      }
      draw(context) {
        if (this.type == 'enemy') {
          context.save();
          context.translate(0, 0)
          context.rotate(Math.PI)
          context.drawImage(this.image, -this.x - this.width / 2, -this.y - this.height / 2, this.width, this.height)
          context.restore()
        } else {
          context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
        }
      }
    }

    class Impact {
      constructor(game, x, y, type) {
        this.game = game
        this.x = x
        this.y = y
        this.type = type
        this.image = document.getElementById(`impact${this.type}_1`)
        this.width = heroRadius * 4
        this.height = heroRadius * 4
        this.counter = 1
        this.markedForDeletion = false
      }
      update() {
        if (this.type <= 2) {
          this.image = document.getElementById(`impact${this.type}_${Math.floor(this.counter / 2) + 1}`)
        } else {
          this.image = document.getElementById(`impact${this.type}_${this.counter}`)
        }
        this.counter++
        if (this.counter > 64) {
          this.markedForDeletion = true
          this.game.isShooting = false
        }
      }
      draw(context) {
        if (!this.markedForDeletion) {
          if (this.type == 6) {
            this.height = heroRadius * 2 + 50
            this.width = heroRadius * 2 + 50
          }
          context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
        }
      }
    }

    class Hit {
      constructor(x, y, hit) {
        this.x = x
        this.y = y
        this.appear = y - 0.05
        this.speed = -0.001
        this.fontSize = fontSize
        this.markedForDeletion = false
        this.hit = hit
      }
      update() {
        this.y += this.speed;
        if (this.y < this.appear) {
          this.markedForDeletion = true
        }
      }
      draw(context) {
        this.preShake(context)
        context.font = `${this.fontSize}px Tyke ITC Std`
        context.textAlign = 'center'
        context.strokeStyle = '#862e0f'
        context.lineWidth = 10

        context.strokeText(`${this.hit}`, this.x, this.y)
        context.fillStyle = "#ffa41e"
        context.fillText(`${this.hit}`, this.x, this.y)
        this.postShake(context)
      }
      preShake(context) {
        context.save()
        var dx = Math.random() * 3
        var dy = Math.random() * 3
        context.translate(dx, dy)
      }
      postShake(context) {
        context.restore()
      }
    }

    class Hero {
      constructor(game, x, y, hpColor, info, hp, attack) {
        this.game = game
        this.info = info
        this.x = x
        this.y = y
        this.radius = heroRadius
        this.hp = hp
        this.maxHp = hp
        this.hpColor = hpColor
        this.image = document.getElementById(`${info.element}-${info.rarity}`)
        this.speed = 0

        this.hpRatio = 0
        this.attack = attack
        this.immortal = false
        this.critical = false

        this.fire = false
        this.projectileX = 0
        this.prokectileY = 0
        this.targetIndex = 0

        this.markedForDeletion = false
        this.imageDie = document.getElementById('die')
      }

      update() {
        this.radius += this.speed;
        if (this.radius <= heroRadius - 15) {
          this.speed = 2
        } else if (this.radius == heroRadius) {
          this.speed = 0
        } else if (this.radius > heroRadius + 8) {
          this.speed = -1.5
        }

        if (this.fire && this.speed == 0) {
          if (this.projectileX > 0) {
            this.game.allyShoot.push(new Projectile(this.game, this.x + this.radius, this.y, this.projectileX, this.prokectileY, this.targetIndex, this.attack, this.critical, 'ally'))
          } else {
            this.game.enemyShoot.push(new Projectile(this.game, this.x - this.radius, this.y, this.projectileX, this.prokectileY, this.targetIndex, this.attack, this.critical, 'enemy'))
          }
          this.fire = false
        }
      }

      draw(context) {
        context.shadowColor = "white"
        context.shadowBlur = 15

        const gradient = context.createLinearGradient(
          this.x - this.radius + 15,
          this.y - this.radius + 15,
          this.x - this.radius + 15,
          this.y - this.radius + 15 + (this.radius - 15) * 2,
        )

        gradient.addColorStop(0, getFirstStopGradient(this.info.rarity))
        gradient.addColorStop(1, getSecondStopGradient(this.info.rarity))
        if (this.markedForDeletion) {
          context.fillStyle = "#4b5563"
        } else {
          context.fillStyle = gradient
        }

        context.beginPath()
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        context.fill()

        context.shadowBlur = 0
        if (this.markedForDeletion) {
          context.globalAlpha = 0.4
        }
        context.drawImage(
          this.image,
          this.x - this.radius + 15,
          this.y - this.radius + 15,
          (this.radius - 15) * 2,
          (this.radius - 15) * 2,
        )
        if (this.markedForDeletion) {
          context.globalAlpha = 1
        }

        context.strokeStyle = "black"
        context.lineWidth = 2
        context.beginPath()
        context.arc(
          this.x,
          this.y,
          this.radius - 0,
          -Math.PI * 0.5,
          Math.PI * 1.5,
          true,
        )
        context.stroke()

        context.strokeStyle = "black"
        context.lineWidth = 2
        context.beginPath()
        context.arc(
          this.x,
          this.y,
          this.radius - 8,
          -Math.PI * 0.5,
          Math.PI * 1.5,
          true,
        )
        context.stroke()

        context.strokeStyle = "white"
        context.lineWidth = 6
        // Draw the inner circle line
        context.beginPath()
        context.arc(
          this.x,
          this.y,
          this.radius - 4,
          -Math.PI * 0.5,
          Math.PI * 1.5,
          true,
        )
        context.stroke()

        context.strokeStyle = this.hpColor
        context.lineWidth = 6

        context.beginPath()
        if (this.hpRatio >= 2) {
          this.hpRatio = 2
        }
        context.arc(
          this.x,
          this.y,
          this.radius - 4,
          -Math.PI * 0.5,
          Math.PI * (1.5 + this.hpRatio),
          true,
        )
        context.stroke()

        if (this.markedForDeletion) {
          context.drawImage(
            this.imageDie,
            this.x - this.radius + 15,
            this.y - this.radius + 15,
            (this.radius - 15) * 2,
            (this.radius - 15) * 2,
          )
        }
      }
    }

    class Background {
      constructor(game) {
        this.game = game
        this.image = document.getElementById('background')
        this.x = 0
        this.y = 0
        this.width = this.game.width
        this.height = this.game.height
      }
      draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
      }
    }

    class Effect {
      constructor(game, x, y, type) {
        this.game = game
        this.x = x
        this.y = y
        this.type = type
        this.image = document.getElementById(`effect${this.type}_1`)
        this.width = 1024
        this.height = 1024
        this.counter = 1
      }
      update() {
        this.image = document.getElementById(`effect${this.type}_${this.counter}`)
        this.counter++
        if (this.counter > 64) {
          this.counter = 1
        }
      }
      draw(context) {
        if (this.type == 3) {
          this.width = heroRadius * 4
          this.height = heroRadius * 4
        }
        context.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height)
      }
    }

    class Button {
      constructor(game, x, y, width, height, message) {
        this.game = game
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.message = message
        this.markedForDeletion = false
        this.mouseOver = false
        this.buttonColor = "#2a52be"
        this.textColor = "#dbdbdb"
      }
      update() {
        if (this.mouseOver) {
          this.buttonColor = "#23449e"
        } else {
          this.buttonColor = "#2a52be"
        }
      }
      draw(context) {
        if (!this.markedForDeletion) {
          context.fillStyle = this.buttonColor;
          context.beginPath();
          context.roundRect(this.x, this.y, this.width, this.height, 10);
          context.fill();
          context.fillStyle = this.textColor;
          context.font = `24px Tyke ITC Std`;
          context.textAlign = 'center'
          context.fillText(this.message, this.x + this.width / 2, this.y + this.height / 1.5);
        }
      }
      isInsideButton(x: number, y: number) {
        return x > this.x && x < this.x + this.width && y > this.y && y < this.y + this.height;
      }
    }

    class Sound {
      constructor(game) {
        this.background = document.getElementById("background-sound")
        this.background.volume = 0.25
        this.background.play()
        this.hit = document.getElementById("hit-sound")
        this.shield = document.getElementById("shield-sound")
        this.win = document.getElementById("win-sound")
        this.lose = document.getElementById("lose-sound")
      }
    }

    class Game {
      constructor(width, height, result) {
        this.width = width
        this.height = height
        this.result = result
        this.isFinish = false
        this.elapsed = 0
        this.round = 0
        this.randomExist = Math.floor(Math.random() * 2) + 1
        this.isShooting = false

        this.ally = []
        this.initHero(squadInfos, 'ally')
        this.allyShoot = []

        this.enemy = []
        this.initHero(opSquadInfos, 'enemy')
        this.enemyShoot = []

        this.hits = []
        this.impacts = []
        this.effects = []
        this.background = new Background(this)
        this.sound = new Sound(this)
        this.skipButton = new Button(this, this.width - 140, this.height - 65, 100, 40, "Skip")
      }

      initHero(squad, side) {
        const allyCoordinates = getCoordinates(squad.length, this.width, this.height)
        for (let i = 0; i < squad.length; i++) {
          const hp = getHeroHP(squad[i].rarity)
          const attack = getHeroDamage(squad[i].rarity)
          const hero = side == "enemy" ? new Hero(
            this,
            this.width - allyCoordinates.coordinatesX[i],
            this.height - allyCoordinates.coordinatesY[i],
            'red',
            squad[i],
            hp,
            attack,
          ) : new Hero(
            this,
            allyCoordinates.coordinatesX[i],
            allyCoordinates.coordinatesY[i],
            'green',
            squad[i],
            hp,
            attack,
          );
          if (side == 'enemy') {
            this.enemy.push(hero)
          } else {
            this.ally.push(hero)
          }
        }
      }

      update() {
        this.ally.forEach((hero) => { hero.update() })
        this.enemy.forEach((hero) => { hero.update() })

        this.allyShoot = this.allyShoot.filter((projectile) => !projectile.markedForDeletion)
        this.enemyShoot = this.enemyShoot.filter((projectile) => !projectile.markedForDeletion)

        this.allyShoot.forEach((shoot) => {
          shoot.update()
          if (shoot.x >= shoot.targetX) {
            shoot.markedForDeletion = true
            this.enemy[shoot.targetIndex].speed = 1
            let hit = "1 Hit!"
            let bonus = Math.random() * 10

            if (this.enemy[shoot.targetIndex].immortal == true) {
              this.sound.shield.play()
              hit = "MISS!"
              this.impacts.push(new Impact(this, this.enemy[shoot.targetIndex].x, this.enemy[shoot.targetIndex].y, 6))
              this.enemy[shoot.targetIndex].immortal = false
            } else {
              this.sound.hit.play()
              this.enemy[shoot.targetIndex].hpRatio += (shoot.damage + bonus) / this.enemy[shoot.targetIndex].maxHp * 2
              if (this.enemy[shoot.targetIndex].hpRatio >= 2) {
                this.enemy[shoot.targetIndex].markedForDeletion = true
              }
              this.enemy[shoot.targetIndex].hp -= (shoot.damage + bonus)
              if (this.enemy[shoot.targetIndex].hp < 0) {
                this.enemy[shoot.targetIndex].hp = 0
              }
              if (shoot.critical) {
                hit = `${Math.floor(Math.random() * 2) + 2} Hits!`
              }
              this.impacts.push(new Impact(this, this.enemy[shoot.targetIndex].x, this.enemy[shoot.targetIndex].y, shoot.typeProjectile))
            }
            this.hits.push(new Hit(this.enemy[shoot.targetIndex].x, this.enemy[shoot.targetIndex].y - this.enemy[shoot.targetIndex].radius - 15, hit))
          }
        })

        this.enemyShoot.forEach((shoot) => {
          shoot.update()
          if (shoot.x < shoot.targetX) {
            shoot.markedForDeletion = true
            this.ally[shoot.targetIndex].speed = 1
            let hit = "1 Hit!"
            let bonus = Math.random() * 10

            if (this.ally[shoot.targetIndex].immortal == true) {
              this.sound.shield.play()
              hit = "MISS!";
              this.impacts.push(new Impact(this, this.ally[shoot.targetIndex].x, this.ally[shoot.targetIndex].y, 6))
              this.ally[shoot.targetIndex].immortal = false
            } else {
              this.sound.hit.play()
              this.ally[shoot.targetIndex].hpRatio += (shoot.damage + bonus) / this.ally[shoot.targetIndex].maxHp * 2
              if (this.ally[shoot.targetIndex].hpRatio >= 2) {
                this.ally[shoot.targetIndex].markedForDeletion = true
              }
              this.ally[shoot.targetIndex].hp -= (shoot.damage + bonus)
              if (this.ally[shoot.targetIndex].hp < 0) {
                this.ally[shoot.targetIndex].hp = 0
              }
              if (shoot.critical) {
                hit = `${Math.floor(Math.random() * 2) + 2} Hits!`
              }
              this.impacts.push(new Impact(this, this.ally[shoot.targetIndex].x, this.ally[shoot.targetIndex].y, shoot.typeProjectile))
            }
            this.hits.push(new Hit(this.ally[shoot.targetIndex].x, this.ally[shoot.targetIndex].y - this.ally[shoot.targetIndex].radius - 15, hit))
          }
        })

        this.hits = this.hits.filter((hit) => !hit.markedForDeletion)
        this.hits.forEach((hit) => { hit.update() })

        this.impacts = this.impacts.filter((impact) => !impact.markedForDeletion)
        this.impacts.forEach((hero) => { hero.update() })

        this.effects.forEach((effect) => { effect.update() })
        this.skipButton.update()
      }

      draw(context) {
        this.background.draw(context);
        this.ally.forEach((hero) => { hero.draw(context) })
        this.enemy.forEach((hero) => { hero.draw(context) })
        this.enemyShoot.forEach((projectile) => { projectile.draw(context) })
        this.allyShoot.forEach((projectile) => { projectile.draw(context) })
        this.hits.forEach((hit) => { hit.draw(context) })
        this.impacts.forEach((hero) => { hero.draw(context) })
        this.effects.forEach((effect) => { effect.draw(context) })
        this.skipButton.draw(context)
      }

      finish() {
        const ally = this.ally.filter((hero) => !hero.markedForDeletion)
        const enemy = this.enemy.filter((hero) => !hero.markedForDeletion)
        if (ally.length == 0 || enemy.length == 0) {
          this.endGame()
          this.isFinish = true
          return true
        }
        this.isFinish = false
        return false
      }

      checkExist(winSide, defenderX, attack) {
        winSide = winSide.filter((hero) => !hero.markedForDeletion)
        if (winSide.length <= this.randomExist) {
          winSide.forEach((hero) => {
            if (hero.hp <= attack + 10 && hero.x == defenderX) {
              hero.immortal = true
              hero.attack = getHeroDamage(hero.info.rarity) * (Math.random() * 0.5 + 1.25)
              hero.critical = true
            }
          })
        }
      }

      randomAttack(attacker, defender) {
        this.isShooting = true;
        attacker = attacker.filter((hero) => !hero.markedForDeletion)
        defender = defender.filter((hero) => !hero.markedForDeletion)
        const randomDefender = defender[Math.floor(Math.random() * defender.length)]
        const randomAttacker = attacker[Math.floor(Math.random() * attacker.length)]
        if (this.result == "stronger_win" || this.result == "weaker_win") {
          this.checkExist(this.ally, randomDefender.x, randomAttacker.attack);
        } else {
          this.checkExist(this.enemy, randomDefender.x, randomAttacker.attack);
        }

        randomAttacker.projectileX = (randomDefender.x - randomAttacker.x) > 0 ? randomDefender.x - randomAttacker.x - randomAttacker.radius : randomDefender.x - randomAttacker.x + randomAttacker.radius
        randomAttacker.prokectileY = randomDefender.y - randomAttacker.y
        randomAttacker.speed = -1.25
        randomAttacker.fire = true
        if (randomAttacker.projectileX > 0) {
          this.enemy.forEach((hero, index) => {
            if (hero.y == randomDefender.y) {
              randomAttacker.targetIndex = index
            }
          })
        } else {
          this.ally.forEach((hero, index) => {
            if (hero.y == randomDefender.y) {
              randomAttacker.targetIndex = index
            }
          })
        }
      }

      critAttack(heros) {
        heros.forEach((hero) => {
          hero.attack = getHeroDamage(hero.info.rarity) * (Math.random() * 0.4 + 1.2)
          hero.critical = true
        })
      }

      endGame() {
        this.sound.background.pause()
        game.skipButton.markedForDeletion = true
        if (this.result == "stronger_win" || this.result == "weaker_win") {
          this.sound.win.play();
          this.effects.push(new Effect(this, this.width / 2 - 50, this.height / 2 + 50, 1))
          this.effects.push(new Effect(this, this.width / 2 + 50, this.height / 2 - 50, 1))
          this.effects.push(new Effect(this, this.width / 4, this.height / 2 - 50, 2))
          this.effects.push(new Effect(this, this.width / 4 * 3, this.height / 2 - 50, 2))
          this.ally.forEach((hero) => {
            if (!hero.markedForDeletion) {
              this.effects.push(new Effect(this, hero.x, hero.y, 3))
            }
          })
        } else {
          this.sound.lose.play()
          this.effects.push(new Effect(this, this.width / 5 * 4, this.height / 2 - 50, 2));
          this.enemy.forEach((hero) => {
            if (!hero.markedForDeletion) {
              this.effects.push(new Effect(this, hero.x, hero.y, 3))
            }
          })
        }
        setIsEnded(true)
      }

      async battle() {
        while (!this.isFinish) {
          this.finish()

          if (this.isShooting) {
            await sleep(200)
          } else {
            if (this.round >= 3) {
              if (this.result == "stronger_lose") {
                this.critAttack(this.enemy)
              } else if (this.result == "weaker_win") {
                this.critAttack(this.ally)
              }
            }

            if (this.round % 2 == 0) {
              this.randomAttack(this.ally, this.enemy)
            } else {
              this.randomAttack(this.enemy, this.ally)
            }
            this.round++
          }
        }
      }
    }

    let prevTime = Date.now()
    const game = new Game(canvas.width, canvas.height, battleResult)
    const FRAMES_PER_SECOND = 60;
    const FRAME_MIN_TIME = (1000 / FRAMES_PER_SECOND - 1000 / 60 * 0.5) / 1000;

    ; (function animate() {
      game.elapsed = (Date.now() - prevTime) / 1000
      if (game.elapsed >= FRAME_MIN_TIME) {
        prevTime = Date.now()
        game.update()
        game.draw(ctx)
      }
      requestAnimationFrame(animate)
    })()

    game.battle()

    canvas.addEventListener('click', (e) => {
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;

      if (game.skipButton.isInsideButton(mouseX, mouseY)) {
        game.isFinish = true
        game.enemyShoot.forEach((projectile) => projectile.markedForDeletion = true)
        game.allyShoot.forEach((projectile) => projectile.markedForDeletion = true)
        if (game.result == "stronger_win" || game.result == "weaker_win") {
          game.enemy.forEach((hero) => {
            if (!hero.markedForDeletion) {
              hero.hpRatio = 2
              hero.markedForDeletion = true
            }
          })
        } else {
          game.ally.forEach((hero) => {
            if (!hero.markedForDeletion) {
              hero.hpRatio = 2
              hero.markedForDeletion = true
            }
          })
        }
        game.endGame()
      }
    });

    canvas.addEventListener('mousemove', (e) => {
      const mouseX = e.clientX - canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - canvas.getBoundingClientRect().top;

      if (game.skipButton.isInsideButton(mouseX, mouseY)) {
        game.skipButton.mouseOver = true
      } else {
        game.skipButton.mouseOver = false
      }
    })
  }, [isWin, isLoadedImages, counter])

  useEffect(() => {
    if (isLoadedImages) {
      if (counter == 0) {
        return
      }
      const interval = setInterval(() => {
        setCounter(counter - 1)
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [counter, isLoadedImages])

  useEffect(() => {
    if (imageLoaded >= 935) {
      setIsLoadedImages(true)
    }
  }, [imageLoaded])

  const isLoading = () => {
    return counter > 0 && isLoadedImages
  }

  const loadedImage = () => {
    setImageLoaded(prev => prev + 1)
  }

  return (
    <div className="relative h-[calc(100vh_-_136px)]">
      {!isLoadedImages && (<PageLoading className="h-[75vh]" />)}
      <div className="relative">
        <canvas
          id="game"
          className={classNames(isEnded ? "opacity-20" : "")}
        ></canvas>
        <img src="/assets/gameplay/images/die.png" style={{ display: "none" }} id="die" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/background.jpg" style={{ display: "none" }} id="background" onLoad={loadedImage} />

        <img src="/assets/characters/boy-common.png" style={{ display: "none" }} id="boy-common" onLoad={loadedImage} />
        <img src="/assets/characters/boy-uncommon.png" style={{ display: "none" }} id="boy-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/boy-rare.png" style={{ display: "none" }} id="boy-rare" onLoad={loadedImage} />
        <img src="/assets/characters/boy-legendary.png" style={{ display: "none" }} id="boy-legendary" onLoad={loadedImage} />
        <img src="/assets/characters/dogee-common.png" style={{ display: "none" }} id="dogee-common" onLoad={loadedImage} />
        <img src="/assets/characters/dogee-epic.png" style={{ display: "none" }} id="dogee-epic" onLoad={loadedImage} />
        <img src="/assets/characters/dogee-uncommon.png" style={{ display: "none" }} id="dogee-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/dogee-rare.png" style={{ display: "none" }} id="dogee-rare" onLoad={loadedImage} />
        <img src="/assets/characters/maruko-common.png" style={{ display: "none" }} id="maruko-common" onLoad={loadedImage} />
        <img src="/assets/characters/maruko-epic.png" style={{ display: "none" }} id="maruko-epic" onLoad={loadedImage} />
        <img src="/assets/characters/maruko-uncommon.png" style={{ display: "none" }} id="maruko-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/maruko-rare.png" style={{ display: "none" }} id="maruko-rare" onLoad={loadedImage} />
        <img src="/assets/characters/meowy-common.png" style={{ display: "none" }} id="meowy-common" onLoad={loadedImage} />
        <img src="/assets/characters/meowy-epic.png" style={{ display: "none" }} id="meowy-epic" onLoad={loadedImage} />
        <img src="/assets/characters/meowy-uncommon.png" style={{ display: "none" }} id="meowy-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/meowy-rare.png" style={{ display: "none" }} id="meowy-rare" onLoad={loadedImage} />
        <img src="/assets/characters/panda-common.png" style={{ display: "none" }} id="panda-common" onLoad={loadedImage} />
        <img src="/assets/characters/panda-epic.png" style={{ display: "none" }} id="panda-epic" onLoad={loadedImage} />
        <img src="/assets/characters/panda-uncommon.png" style={{ display: "none" }} id="panda-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/panda-rare.png" style={{ display: "none" }} id="panda-rare" onLoad={loadedImage} />
        <img src="/assets/characters/quby-common.png" style={{ display: "none" }} id="quby-common" onLoad={loadedImage} />
        <img src="/assets/characters/quby-epic.png" style={{ display: "none" }} id="quby-epic" onLoad={loadedImage} />
        <img src="/assets/characters/quby-uncommon.png" style={{ display: "none" }} id="quby-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/quby-rare.png" style={{ display: "none" }} id="quby-rare" onLoad={loadedImage} />
        <img src="/assets/characters/shibafat-common.png" style={{ display: "none" }} id="shibafat-common" onLoad={loadedImage} />
        <img src="/assets/characters/shibafat-uncommon.png" style={{ display: "none" }} id="shibafat-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/shibafat-rare.png" style={{ display: "none" }} id="shibafat-rare" onLoad={loadedImage} />
        <img src="/assets/characters/shibafat-legendary.png" style={{ display: "none" }} id="shibafat-legendary" onLoad={loadedImage} />
        <img src="/assets/characters/sir-common.png" style={{ display: "none" }} id="sir-common" onLoad={loadedImage} />
        <img src="/assets/characters/sir-epic.png" style={{ display: "none" }} id="sir-epic" onLoad={loadedImage} />
        <img src="/assets/characters/sir-uncommon.png" style={{ display: "none" }} id="sir-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/sir-rare.png" style={{ display: "none" }} id="sir-rare" onLoad={loadedImage} />
        <img src="/assets/characters/sir-legendary.png" style={{ display: "none" }} id="sir-legendary" onLoad={loadedImage} />
        <img src="/assets/characters/tobee-common.png" style={{ display: "none" }} id="tobee-common" onLoad={loadedImage} />
        <img src="/assets/characters/tobee-epic.png" style={{ display: "none" }} id="tobee-epic" onLoad={loadedImage} />
        <img src="/assets/characters/tobee-uncommon.png" style={{ display: "none" }} id="tobee-uncommon" onLoad={loadedImage} />
        <img src="/assets/characters/tobee-rare.png" style={{ display: "none" }} id="tobee-rare" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/projectile/fire/1.png" style={{ display: "none" }} id="projectile1_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/2.png" style={{ display: "none" }} id="projectile1_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/3.png" style={{ display: "none" }} id="projectile1_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/4.png" style={{ display: "none" }} id="projectile1_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/5.png" style={{ display: "none" }} id="projectile1_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/6.png" style={{ display: "none" }} id="projectile1_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/7.png" style={{ display: "none" }} id="projectile1_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/8.png" style={{ display: "none" }} id="projectile1_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/9.png" style={{ display: "none" }} id="projectile1_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/10.png" style={{ display: "none" }} id="projectile1_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/11.png" style={{ display: "none" }} id="projectile1_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/12.png" style={{ display: "none" }} id="projectile1_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/13.png" style={{ display: "none" }} id="projectile1_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/14.png" style={{ display: "none" }} id="projectile1_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/15.png" style={{ display: "none" }} id="projectile1_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/16.png" style={{ display: "none" }} id="projectile1_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/17.png" style={{ display: "none" }} id="projectile1_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/18.png" style={{ display: "none" }} id="projectile1_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/19.png" style={{ display: "none" }} id="projectile1_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/20.png" style={{ display: "none" }} id="projectile1_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/21.png" style={{ display: "none" }} id="projectile1_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/22.png" style={{ display: "none" }} id="projectile1_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/23.png" style={{ display: "none" }} id="projectile1_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/24.png" style={{ display: "none" }} id="projectile1_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/25.png" style={{ display: "none" }} id="projectile1_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/26.png" style={{ display: "none" }} id="projectile1_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/27.png" style={{ display: "none" }} id="projectile1_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/28.png" style={{ display: "none" }} id="projectile1_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/29.png" style={{ display: "none" }} id="projectile1_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/30.png" style={{ display: "none" }} id="projectile1_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/31.png" style={{ display: "none" }} id="projectile1_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/32.png" style={{ display: "none" }} id="projectile1_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/33.png" style={{ display: "none" }} id="projectile1_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/34.png" style={{ display: "none" }} id="projectile1_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/35.png" style={{ display: "none" }} id="projectile1_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/36.png" style={{ display: "none" }} id="projectile1_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/37.png" style={{ display: "none" }} id="projectile1_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/38.png" style={{ display: "none" }} id="projectile1_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/39.png" style={{ display: "none" }} id="projectile1_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/40.png" style={{ display: "none" }} id="projectile1_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/41.png" style={{ display: "none" }} id="projectile1_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/42.png" style={{ display: "none" }} id="projectile1_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/43.png" style={{ display: "none" }} id="projectile1_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/44.png" style={{ display: "none" }} id="projectile1_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/45.png" style={{ display: "none" }} id="projectile1_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/46.png" style={{ display: "none" }} id="projectile1_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/47.png" style={{ display: "none" }} id="projectile1_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/48.png" style={{ display: "none" }} id="projectile1_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/49.png" style={{ display: "none" }} id="projectile1_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/50.png" style={{ display: "none" }} id="projectile1_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/51.png" style={{ display: "none" }} id="projectile1_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/52.png" style={{ display: "none" }} id="projectile1_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/53.png" style={{ display: "none" }} id="projectile1_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/54.png" style={{ display: "none" }} id="projectile1_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/55.png" style={{ display: "none" }} id="projectile1_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/56.png" style={{ display: "none" }} id="projectile1_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/57.png" style={{ display: "none" }} id="projectile1_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/58.png" style={{ display: "none" }} id="projectile1_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/59.png" style={{ display: "none" }} id="projectile1_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/60.png" style={{ display: "none" }} id="projectile1_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/61.png" style={{ display: "none" }} id="projectile1_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/62.png" style={{ display: "none" }} id="projectile1_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/63.png" style={{ display: "none" }} id="projectile1_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/fire/64.png" style={{ display: "none" }} id="projectile1_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/projectile/lightning/1.png" style={{ display: "none" }} id="projectile2_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/2.png" style={{ display: "none" }} id="projectile2_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/3.png" style={{ display: "none" }} id="projectile2_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/4.png" style={{ display: "none" }} id="projectile2_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/5.png" style={{ display: "none" }} id="projectile2_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/6.png" style={{ display: "none" }} id="projectile2_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/7.png" style={{ display: "none" }} id="projectile2_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/8.png" style={{ display: "none" }} id="projectile2_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/9.png" style={{ display: "none" }} id="projectile2_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/10.png" style={{ display: "none" }} id="projectile2_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/11.png" style={{ display: "none" }} id="projectile2_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/12.png" style={{ display: "none" }} id="projectile2_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/13.png" style={{ display: "none" }} id="projectile2_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/14.png" style={{ display: "none" }} id="projectile2_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/15.png" style={{ display: "none" }} id="projectile2_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/16.png" style={{ display: "none" }} id="projectile2_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/17.png" style={{ display: "none" }} id="projectile2_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/18.png" style={{ display: "none" }} id="projectile2_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/19.png" style={{ display: "none" }} id="projectile2_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/20.png" style={{ display: "none" }} id="projectile2_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/21.png" style={{ display: "none" }} id="projectile2_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/22.png" style={{ display: "none" }} id="projectile2_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/23.png" style={{ display: "none" }} id="projectile2_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/24.png" style={{ display: "none" }} id="projectile2_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/25.png" style={{ display: "none" }} id="projectile2_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/26.png" style={{ display: "none" }} id="projectile2_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/27.png" style={{ display: "none" }} id="projectile2_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/28.png" style={{ display: "none" }} id="projectile2_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/29.png" style={{ display: "none" }} id="projectile2_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/30.png" style={{ display: "none" }} id="projectile2_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/31.png" style={{ display: "none" }} id="projectile2_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/32.png" style={{ display: "none" }} id="projectile2_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/33.png" style={{ display: "none" }} id="projectile2_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/34.png" style={{ display: "none" }} id="projectile2_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/35.png" style={{ display: "none" }} id="projectile2_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/36.png" style={{ display: "none" }} id="projectile2_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/37.png" style={{ display: "none" }} id="projectile2_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/38.png" style={{ display: "none" }} id="projectile2_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/39.png" style={{ display: "none" }} id="projectile2_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/40.png" style={{ display: "none" }} id="projectile2_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/41.png" style={{ display: "none" }} id="projectile2_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/42.png" style={{ display: "none" }} id="projectile2_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/43.png" style={{ display: "none" }} id="projectile2_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/44.png" style={{ display: "none" }} id="projectile2_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/45.png" style={{ display: "none" }} id="projectile2_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/46.png" style={{ display: "none" }} id="projectile2_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/47.png" style={{ display: "none" }} id="projectile2_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/48.png" style={{ display: "none" }} id="projectile2_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/49.png" style={{ display: "none" }} id="projectile2_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/50.png" style={{ display: "none" }} id="projectile2_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/51.png" style={{ display: "none" }} id="projectile2_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/52.png" style={{ display: "none" }} id="projectile2_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/53.png" style={{ display: "none" }} id="projectile2_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/54.png" style={{ display: "none" }} id="projectile2_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/55.png" style={{ display: "none" }} id="projectile2_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/56.png" style={{ display: "none" }} id="projectile2_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/57.png" style={{ display: "none" }} id="projectile2_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/58.png" style={{ display: "none" }} id="projectile2_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/59.png" style={{ display: "none" }} id="projectile2_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/60.png" style={{ display: "none" }} id="projectile2_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/61.png" style={{ display: "none" }} id="projectile2_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/62.png" style={{ display: "none" }} id="projectile2_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/63.png" style={{ display: "none" }} id="projectile2_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/lightning/64.png" style={{ display: "none" }} id="projectile2_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/projectile/poison/1.png" style={{ display: "none" }} id="projectile3_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/2.png" style={{ display: "none" }} id="projectile3_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/3.png" style={{ display: "none" }} id="projectile3_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/4.png" style={{ display: "none" }} id="projectile3_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/5.png" style={{ display: "none" }} id="projectile3_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/6.png" style={{ display: "none" }} id="projectile3_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/7.png" style={{ display: "none" }} id="projectile3_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/8.png" style={{ display: "none" }} id="projectile3_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/9.png" style={{ display: "none" }} id="projectile3_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/10.png" style={{ display: "none" }} id="projectile3_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/11.png" style={{ display: "none" }} id="projectile3_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/12.png" style={{ display: "none" }} id="projectile3_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/13.png" style={{ display: "none" }} id="projectile3_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/14.png" style={{ display: "none" }} id="projectile3_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/15.png" style={{ display: "none" }} id="projectile3_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/16.png" style={{ display: "none" }} id="projectile3_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/17.png" style={{ display: "none" }} id="projectile3_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/18.png" style={{ display: "none" }} id="projectile3_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/19.png" style={{ display: "none" }} id="projectile3_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/20.png" style={{ display: "none" }} id="projectile3_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/21.png" style={{ display: "none" }} id="projectile3_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/22.png" style={{ display: "none" }} id="projectile3_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/23.png" style={{ display: "none" }} id="projectile3_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/24.png" style={{ display: "none" }} id="projectile3_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/25.png" style={{ display: "none" }} id="projectile3_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/26.png" style={{ display: "none" }} id="projectile3_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/27.png" style={{ display: "none" }} id="projectile3_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/28.png" style={{ display: "none" }} id="projectile3_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/29.png" style={{ display: "none" }} id="projectile3_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/30.png" style={{ display: "none" }} id="projectile3_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/31.png" style={{ display: "none" }} id="projectile3_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/32.png" style={{ display: "none" }} id="projectile3_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/33.png" style={{ display: "none" }} id="projectile3_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/34.png" style={{ display: "none" }} id="projectile3_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/35.png" style={{ display: "none" }} id="projectile3_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/36.png" style={{ display: "none" }} id="projectile3_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/37.png" style={{ display: "none" }} id="projectile3_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/38.png" style={{ display: "none" }} id="projectile3_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/39.png" style={{ display: "none" }} id="projectile3_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/40.png" style={{ display: "none" }} id="projectile3_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/41.png" style={{ display: "none" }} id="projectile3_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/42.png" style={{ display: "none" }} id="projectile3_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/43.png" style={{ display: "none" }} id="projectile3_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/44.png" style={{ display: "none" }} id="projectile3_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/45.png" style={{ display: "none" }} id="projectile3_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/46.png" style={{ display: "none" }} id="projectile3_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/47.png" style={{ display: "none" }} id="projectile3_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/48.png" style={{ display: "none" }} id="projectile3_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/49.png" style={{ display: "none" }} id="projectile3_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/50.png" style={{ display: "none" }} id="projectile3_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/51.png" style={{ display: "none" }} id="projectile3_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/52.png" style={{ display: "none" }} id="projectile3_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/53.png" style={{ display: "none" }} id="projectile3_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/54.png" style={{ display: "none" }} id="projectile3_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/55.png" style={{ display: "none" }} id="projectile3_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/56.png" style={{ display: "none" }} id="projectile3_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/57.png" style={{ display: "none" }} id="projectile3_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/58.png" style={{ display: "none" }} id="projectile3_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/59.png" style={{ display: "none" }} id="projectile3_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/60.png" style={{ display: "none" }} id="projectile3_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/61.png" style={{ display: "none" }} id="projectile3_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/62.png" style={{ display: "none" }} id="projectile3_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/63.png" style={{ display: "none" }} id="projectile3_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/poison/64.png" style={{ display: "none" }} id="projectile3_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/projectile/water/1.png" style={{ display: "none" }} id="projectile4_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/2.png" style={{ display: "none" }} id="projectile4_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/3.png" style={{ display: "none" }} id="projectile4_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/4.png" style={{ display: "none" }} id="projectile4_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/5.png" style={{ display: "none" }} id="projectile4_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/6.png" style={{ display: "none" }} id="projectile4_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/7.png" style={{ display: "none" }} id="projectile4_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/8.png" style={{ display: "none" }} id="projectile4_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/9.png" style={{ display: "none" }} id="projectile4_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/10.png" style={{ display: "none" }} id="projectile4_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/11.png" style={{ display: "none" }} id="projectile4_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/12.png" style={{ display: "none" }} id="projectile4_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/13.png" style={{ display: "none" }} id="projectile4_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/14.png" style={{ display: "none" }} id="projectile4_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/15.png" style={{ display: "none" }} id="projectile4_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/16.png" style={{ display: "none" }} id="projectile4_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/17.png" style={{ display: "none" }} id="projectile4_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/18.png" style={{ display: "none" }} id="projectile4_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/19.png" style={{ display: "none" }} id="projectile4_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/20.png" style={{ display: "none" }} id="projectile4_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/21.png" style={{ display: "none" }} id="projectile4_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/22.png" style={{ display: "none" }} id="projectile4_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/23.png" style={{ display: "none" }} id="projectile4_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/24.png" style={{ display: "none" }} id="projectile4_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/25.png" style={{ display: "none" }} id="projectile4_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/26.png" style={{ display: "none" }} id="projectile4_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/27.png" style={{ display: "none" }} id="projectile4_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/28.png" style={{ display: "none" }} id="projectile4_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/29.png" style={{ display: "none" }} id="projectile4_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/30.png" style={{ display: "none" }} id="projectile4_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/31.png" style={{ display: "none" }} id="projectile4_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/32.png" style={{ display: "none" }} id="projectile4_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/33.png" style={{ display: "none" }} id="projectile4_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/34.png" style={{ display: "none" }} id="projectile4_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/35.png" style={{ display: "none" }} id="projectile4_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/36.png" style={{ display: "none" }} id="projectile4_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/37.png" style={{ display: "none" }} id="projectile4_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/38.png" style={{ display: "none" }} id="projectile4_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/39.png" style={{ display: "none" }} id="projectile4_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/40.png" style={{ display: "none" }} id="projectile4_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/41.png" style={{ display: "none" }} id="projectile4_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/42.png" style={{ display: "none" }} id="projectile4_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/43.png" style={{ display: "none" }} id="projectile4_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/44.png" style={{ display: "none" }} id="projectile4_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/45.png" style={{ display: "none" }} id="projectile4_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/46.png" style={{ display: "none" }} id="projectile4_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/47.png" style={{ display: "none" }} id="projectile4_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/48.png" style={{ display: "none" }} id="projectile4_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/49.png" style={{ display: "none" }} id="projectile4_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/50.png" style={{ display: "none" }} id="projectile4_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/51.png" style={{ display: "none" }} id="projectile4_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/52.png" style={{ display: "none" }} id="projectile4_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/53.png" style={{ display: "none" }} id="projectile4_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/54.png" style={{ display: "none" }} id="projectile4_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/55.png" style={{ display: "none" }} id="projectile4_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/56.png" style={{ display: "none" }} id="projectile4_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/57.png" style={{ display: "none" }} id="projectile4_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/58.png" style={{ display: "none" }} id="projectile4_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/59.png" style={{ display: "none" }} id="projectile4_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/60.png" style={{ display: "none" }} id="projectile4_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/61.png" style={{ display: "none" }} id="projectile4_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/62.png" style={{ display: "none" }} id="projectile4_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/63.png" style={{ display: "none" }} id="projectile4_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/water/64.png" style={{ display: "none" }} id="projectile4_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/projectile/wind/1.png" style={{ display: "none" }} id="projectile5_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/2.png" style={{ display: "none" }} id="projectile5_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/3.png" style={{ display: "none" }} id="projectile5_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/4.png" style={{ display: "none" }} id="projectile5_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/5.png" style={{ display: "none" }} id="projectile5_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/6.png" style={{ display: "none" }} id="projectile5_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/7.png" style={{ display: "none" }} id="projectile5_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/8.png" style={{ display: "none" }} id="projectile5_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/9.png" style={{ display: "none" }} id="projectile5_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/10.png" style={{ display: "none" }} id="projectile5_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/11.png" style={{ display: "none" }} id="projectile5_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/12.png" style={{ display: "none" }} id="projectile5_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/13.png" style={{ display: "none" }} id="projectile5_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/14.png" style={{ display: "none" }} id="projectile5_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/15.png" style={{ display: "none" }} id="projectile5_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/16.png" style={{ display: "none" }} id="projectile5_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/17.png" style={{ display: "none" }} id="projectile5_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/18.png" style={{ display: "none" }} id="projectile5_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/19.png" style={{ display: "none" }} id="projectile5_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/20.png" style={{ display: "none" }} id="projectile5_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/21.png" style={{ display: "none" }} id="projectile5_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/22.png" style={{ display: "none" }} id="projectile5_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/23.png" style={{ display: "none" }} id="projectile5_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/24.png" style={{ display: "none" }} id="projectile5_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/25.png" style={{ display: "none" }} id="projectile5_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/26.png" style={{ display: "none" }} id="projectile5_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/27.png" style={{ display: "none" }} id="projectile5_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/28.png" style={{ display: "none" }} id="projectile5_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/29.png" style={{ display: "none" }} id="projectile5_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/30.png" style={{ display: "none" }} id="projectile5_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/31.png" style={{ display: "none" }} id="projectile5_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/32.png" style={{ display: "none" }} id="projectile5_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/33.png" style={{ display: "none" }} id="projectile5_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/34.png" style={{ display: "none" }} id="projectile5_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/35.png" style={{ display: "none" }} id="projectile5_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/36.png" style={{ display: "none" }} id="projectile5_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/37.png" style={{ display: "none" }} id="projectile5_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/38.png" style={{ display: "none" }} id="projectile5_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/39.png" style={{ display: "none" }} id="projectile5_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/40.png" style={{ display: "none" }} id="projectile5_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/41.png" style={{ display: "none" }} id="projectile5_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/42.png" style={{ display: "none" }} id="projectile5_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/43.png" style={{ display: "none" }} id="projectile5_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/44.png" style={{ display: "none" }} id="projectile5_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/45.png" style={{ display: "none" }} id="projectile5_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/46.png" style={{ display: "none" }} id="projectile5_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/47.png" style={{ display: "none" }} id="projectile5_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/48.png" style={{ display: "none" }} id="projectile5_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/49.png" style={{ display: "none" }} id="projectile5_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/50.png" style={{ display: "none" }} id="projectile5_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/51.png" style={{ display: "none" }} id="projectile5_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/52.png" style={{ display: "none" }} id="projectile5_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/53.png" style={{ display: "none" }} id="projectile5_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/54.png" style={{ display: "none" }} id="projectile5_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/55.png" style={{ display: "none" }} id="projectile5_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/56.png" style={{ display: "none" }} id="projectile5_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/57.png" style={{ display: "none" }} id="projectile5_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/58.png" style={{ display: "none" }} id="projectile5_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/59.png" style={{ display: "none" }} id="projectile5_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/60.png" style={{ display: "none" }} id="projectile5_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/61.png" style={{ display: "none" }} id="projectile5_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/62.png" style={{ display: "none" }} id="projectile5_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/63.png" style={{ display: "none" }} id="projectile5_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/projectile/wind/64.png" style={{ display: "none" }} id="projectile5_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/impact/fire/1.png" style={{ display: "none" }} id="impact1_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/2.png" style={{ display: "none" }} id="impact1_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/3.png" style={{ display: "none" }} id="impact1_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/4.png" style={{ display: "none" }} id="impact1_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/5.png" style={{ display: "none" }} id="impact1_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/6.png" style={{ display: "none" }} id="impact1_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/7.png" style={{ display: "none" }} id="impact1_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/8.png" style={{ display: "none" }} id="impact1_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/9.png" style={{ display: "none" }} id="impact1_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/10.png" style={{ display: "none" }} id="impact1_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/11.png" style={{ display: "none" }} id="impact1_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/12.png" style={{ display: "none" }} id="impact1_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/13.png" style={{ display: "none" }} id="impact1_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/14.png" style={{ display: "none" }} id="impact1_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/15.png" style={{ display: "none" }} id="impact1_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/16.png" style={{ display: "none" }} id="impact1_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/17.png" style={{ display: "none" }} id="impact1_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/18.png" style={{ display: "none" }} id="impact1_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/19.png" style={{ display: "none" }} id="impact1_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/20.png" style={{ display: "none" }} id="impact1_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/21.png" style={{ display: "none" }} id="impact1_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/22.png" style={{ display: "none" }} id="impact1_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/23.png" style={{ display: "none" }} id="impact1_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/24.png" style={{ display: "none" }} id="impact1_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/25.png" style={{ display: "none" }} id="impact1_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/26.png" style={{ display: "none" }} id="impact1_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/27.png" style={{ display: "none" }} id="impact1_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/28.png" style={{ display: "none" }} id="impact1_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/29.png" style={{ display: "none" }} id="impact1_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/30.png" style={{ display: "none" }} id="impact1_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/31.png" style={{ display: "none" }} id="impact1_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/32.png" style={{ display: "none" }} id="impact1_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/33.png" style={{ display: "none" }} id="impact1_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/34.png" style={{ display: "none" }} id="impact1_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/35.png" style={{ display: "none" }} id="impact1_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/36.png" style={{ display: "none" }} id="impact1_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/37.png" style={{ display: "none" }} id="impact1_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/38.png" style={{ display: "none" }} id="impact1_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/39.png" style={{ display: "none" }} id="impact1_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/40.png" style={{ display: "none" }} id="impact1_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/41.png" style={{ display: "none" }} id="impact1_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/42.png" style={{ display: "none" }} id="impact1_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/43.png" style={{ display: "none" }} id="impact1_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/44.png" style={{ display: "none" }} id="impact1_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/45.png" style={{ display: "none" }} id="impact1_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/46.png" style={{ display: "none" }} id="impact1_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/47.png" style={{ display: "none" }} id="impact1_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/48.png" style={{ display: "none" }} id="impact1_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/49.png" style={{ display: "none" }} id="impact1_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/50.png" style={{ display: "none" }} id="impact1_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/51.png" style={{ display: "none" }} id="impact1_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/52.png" style={{ display: "none" }} id="impact1_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/53.png" style={{ display: "none" }} id="impact1_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/54.png" style={{ display: "none" }} id="impact1_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/55.png" style={{ display: "none" }} id="impact1_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/56.png" style={{ display: "none" }} id="impact1_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/57.png" style={{ display: "none" }} id="impact1_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/58.png" style={{ display: "none" }} id="impact1_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/59.png" style={{ display: "none" }} id="impact1_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/60.png" style={{ display: "none" }} id="impact1_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/61.png" style={{ display: "none" }} id="impact1_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/62.png" style={{ display: "none" }} id="impact1_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/63.png" style={{ display: "none" }} id="impact1_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/fire/64.png" style={{ display: "none" }} id="impact1_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/impact/lightning/1.png" style={{ display: "none" }} id="impact2_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/2.png" style={{ display: "none" }} id="impact2_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/3.png" style={{ display: "none" }} id="impact2_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/4.png" style={{ display: "none" }} id="impact2_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/5.png" style={{ display: "none" }} id="impact2_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/6.png" style={{ display: "none" }} id="impact2_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/7.png" style={{ display: "none" }} id="impact2_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/8.png" style={{ display: "none" }} id="impact2_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/9.png" style={{ display: "none" }} id="impact2_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/10.png" style={{ display: "none" }} id="impact2_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/11.png" style={{ display: "none" }} id="impact2_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/12.png" style={{ display: "none" }} id="impact2_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/13.png" style={{ display: "none" }} id="impact2_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/14.png" style={{ display: "none" }} id="impact2_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/15.png" style={{ display: "none" }} id="impact2_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/16.png" style={{ display: "none" }} id="impact2_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/17.png" style={{ display: "none" }} id="impact2_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/18.png" style={{ display: "none" }} id="impact2_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/19.png" style={{ display: "none" }} id="impact2_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/20.png" style={{ display: "none" }} id="impact2_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/21.png" style={{ display: "none" }} id="impact2_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/22.png" style={{ display: "none" }} id="impact2_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/23.png" style={{ display: "none" }} id="impact2_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/24.png" style={{ display: "none" }} id="impact2_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/25.png" style={{ display: "none" }} id="impact2_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/26.png" style={{ display: "none" }} id="impact2_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/27.png" style={{ display: "none" }} id="impact2_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/28.png" style={{ display: "none" }} id="impact2_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/29.png" style={{ display: "none" }} id="impact2_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/30.png" style={{ display: "none" }} id="impact2_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/31.png" style={{ display: "none" }} id="impact2_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/32.png" style={{ display: "none" }} id="impact2_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/33.png" style={{ display: "none" }} id="impact2_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/34.png" style={{ display: "none" }} id="impact2_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/35.png" style={{ display: "none" }} id="impact2_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/36.png" style={{ display: "none" }} id="impact2_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/37.png" style={{ display: "none" }} id="impact2_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/38.png" style={{ display: "none" }} id="impact2_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/39.png" style={{ display: "none" }} id="impact2_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/40.png" style={{ display: "none" }} id="impact2_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/41.png" style={{ display: "none" }} id="impact2_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/42.png" style={{ display: "none" }} id="impact2_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/43.png" style={{ display: "none" }} id="impact2_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/44.png" style={{ display: "none" }} id="impact2_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/45.png" style={{ display: "none" }} id="impact2_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/46.png" style={{ display: "none" }} id="impact2_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/47.png" style={{ display: "none" }} id="impact2_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/48.png" style={{ display: "none" }} id="impact2_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/49.png" style={{ display: "none" }} id="impact2_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/50.png" style={{ display: "none" }} id="impact2_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/51.png" style={{ display: "none" }} id="impact2_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/52.png" style={{ display: "none" }} id="impact2_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/53.png" style={{ display: "none" }} id="impact2_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/54.png" style={{ display: "none" }} id="impact2_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/55.png" style={{ display: "none" }} id="impact2_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/56.png" style={{ display: "none" }} id="impact2_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/57.png" style={{ display: "none" }} id="impact2_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/58.png" style={{ display: "none" }} id="impact2_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/59.png" style={{ display: "none" }} id="impact2_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/60.png" style={{ display: "none" }} id="impact2_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/61.png" style={{ display: "none" }} id="impact2_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/62.png" style={{ display: "none" }} id="impact2_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/63.png" style={{ display: "none" }} id="impact2_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/lightning/64.png" style={{ display: "none" }} id="impact2_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/impact/poison/1.png" style={{ display: "none" }} id="impact3_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/2.png" style={{ display: "none" }} id="impact3_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/3.png" style={{ display: "none" }} id="impact3_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/4.png" style={{ display: "none" }} id="impact3_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/5.png" style={{ display: "none" }} id="impact3_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/6.png" style={{ display: "none" }} id="impact3_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/7.png" style={{ display: "none" }} id="impact3_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/8.png" style={{ display: "none" }} id="impact3_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/9.png" style={{ display: "none" }} id="impact3_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/10.png" style={{ display: "none" }} id="impact3_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/11.png" style={{ display: "none" }} id="impact3_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/12.png" style={{ display: "none" }} id="impact3_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/13.png" style={{ display: "none" }} id="impact3_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/14.png" style={{ display: "none" }} id="impact3_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/15.png" style={{ display: "none" }} id="impact3_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/16.png" style={{ display: "none" }} id="impact3_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/17.png" style={{ display: "none" }} id="impact3_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/18.png" style={{ display: "none" }} id="impact3_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/19.png" style={{ display: "none" }} id="impact3_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/20.png" style={{ display: "none" }} id="impact3_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/21.png" style={{ display: "none" }} id="impact3_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/22.png" style={{ display: "none" }} id="impact3_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/23.png" style={{ display: "none" }} id="impact3_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/24.png" style={{ display: "none" }} id="impact3_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/25.png" style={{ display: "none" }} id="impact3_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/26.png" style={{ display: "none" }} id="impact3_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/27.png" style={{ display: "none" }} id="impact3_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/28.png" style={{ display: "none" }} id="impact3_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/29.png" style={{ display: "none" }} id="impact3_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/30.png" style={{ display: "none" }} id="impact3_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/31.png" style={{ display: "none" }} id="impact3_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/32.png" style={{ display: "none" }} id="impact3_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/33.png" style={{ display: "none" }} id="impact3_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/34.png" style={{ display: "none" }} id="impact3_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/35.png" style={{ display: "none" }} id="impact3_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/36.png" style={{ display: "none" }} id="impact3_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/37.png" style={{ display: "none" }} id="impact3_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/38.png" style={{ display: "none" }} id="impact3_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/39.png" style={{ display: "none" }} id="impact3_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/40.png" style={{ display: "none" }} id="impact3_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/41.png" style={{ display: "none" }} id="impact3_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/42.png" style={{ display: "none" }} id="impact3_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/43.png" style={{ display: "none" }} id="impact3_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/44.png" style={{ display: "none" }} id="impact3_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/45.png" style={{ display: "none" }} id="impact3_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/46.png" style={{ display: "none" }} id="impact3_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/47.png" style={{ display: "none" }} id="impact3_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/48.png" style={{ display: "none" }} id="impact3_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/49.png" style={{ display: "none" }} id="impact3_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/50.png" style={{ display: "none" }} id="impact3_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/51.png" style={{ display: "none" }} id="impact3_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/52.png" style={{ display: "none" }} id="impact3_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/53.png" style={{ display: "none" }} id="impact3_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/54.png" style={{ display: "none" }} id="impact3_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/55.png" style={{ display: "none" }} id="impact3_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/56.png" style={{ display: "none" }} id="impact3_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/57.png" style={{ display: "none" }} id="impact3_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/58.png" style={{ display: "none" }} id="impact3_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/59.png" style={{ display: "none" }} id="impact3_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/60.png" style={{ display: "none" }} id="impact3_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/61.png" style={{ display: "none" }} id="impact3_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/62.png" style={{ display: "none" }} id="impact3_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/63.png" style={{ display: "none" }} id="impact3_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/poison/64.png" style={{ display: "none" }} id="impact3_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/impact/water/1.png" style={{ display: "none" }} id="impact4_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/2.png" style={{ display: "none" }} id="impact4_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/3.png" style={{ display: "none" }} id="impact4_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/4.png" style={{ display: "none" }} id="impact4_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/5.png" style={{ display: "none" }} id="impact4_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/6.png" style={{ display: "none" }} id="impact4_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/7.png" style={{ display: "none" }} id="impact4_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/8.png" style={{ display: "none" }} id="impact4_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/9.png" style={{ display: "none" }} id="impact4_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/10.png" style={{ display: "none" }} id="impact4_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/11.png" style={{ display: "none" }} id="impact4_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/12.png" style={{ display: "none" }} id="impact4_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/13.png" style={{ display: "none" }} id="impact4_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/14.png" style={{ display: "none" }} id="impact4_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/15.png" style={{ display: "none" }} id="impact4_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/16.png" style={{ display: "none" }} id="impact4_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/17.png" style={{ display: "none" }} id="impact4_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/18.png" style={{ display: "none" }} id="impact4_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/19.png" style={{ display: "none" }} id="impact4_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/20.png" style={{ display: "none" }} id="impact4_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/21.png" style={{ display: "none" }} id="impact4_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/22.png" style={{ display: "none" }} id="impact4_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/23.png" style={{ display: "none" }} id="impact4_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/24.png" style={{ display: "none" }} id="impact4_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/25.png" style={{ display: "none" }} id="impact4_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/26.png" style={{ display: "none" }} id="impact4_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/27.png" style={{ display: "none" }} id="impact4_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/28.png" style={{ display: "none" }} id="impact4_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/29.png" style={{ display: "none" }} id="impact4_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/30.png" style={{ display: "none" }} id="impact4_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/31.png" style={{ display: "none" }} id="impact4_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/32.png" style={{ display: "none" }} id="impact4_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/33.png" style={{ display: "none" }} id="impact4_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/34.png" style={{ display: "none" }} id="impact4_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/35.png" style={{ display: "none" }} id="impact4_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/36.png" style={{ display: "none" }} id="impact4_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/37.png" style={{ display: "none" }} id="impact4_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/38.png" style={{ display: "none" }} id="impact4_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/39.png" style={{ display: "none" }} id="impact4_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/40.png" style={{ display: "none" }} id="impact4_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/41.png" style={{ display: "none" }} id="impact4_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/42.png" style={{ display: "none" }} id="impact4_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/43.png" style={{ display: "none" }} id="impact4_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/44.png" style={{ display: "none" }} id="impact4_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/45.png" style={{ display: "none" }} id="impact4_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/46.png" style={{ display: "none" }} id="impact4_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/47.png" style={{ display: "none" }} id="impact4_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/48.png" style={{ display: "none" }} id="impact4_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/49.png" style={{ display: "none" }} id="impact4_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/50.png" style={{ display: "none" }} id="impact4_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/51.png" style={{ display: "none" }} id="impact4_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/52.png" style={{ display: "none" }} id="impact4_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/53.png" style={{ display: "none" }} id="impact4_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/54.png" style={{ display: "none" }} id="impact4_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/55.png" style={{ display: "none" }} id="impact4_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/56.png" style={{ display: "none" }} id="impact4_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/57.png" style={{ display: "none" }} id="impact4_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/58.png" style={{ display: "none" }} id="impact4_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/59.png" style={{ display: "none" }} id="impact4_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/60.png" style={{ display: "none" }} id="impact4_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/61.png" style={{ display: "none" }} id="impact4_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/62.png" style={{ display: "none" }} id="impact4_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/63.png" style={{ display: "none" }} id="impact4_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/water/64.png" style={{ display: "none" }} id="impact4_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/impact/wind/1.png" style={{ display: "none" }} id="impact5_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/2.png" style={{ display: "none" }} id="impact5_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/3.png" style={{ display: "none" }} id="impact5_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/4.png" style={{ display: "none" }} id="impact5_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/5.png" style={{ display: "none" }} id="impact5_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/6.png" style={{ display: "none" }} id="impact5_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/7.png" style={{ display: "none" }} id="impact5_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/8.png" style={{ display: "none" }} id="impact5_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/9.png" style={{ display: "none" }} id="impact5_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/10.png" style={{ display: "none" }} id="impact5_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/11.png" style={{ display: "none" }} id="impact5_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/12.png" style={{ display: "none" }} id="impact5_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/13.png" style={{ display: "none" }} id="impact5_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/14.png" style={{ display: "none" }} id="impact5_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/15.png" style={{ display: "none" }} id="impact5_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/16.png" style={{ display: "none" }} id="impact5_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/17.png" style={{ display: "none" }} id="impact5_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/18.png" style={{ display: "none" }} id="impact5_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/19.png" style={{ display: "none" }} id="impact5_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/20.png" style={{ display: "none" }} id="impact5_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/21.png" style={{ display: "none" }} id="impact5_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/22.png" style={{ display: "none" }} id="impact5_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/23.png" style={{ display: "none" }} id="impact5_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/24.png" style={{ display: "none" }} id="impact5_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/25.png" style={{ display: "none" }} id="impact5_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/26.png" style={{ display: "none" }} id="impact5_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/27.png" style={{ display: "none" }} id="impact5_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/28.png" style={{ display: "none" }} id="impact5_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/29.png" style={{ display: "none" }} id="impact5_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/30.png" style={{ display: "none" }} id="impact5_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/31.png" style={{ display: "none" }} id="impact5_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/32.png" style={{ display: "none" }} id="impact5_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/33.png" style={{ display: "none" }} id="impact5_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/34.png" style={{ display: "none" }} id="impact5_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/35.png" style={{ display: "none" }} id="impact5_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/36.png" style={{ display: "none" }} id="impact5_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/37.png" style={{ display: "none" }} id="impact5_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/38.png" style={{ display: "none" }} id="impact5_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/39.png" style={{ display: "none" }} id="impact5_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/40.png" style={{ display: "none" }} id="impact5_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/41.png" style={{ display: "none" }} id="impact5_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/42.png" style={{ display: "none" }} id="impact5_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/43.png" style={{ display: "none" }} id="impact5_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/44.png" style={{ display: "none" }} id="impact5_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/45.png" style={{ display: "none" }} id="impact5_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/46.png" style={{ display: "none" }} id="impact5_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/47.png" style={{ display: "none" }} id="impact5_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/48.png" style={{ display: "none" }} id="impact5_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/49.png" style={{ display: "none" }} id="impact5_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/50.png" style={{ display: "none" }} id="impact5_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/51.png" style={{ display: "none" }} id="impact5_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/52.png" style={{ display: "none" }} id="impact5_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/53.png" style={{ display: "none" }} id="impact5_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/54.png" style={{ display: "none" }} id="impact5_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/55.png" style={{ display: "none" }} id="impact5_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/56.png" style={{ display: "none" }} id="impact5_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/57.png" style={{ display: "none" }} id="impact5_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/58.png" style={{ display: "none" }} id="impact5_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/59.png" style={{ display: "none" }} id="impact5_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/60.png" style={{ display: "none" }} id="impact5_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/61.png" style={{ display: "none" }} id="impact5_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/62.png" style={{ display: "none" }} id="impact5_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/63.png" style={{ display: "none" }} id="impact5_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/wind/64.png" style={{ display: "none" }} id="impact5_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/impact/shield/1.png" style={{ display: "none" }} id="impact6_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/2.png" style={{ display: "none" }} id="impact6_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/3.png" style={{ display: "none" }} id="impact6_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/4.png" style={{ display: "none" }} id="impact6_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/5.png" style={{ display: "none" }} id="impact6_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/6.png" style={{ display: "none" }} id="impact6_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/7.png" style={{ display: "none" }} id="impact6_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/8.png" style={{ display: "none" }} id="impact6_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/9.png" style={{ display: "none" }} id="impact6_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/10.png" style={{ display: "none" }} id="impact6_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/11.png" style={{ display: "none" }} id="impact6_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/12.png" style={{ display: "none" }} id="impact6_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/13.png" style={{ display: "none" }} id="impact6_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/14.png" style={{ display: "none" }} id="impact6_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/15.png" style={{ display: "none" }} id="impact6_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/16.png" style={{ display: "none" }} id="impact6_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/17.png" style={{ display: "none" }} id="impact6_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/18.png" style={{ display: "none" }} id="impact6_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/19.png" style={{ display: "none" }} id="impact6_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/20.png" style={{ display: "none" }} id="impact6_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/21.png" style={{ display: "none" }} id="impact6_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/22.png" style={{ display: "none" }} id="impact6_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/23.png" style={{ display: "none" }} id="impact6_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/24.png" style={{ display: "none" }} id="impact6_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/25.png" style={{ display: "none" }} id="impact6_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/26.png" style={{ display: "none" }} id="impact6_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/27.png" style={{ display: "none" }} id="impact6_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/28.png" style={{ display: "none" }} id="impact6_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/29.png" style={{ display: "none" }} id="impact6_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/30.png" style={{ display: "none" }} id="impact6_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/31.png" style={{ display: "none" }} id="impact6_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/32.png" style={{ display: "none" }} id="impact6_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/33.png" style={{ display: "none" }} id="impact6_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/34.png" style={{ display: "none" }} id="impact6_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/35.png" style={{ display: "none" }} id="impact6_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/36.png" style={{ display: "none" }} id="impact6_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/37.png" style={{ display: "none" }} id="impact6_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/38.png" style={{ display: "none" }} id="impact6_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/39.png" style={{ display: "none" }} id="impact6_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/40.png" style={{ display: "none" }} id="impact6_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/41.png" style={{ display: "none" }} id="impact6_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/42.png" style={{ display: "none" }} id="impact6_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/43.png" style={{ display: "none" }} id="impact6_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/44.png" style={{ display: "none" }} id="impact6_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/45.png" style={{ display: "none" }} id="impact6_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/46.png" style={{ display: "none" }} id="impact6_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/47.png" style={{ display: "none" }} id="impact6_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/48.png" style={{ display: "none" }} id="impact6_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/49.png" style={{ display: "none" }} id="impact6_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/50.png" style={{ display: "none" }} id="impact6_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/51.png" style={{ display: "none" }} id="impact6_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/52.png" style={{ display: "none" }} id="impact6_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/53.png" style={{ display: "none" }} id="impact6_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/54.png" style={{ display: "none" }} id="impact6_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/55.png" style={{ display: "none" }} id="impact6_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/56.png" style={{ display: "none" }} id="impact6_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/57.png" style={{ display: "none" }} id="impact6_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/58.png" style={{ display: "none" }} id="impact6_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/59.png" style={{ display: "none" }} id="impact6_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/60.png" style={{ display: "none" }} id="impact6_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/61.png" style={{ display: "none" }} id="impact6_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/62.png" style={{ display: "none" }} id="impact6_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/63.png" style={{ display: "none" }} id="impact6_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/impact/shield/64.png" style={{ display: "none" }} id="impact6_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/effect/coins/1.png" style={{ display: "none" }} id="effect1_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/2.png" style={{ display: "none" }} id="effect1_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/3.png" style={{ display: "none" }} id="effect1_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/4.png" style={{ display: "none" }} id="effect1_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/5.png" style={{ display: "none" }} id="effect1_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/6.png" style={{ display: "none" }} id="effect1_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/7.png" style={{ display: "none" }} id="effect1_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/8.png" style={{ display: "none" }} id="effect1_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/9.png" style={{ display: "none" }} id="effect1_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/10.png" style={{ display: "none" }} id="effect1_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/11.png" style={{ display: "none" }} id="effect1_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/12.png" style={{ display: "none" }} id="effect1_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/13.png" style={{ display: "none" }} id="effect1_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/14.png" style={{ display: "none" }} id="effect1_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/15.png" style={{ display: "none" }} id="effect1_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/16.png" style={{ display: "none" }} id="effect1_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/17.png" style={{ display: "none" }} id="effect1_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/18.png" style={{ display: "none" }} id="effect1_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/19.png" style={{ display: "none" }} id="effect1_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/20.png" style={{ display: "none" }} id="effect1_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/21.png" style={{ display: "none" }} id="effect1_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/22.png" style={{ display: "none" }} id="effect1_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/23.png" style={{ display: "none" }} id="effect1_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/24.png" style={{ display: "none" }} id="effect1_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/25.png" style={{ display: "none" }} id="effect1_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/26.png" style={{ display: "none" }} id="effect1_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/27.png" style={{ display: "none" }} id="effect1_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/28.png" style={{ display: "none" }} id="effect1_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/29.png" style={{ display: "none" }} id="effect1_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/30.png" style={{ display: "none" }} id="effect1_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/31.png" style={{ display: "none" }} id="effect1_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/32.png" style={{ display: "none" }} id="effect1_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/33.png" style={{ display: "none" }} id="effect1_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/34.png" style={{ display: "none" }} id="effect1_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/35.png" style={{ display: "none" }} id="effect1_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/36.png" style={{ display: "none" }} id="effect1_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/37.png" style={{ display: "none" }} id="effect1_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/38.png" style={{ display: "none" }} id="effect1_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/39.png" style={{ display: "none" }} id="effect1_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/40.png" style={{ display: "none" }} id="effect1_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/41.png" style={{ display: "none" }} id="effect1_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/42.png" style={{ display: "none" }} id="effect1_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/43.png" style={{ display: "none" }} id="effect1_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/44.png" style={{ display: "none" }} id="effect1_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/45.png" style={{ display: "none" }} id="effect1_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/46.png" style={{ display: "none" }} id="effect1_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/47.png" style={{ display: "none" }} id="effect1_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/48.png" style={{ display: "none" }} id="effect1_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/49.png" style={{ display: "none" }} id="effect1_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/50.png" style={{ display: "none" }} id="effect1_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/51.png" style={{ display: "none" }} id="effect1_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/52.png" style={{ display: "none" }} id="effect1_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/53.png" style={{ display: "none" }} id="effect1_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/54.png" style={{ display: "none" }} id="effect1_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/55.png" style={{ display: "none" }} id="effect1_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/56.png" style={{ display: "none" }} id="effect1_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/57.png" style={{ display: "none" }} id="effect1_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/58.png" style={{ display: "none" }} id="effect1_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/59.png" style={{ display: "none" }} id="effect1_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/60.png" style={{ display: "none" }} id="effect1_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/61.png" style={{ display: "none" }} id="effect1_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/62.png" style={{ display: "none" }} id="effect1_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/63.png" style={{ display: "none" }} id="effect1_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/coins/64.png" style={{ display: "none" }} id="effect1_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/effect/confetti/1.png" style={{ display: "none" }} id="effect2_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/2.png" style={{ display: "none" }} id="effect2_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/3.png" style={{ display: "none" }} id="effect2_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/4.png" style={{ display: "none" }} id="effect2_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/5.png" style={{ display: "none" }} id="effect2_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/6.png" style={{ display: "none" }} id="effect2_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/7.png" style={{ display: "none" }} id="effect2_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/8.png" style={{ display: "none" }} id="effect2_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/9.png" style={{ display: "none" }} id="effect2_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/10.png" style={{ display: "none" }} id="effect2_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/11.png" style={{ display: "none" }} id="effect2_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/12.png" style={{ display: "none" }} id="effect2_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/13.png" style={{ display: "none" }} id="effect2_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/14.png" style={{ display: "none" }} id="effect2_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/15.png" style={{ display: "none" }} id="effect2_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/16.png" style={{ display: "none" }} id="effect2_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/17.png" style={{ display: "none" }} id="effect2_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/18.png" style={{ display: "none" }} id="effect2_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/19.png" style={{ display: "none" }} id="effect2_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/20.png" style={{ display: "none" }} id="effect2_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/21.png" style={{ display: "none" }} id="effect2_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/22.png" style={{ display: "none" }} id="effect2_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/23.png" style={{ display: "none" }} id="effect2_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/24.png" style={{ display: "none" }} id="effect2_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/25.png" style={{ display: "none" }} id="effect2_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/26.png" style={{ display: "none" }} id="effect2_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/27.png" style={{ display: "none" }} id="effect2_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/28.png" style={{ display: "none" }} id="effect2_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/29.png" style={{ display: "none" }} id="effect2_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/30.png" style={{ display: "none" }} id="effect2_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/31.png" style={{ display: "none" }} id="effect2_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/32.png" style={{ display: "none" }} id="effect2_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/33.png" style={{ display: "none" }} id="effect2_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/34.png" style={{ display: "none" }} id="effect2_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/35.png" style={{ display: "none" }} id="effect2_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/36.png" style={{ display: "none" }} id="effect2_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/37.png" style={{ display: "none" }} id="effect2_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/38.png" style={{ display: "none" }} id="effect2_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/39.png" style={{ display: "none" }} id="effect2_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/40.png" style={{ display: "none" }} id="effect2_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/41.png" style={{ display: "none" }} id="effect2_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/42.png" style={{ display: "none" }} id="effect2_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/43.png" style={{ display: "none" }} id="effect2_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/44.png" style={{ display: "none" }} id="effect2_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/45.png" style={{ display: "none" }} id="effect2_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/46.png" style={{ display: "none" }} id="effect2_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/47.png" style={{ display: "none" }} id="effect2_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/48.png" style={{ display: "none" }} id="effect2_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/49.png" style={{ display: "none" }} id="effect2_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/50.png" style={{ display: "none" }} id="effect2_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/51.png" style={{ display: "none" }} id="effect2_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/52.png" style={{ display: "none" }} id="effect2_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/53.png" style={{ display: "none" }} id="effect2_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/54.png" style={{ display: "none" }} id="effect2_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/55.png" style={{ display: "none" }} id="effect2_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/56.png" style={{ display: "none" }} id="effect2_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/57.png" style={{ display: "none" }} id="effect2_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/58.png" style={{ display: "none" }} id="effect2_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/59.png" style={{ display: "none" }} id="effect2_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/60.png" style={{ display: "none" }} id="effect2_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/61.png" style={{ display: "none" }} id="effect2_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/62.png" style={{ display: "none" }} id="effect2_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/63.png" style={{ display: "none" }} id="effect2_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/confetti/64.png" style={{ display: "none" }} id="effect2_64" onLoad={loadedImage} />

        <img src="/assets/gameplay/images/effect/healing/1.png" style={{ display: "none" }} id="effect3_1" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/2.png" style={{ display: "none" }} id="effect3_2" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/3.png" style={{ display: "none" }} id="effect3_3" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/4.png" style={{ display: "none" }} id="effect3_4" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/5.png" style={{ display: "none" }} id="effect3_5" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/6.png" style={{ display: "none" }} id="effect3_6" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/7.png" style={{ display: "none" }} id="effect3_7" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/8.png" style={{ display: "none" }} id="effect3_8" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/9.png" style={{ display: "none" }} id="effect3_9" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/10.png" style={{ display: "none" }} id="effect3_10" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/11.png" style={{ display: "none" }} id="effect3_11" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/12.png" style={{ display: "none" }} id="effect3_12" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/13.png" style={{ display: "none" }} id="effect3_13" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/14.png" style={{ display: "none" }} id="effect3_14" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/15.png" style={{ display: "none" }} id="effect3_15" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/16.png" style={{ display: "none" }} id="effect3_16" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/17.png" style={{ display: "none" }} id="effect3_17" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/18.png" style={{ display: "none" }} id="effect3_18" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/19.png" style={{ display: "none" }} id="effect3_19" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/20.png" style={{ display: "none" }} id="effect3_20" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/21.png" style={{ display: "none" }} id="effect3_21" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/22.png" style={{ display: "none" }} id="effect3_22" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/23.png" style={{ display: "none" }} id="effect3_23" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/24.png" style={{ display: "none" }} id="effect3_24" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/25.png" style={{ display: "none" }} id="effect3_25" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/26.png" style={{ display: "none" }} id="effect3_26" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/27.png" style={{ display: "none" }} id="effect3_27" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/28.png" style={{ display: "none" }} id="effect3_28" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/29.png" style={{ display: "none" }} id="effect3_29" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/30.png" style={{ display: "none" }} id="effect3_30" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/31.png" style={{ display: "none" }} id="effect3_31" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/32.png" style={{ display: "none" }} id="effect3_32" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/33.png" style={{ display: "none" }} id="effect3_33" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/34.png" style={{ display: "none" }} id="effect3_34" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/35.png" style={{ display: "none" }} id="effect3_35" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/36.png" style={{ display: "none" }} id="effect3_36" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/37.png" style={{ display: "none" }} id="effect3_37" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/38.png" style={{ display: "none" }} id="effect3_38" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/39.png" style={{ display: "none" }} id="effect3_39" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/40.png" style={{ display: "none" }} id="effect3_40" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/41.png" style={{ display: "none" }} id="effect3_41" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/42.png" style={{ display: "none" }} id="effect3_42" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/43.png" style={{ display: "none" }} id="effect3_43" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/44.png" style={{ display: "none" }} id="effect3_44" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/45.png" style={{ display: "none" }} id="effect3_45" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/46.png" style={{ display: "none" }} id="effect3_46" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/47.png" style={{ display: "none" }} id="effect3_47" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/48.png" style={{ display: "none" }} id="effect3_48" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/49.png" style={{ display: "none" }} id="effect3_49" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/50.png" style={{ display: "none" }} id="effect3_50" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/51.png" style={{ display: "none" }} id="effect3_51" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/52.png" style={{ display: "none" }} id="effect3_52" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/53.png" style={{ display: "none" }} id="effect3_53" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/54.png" style={{ display: "none" }} id="effect3_54" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/55.png" style={{ display: "none" }} id="effect3_55" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/56.png" style={{ display: "none" }} id="effect3_56" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/57.png" style={{ display: "none" }} id="effect3_57" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/58.png" style={{ display: "none" }} id="effect3_58" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/59.png" style={{ display: "none" }} id="effect3_59" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/60.png" style={{ display: "none" }} id="effect3_60" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/61.png" style={{ display: "none" }} id="effect3_61" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/62.png" style={{ display: "none" }} id="effect3_62" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/63.png" style={{ display: "none" }} id="effect3_63" onLoad={loadedImage} />
        <img src="/assets/gameplay/images/effect/healing/64.png" style={{ display: "none" }} id="effect3_64" onLoad={loadedImage} />

        <audio id="hit-sound" src='/assets/gameplay/sounds/hit.mp3'>
        </audio>
        <audio id="shield-sound" src='/assets/gameplay/sounds/shield.mp3'>
        </audio>
        <audio id="background-sound" src='/assets/gameplay/sounds/background.mp3' loop>
        </audio>
        <audio id="win-sound" src='/assets/gameplay/sounds/win.wav'>
        </audio>
        <audio id="lose-sound" src='/assets/gameplay/sounds/lose.wav'>
        </audio>

        {isEnded && (
          <GameResult result={isWin} hasLottery={hasLottery}></GameResult>
        )}
      </div>
      {isLoading() && (
        <>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <motion.div
              className="box"
              animate={{
                scale: [0.5, 1.2, 1],
                rotate: [0, 0, 0],
              }}
              transition={{
                duration: 1.3,
                ease: "easeInOut",
                times: [0, 0.4, 0.7],
              }}
            >
              <Image
                src={"/assets/game/shield-sword.svg"}
                alt={""}
                priority={true}
                width={200}
                height={200}
                onLoad={loadedImage}
              ></Image>
            </motion.div>
            {counter >= 1 && counter <= 3 && <GameCounter value={counter} />}
          </div>
        </>
      )}
    </div>
  )
}
