import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  Droplets,
  Fuel,
  Home,
  MousePointerClick,
  ShieldCheck,
  Snowflake,
  Star,
  Users,
  Wrench
} from "lucide-react";
import "./index.css";

const assetPath = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;

const customers = [
  {
    speech: "札幌から函館まで行くから、\nガソリンを満タンにしたい！",
    correctService: "給油",
    icon: "🚗"
  },
  {
    speech: "車でお出かけしたら\n車が汚れちゃった",
    correctService: "洗車",
    icon: "🚙"
  },
  {
    speech: "来週から雪が降りそう。\nそろそろ準備したいな",
    correctService: "タイヤ交換",
    icon: "🛞"
  },
  {
    speech: "家のストーブ用の灯油が\n少なくなってきたよ",
    correctService: "灯油配達",
    icon: "🏠"
  },
  {
    speech: "電気自動車の\nバッテリーが少ない！",
    correctService: "EV充電",
    icon: "🚘"
  },
  {
    speech: "車検の期限が来月なんだ",
    correctService: "車検予約",
    visual: "staffBooking"
  },
  {
    speech: "もしもの事故や車のトラブルに備えて\n保険を見直したい",
    correctService: "自動車保険",
    visual: "insurance"
  }
];

const services = [
  {
    name: "給油",
    icon: Fuel,
    visual: "fuelPump",
    hint: "ガソリンを入れる",
    color: "from-orange-500 to-amber-500"
  },
  {
    name: "洗車",
    icon: Droplets,
    visual: "carWash",
    hint: "車をきれいにする",
    color: "from-sky-500 to-cyan-500"
  },
  {
    name: "タイヤ交換",
    icon: Wrench,
    visual: "winterTire",
    hint: "冬タイヤにする",
    color: "from-slate-600 to-blue-700"
  },
  {
    name: "灯油配達",
    icon: Home,
    visual: "tankerTruck",
    hint: "家へ灯油を届ける",
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "EV充電",
    visual: "evCharger",
    hint: "電気をチャージ",
    color: "from-emerald-500 to-teal-500"
  },
  {
    name: "車検予約",
    visual: "staffBooking",
    hint: "点検の日を決める",
    color: "from-blue-600 to-indigo-600"
  },
  {
    name: "自動車保険",
    icon: ShieldCheck,
    visual: "insurance",
    hint: "車の安心をえらぶ",
    color: "from-rose-500 to-orange-500"
  }
];

const upgrades = [
  {
    name: "洗車機を新しくする",
    cost: 300,
    effect: "洗車のポイントが増える",
    key: "wash",
    visual: "carWash"
  },
  {
    name: "灯油配送トラックを増やす",
    cost: 400,
    effect: "灯油配達のポイントが増える",
    key: "kerosene",
    visual: "tankerTruck"
  },
  {
    name: "EV充電器を設置する",
    cost: 500,
    effect: "EV充電サービスが強化される",
    key: "ev",
    visual: "evCharger"
  },
  {
    name: "自動車保険相談を強化する",
    cost: 300,
    effect: "自動車保険の提案力が上がる",
    key: "insurance",
    visual: "insurance"
  },
  {
    name: "子育て応援スペースを作る",
    cost: 500,
    effect: "ファミリーのお客さまが増える",
    key: "family",
    icon: "🧸"
  },
  {
    name: "スタッフを増やす",
    cost: 600,
    effect: "獲得ポイントが増える",
    key: "staff",
    visual: "staff"
  }
];

const basePoint = 100;
const accessCode = "583";

function randomCustomer() {
  return customers[Math.floor(Math.random() * customers.length)];
}

function servicePointBonus(service, boughtUpgrades) {
  let bonus = 0;
  if (service === "洗車" && boughtUpgrades.includes("wash")) bonus += 30;
  if (service === "灯油配達" && boughtUpgrades.includes("kerosene")) bonus += 40;
  if (service === "EV充電" && boughtUpgrades.includes("ev")) bonus += 50;
  if (boughtUpgrades.includes("staff")) bonus += 30;
  return bonus;
}

function App() {
  const [screen, setScreen] = useState("title");
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem("michieneAccess") === "ok");
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [customer, setCustomer] = useState(() => randomCustomer());
  const [phase, setPhase] = useState("select");
  const [message, setMessage] = useState("いらっしゃいませ！お客さまの話を聞いてサービスを選ぼう。");
  const [activeService, setActiveService] = useState(null);
  const [boughtUpgrades, setBoughtUpgrades] = useState([]);
  const [pointPop, setPointPop] = useState("");
  const [upgradePop, setUpgradePop] = useState(null);
  const [gameClear, setGameClear] = useState(false);
  const [miniClearMessage, setMiniClearMessage] = useState("");

  const unlockApp = () => {
    localStorage.setItem("michieneAccess", "ok");
    setIsUnlocked(true);
  };

  const startGame = () => {
    setScreen("game");
    setCustomer(randomCustomer());
    setPhase("select");
    setMessage("お客さまの困りごとに合うサービスを選ぼう。");
  };

  const resetGame = () => {
    setScreen("title");
    setPoints(0);
    setTotalPoints(0);
    setStreak(0);
    setCustomer(randomCustomer());
    setPhase("select");
    setMessage("いらっしゃいませ！お客さまの話を聞いてサービスを選ぼう。");
    setActiveService(null);
    setBoughtUpgrades([]);
    setPointPop("");
    setUpgradePop(null);
    setGameClear(false);
    setMiniClearMessage("");
  };

  const chooseService = (service) => {
    if (phase !== "select") return;
    if (service === customer.correctService) {
      setActiveService(service);
      setPhase("mini");
      setMiniClearMessage("");
      setMessage("正解！ミニゲームにチャレンジ！");
      return;
    }
    setStreak(0);
    setMessage("もう一度考えてみよう！");
  };

  const completeMiniGame = (successMessage) => {
    const nextStreak = streak + 1;
    const bonus =
      nextStreak % 5 === 0 ? 100 : nextStreak % 3 === 0 ? 50 : 0;
    const serviceBonus = servicePointBonus(activeService, boughtUpgrades);
    const earned = basePoint + serviceBonus + bonus;

    setPoints((value) => value + earned);
    setTotalPoints((value) => value + earned);
    setStreak(nextStreak);
    setPhase("mini-clear");
    setMiniClearMessage(successMessage);
    setPointPop(`+${earned}`);
    setMessage(
      `${successMessage} ${basePoint}ポイント獲得！` +
        (serviceBonus ? ` 強化ボーナス +${serviceBonus}ポイント！` : "") +
        (bonus
          ? ` ${nextStreak}連続正解ボーナス！ +${bonus}ポイント`
          : "")
    );

    window.setTimeout(() => setPointPop(""), 1000);
  };

  const nextCustomer = () => {
    setCustomer(randomCustomer());
    setPhase("select");
    setActiveService(null);
    setMiniClearMessage("");
    setMessage("次のお客さまです。セリフをよく読んでね。");
  };

  const buyUpgrade = (upgrade) => {
    if (boughtUpgrades.includes(upgrade.key)) return;
    if (points < upgrade.cost) {
      setMessage("ポイントが足りません。もう少し接客してためよう！");
      return;
    }
    const nextBoughtUpgrades = [...boughtUpgrades, upgrade.key];
    setPoints((value) => value - upgrade.cost);
    setBoughtUpgrades(nextBoughtUpgrades);
    setUpgradePop(upgrade);
    setMessage(`${upgrade.name}を購入！スタンドがもっと便利になりました。`);
    window.setTimeout(() => setUpgradePop(null), 2600);
    if (nextBoughtUpgrades.length === upgrades.length) {
      setGameClear(true);
      window.setTimeout(resetGame, 5000);
    }
  };

  if (!isUnlocked) {
    return <AccessGate onUnlock={unlockApp} />;
  }

  if (screen === "title") {
    return <TitleScreen onStart={startGame} />;
  }

  return (
    <div className="cute-orange-bg min-h-screen text-slate-800">
      <div className="relative min-h-screen">
        <SnowBackground />
        <main className="relative z-10 mx-auto flex w-full max-w-[1840px] flex-col gap-4 px-3 py-4 sm:px-5 xl:gap-4">
          {phase !== "mini" && phase !== "mini-clear" && (
            <section className="flex min-w-0 flex-col gap-4">
              <TopBar points={points} totalPoints={totalPoints} streak={streak} />
              <StationScene
                boughtUpgrades={boughtUpgrades}
                pointPop={pointPop}
                activeUpgradeKey={upgradePop?.key}
              />
            </section>
          )}
          {phase === "mini" || phase === "mini-clear" ? (
            <section className="min-w-0">
              <MiniGame
                service={activeService}
                onComplete={completeMiniGame}
                size="large"
                completedMessage={miniClearMessage}
                onNextCustomer={nextCustomer}
              />
            </section>
          ) : (
            <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_740px] xl:items-start xl:gap-5">
              <div className="flex min-w-0 flex-col gap-4">
                <CustomerPanel customer={customer} message={message} phase={phase} />
                <UpgradePanel
                  points={points}
                  boughtUpgrades={boughtUpgrades}
                  onBuy={buyUpgrade}
                />
              </div>
              <div className="flex min-w-0 flex-col gap-4">
                {phase === "select" && <ServiceSelector onChoose={chooseService} />}
                {phase === "done" && (
                  <button
                    onClick={nextCustomer}
                    className="w-full rounded-3xl bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 px-6 py-10 text-4xl font-black text-white shadow-xl shadow-orange-200 ring-4 ring-white transition hover:scale-[1.01] active:scale-[.98] xl:py-16 xl:text-6xl"
                  >
                    次のお客さまへ
                  </button>
                )}
              </div>
            </section>
          )}
        </main>
        {upgradePop && <UpgradePurchaseToast upgrade={upgradePop} />}
        {gameClear && <GoodJobClearOverlay />}
      </div>
    </div>
  );
}

function AccessGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submitCode = (event) => {
    event.preventDefault();
    if (code.trim().normalize("NFKC") === accessCode) {
      setError("");
      onUnlock();
      return;
    }
    setError("合言葉が違います。");
  };

  return (
    <div className="cute-orange-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-slate-800">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-orange-50 to-orange-200" />
      <div className="relative z-10 w-full max-w-md rounded-[2rem] border-4 border-white bg-white/90 p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-24 w-24 items-end justify-center overflow-hidden rounded-3xl bg-orange-100 ring-4 ring-orange-200">
          <StaffImage className="h-24 w-20 object-contain" />
        </div>
        <p className="text-sm font-black tracking-[.12em] text-orange-500">
          PRIVATE GAME
        </p>
        <h1 className="mt-2 text-3xl font-black text-blue-700">
          道エネSS
        </h1>
        <p className="mt-3 text-base font-bold leading-relaxed text-slate-700">
          合言葉を知っている人だけ遊べます。
        </p>
        <form onSubmit={submitCode} className="mt-5 flex flex-col gap-3">
          <input
            value={code}
            onChange={(event) => setCode(event.target.value)}
            inputMode="numeric"
            aria-label="合言葉"
            className="rounded-2xl border-4 border-orange-200 bg-orange-50 px-4 py-4 text-center text-3xl font-black text-blue-700 outline-none transition focus:border-orange-400"
            placeholder="合言葉"
          />
          {error && (
            <p className="rounded-2xl bg-rose-100 px-4 py-2 text-base font-black text-rose-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="rounded-full bg-orange-500 px-8 py-4 text-xl font-black text-white shadow-xl shadow-orange-200 transition hover:bg-orange-600 active:scale-95"
          >
            ゲームを開く
          </button>
        </form>
      </div>
    </div>
  );
}

function TitleScreen({ onStart }) {
  return (
    <div className="cute-orange-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 lg:py-10">
      <div className="absolute inset-0 bg-gradient-to-b from-orange-200/70 via-orange-50/70 to-amber-200/80" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-orange-200/80" />
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center lg:max-w-[1320px]">
        <div className="w-full rounded-[2rem] border-4 border-orange-100 bg-orange-50/85 p-5 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
          <div className="mx-auto mb-5 flex h-40 w-full max-w-4xl items-end justify-center rounded-3xl bg-sky-100 shadow-inner sm:h-56 lg:mb-8 lg:h-72 lg:max-w-6xl">
            <div className="relative h-full w-full overflow-hidden rounded-3xl bg-sky-100">
              <img
                src={assetPath("/station-background-new.png?v=2")}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain object-center"
                draggable="false"
              />
            </div>
          </div>
          <p className="mb-2 text-sm font-bold tracking-[.18em] text-orange-500 sm:text-base lg:text-xl">
            HOKKAIDO SERVICE STATION GAME
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-8">
            <div className="flex h-24 w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-inner sm:h-32 sm:w-24 lg:h-44 lg:w-32">
              <StaffImage className="h-[5.5rem] w-16 object-contain sm:h-28 sm:w-20 lg:h-40 lg:w-28" />
            </div>
            <h1 className="text-left text-2xl font-black leading-tight text-blue-700 sm:text-4xl lg:text-7xl">
              道エネSS
              <span className="block text-orange-500">サービスマスター</span>
            </h1>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-bold text-slate-700 sm:text-2xl lg:mt-8 lg:max-w-4xl lg:text-4xl">
            <span className="block">北海道の暮らしを支える</span>
            <span className="block">サービスステーションを育てよう！</span>
          </p>
          <div className="mx-auto mt-6 max-w-4xl rounded-[1.5rem] border-4 border-yellow-300 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 px-5 py-5 text-white shadow-xl shadow-orange-200 ring-4 ring-white sm:px-8 lg:mt-10 lg:max-w-5xl lg:px-12 lg:py-7">
            <p className="flex animate-pulse flex-col items-center justify-center gap-1 text-center text-2xl font-black leading-tight sm:text-4xl lg:flex-row lg:gap-5 lg:text-6xl">
              <span className="shrink-0 text-5xl leading-none sm:text-7xl lg:text-9xl" aria-hidden="true">🏅</span>
              <span className="text-center lg:whitespace-nowrap lg:text-left">
                スタンドを成長させよう！！
              </span>
            </p>
          </div>
          <button
            onClick={onStart}
            className="mt-8 rounded-full bg-orange-500 px-10 py-5 text-xl font-black text-white shadow-xl shadow-orange-200 transition hover:bg-orange-600 active:scale-95 sm:text-2xl lg:mt-10 lg:px-16 lg:py-6 lg:text-4xl"
          >
            ゲームスタート
          </button>
        </div>
      </div>
    </div>
  );
}

function SnowBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-28 bg-orange-100" />
      <div className="absolute bottom-24 left-[-10%] h-32 w-[65%] rounded-t-[100%] bg-orange-50/90" />
      <div className="absolute bottom-24 right-[-10%] h-40 w-[70%] rounded-t-[100%] bg-amber-100/80" />
      <div className="absolute bottom-16 left-0 h-24 w-full bg-slate-600" />
      {[...Array(18)].map((_, index) => (
        <Snowflake
          key={index}
          className="absolute text-sky-300/70"
          size={14 + (index % 4) * 4}
          style={{
            left: `${(index * 17) % 100}%`,
            top: `${(index * 23) % 70}%`,
            animation: `floaty ${2.5 + (index % 5) * 0.4}s ease-in-out infinite`,
            animationDelay: `${index * 0.15}s`
          }}
        />
      ))}
    </div>
  );
}

function TopBar({ points, totalPoints, streak }) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <StatCard label="ポイント" value={`${points} pt`} icon={<Star />} tone="orange" />
      <StatCard label="合計獲得" value={`${totalPoints} pt`} icon={<CheckCircle2 />} tone="green" />
      <StatCard label="連続正解" value={`${streak} 回`} icon={<Users />} tone="pink" />
    </div>
  );
}

function StatCard({ label, value, icon, tone }) {
  const tones = {
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pink: "bg-rose-100 text-rose-700 border-rose-200"
  };
  return (
    <div className={`rounded-2xl border-2 p-2 shadow-sm sm:p-3 ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-bold sm:text-sm">
        {React.cloneElement(icon, { size: 18 })}
        {label}
      </div>
      <div className="mt-1 text-lg font-black sm:text-2xl">{value}</div>
    </div>
  );
}

function StationScene({ boughtUpgrades, pointPop, activeUpgradeKey }) {
  const purchasedUpgrades = upgrades.filter((upgrade) => boughtUpgrades.includes(upgrade.key));

  return (
    <div className="relative aspect-[16/5] min-h-[210px] overflow-hidden rounded-3xl border-4 border-white bg-sky-100 p-4 shadow-xl sm:min-h-[250px] xl:min-h-0">
      <img
        src={assetPath("/station-background-new.png?v=3")}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center"
        draggable="false"
      />
      <div className="absolute inset-0 bg-white/5" />
      {pointPop && (
        <div className="absolute right-8 top-6 z-20 animate-pop rounded-full bg-orange-500 px-5 py-3 text-2xl font-black text-white shadow-xl">
          {pointPop}
        </div>
      )}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-4 py-2 text-sm font-black text-blue-700 shadow">
        道エネ SS
      </div>
      <div className="absolute right-5 top-4 z-10 w-[54%] sm:right-7 sm:w-[52%]">
        <div className="mb-3 flex items-center justify-center gap-2">
          <span className="rounded-full bg-blue-700/95 px-5 py-2 text-base font-black text-white shadow-xl ring-4 ring-white/80 xl:text-2xl">
            設備 {purchasedUpgrades.length}/{upgrades.length}
          </span>
        </div>
        <div className="grid min-h-[10rem] grid-cols-3 justify-items-center gap-3 xl:min-h-[12rem] xl:gap-5">
          {purchasedUpgrades.length > 0 &&
            purchasedUpgrades.map((upgrade) => (
              <SceneIcon
                key={upgrade.key}
                active={upgrade.key === activeUpgradeKey}
                name={upgrade.name}
                label={<UpgradeVisual upgrade={upgrade} size="scene" />}
              />
            ))}
        </div>
      </div>
      <div className="absolute bottom-3 left-0 right-0 h-14 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}

function SapporoCityBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-28 h-32 sm:h-40" aria-hidden="true">
      <div className="absolute bottom-0 left-[3%] h-16 w-9 rounded-t-lg bg-blue-200 shadow-sm sm:h-20 sm:w-12">
        <CityWindows />
      </div>
      <div className="absolute bottom-0 left-[15%] h-20 w-12 rounded-t-lg bg-slate-200 shadow-sm sm:h-24 sm:w-16">
        <CityWindows />
      </div>
      <div className="absolute bottom-0 left-[28%] h-14 w-14 rounded-t-xl bg-sky-200 shadow-sm sm:h-20 sm:w-20">
        <CityWindows />
      </div>
      <div className="absolute bottom-0 right-[24%] h-20 w-12 rounded-t-lg bg-blue-200 shadow-sm sm:h-28 sm:w-16">
        <CityWindows />
      </div>
      <div className="absolute bottom-0 right-[7%] h-16 w-14 rounded-t-lg bg-slate-200 shadow-sm sm:h-24 sm:w-20">
        <CityWindows />
      </div>
      <div className="absolute bottom-0 left-1/2 h-28 w-10 -translate-x-1/2 sm:h-36 sm:w-12">
        <div className="absolute bottom-0 left-1/2 h-24 w-6 -translate-x-1/2 rounded-t-md bg-orange-500 shadow-md sm:h-32 sm:w-7" />
        <div className="absolute bottom-16 left-1/2 h-4 w-12 -translate-x-1/2 rounded bg-sky-100 ring-2 ring-orange-600 sm:bottom-24 sm:w-14" />
        <div className="absolute bottom-20 left-1/2 h-8 w-1 -translate-x-1/2 bg-slate-600 sm:bottom-28" />
        <div className="absolute bottom-[7.2rem] left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-red-500 sm:bottom-[9.6rem]" />
        <div className="absolute bottom-3 left-1/2 rounded bg-white px-1 text-[8px] font-black leading-tight text-orange-600 sm:text-[9px]">
          札幌
        </div>
      </div>
      <div className="absolute bottom-0 left-0 h-4 w-full bg-white/95" />
    </div>
  );
}

function CityWindows() {
  return (
    <span className="absolute inset-2 grid grid-cols-2 gap-1">
      {[...Array(6)].map((_, index) => (
        <span key={index} className="rounded-sm bg-white/80" />
      ))}
    </span>
  );
}

function SceneIcon({ label, name, active = false }) {
  return (
    <div
      className={`relative flex h-24 w-28 flex-col items-center justify-center rounded-3xl border-4 border-yellow-300 bg-white/95 px-2 py-2 text-center shadow-2xl ring-4 ring-white/80 xl:h-32 xl:w-40 ${
        active ? "animate-upgrade-arrive scale-110 border-orange-400 bg-yellow-50 ring-8 ring-yellow-200/90" : "animate-pop"
      }`}
    >
      {active && <span className="absolute -inset-5 rounded-[2rem] bg-yellow-300/40 animate-ping" aria-hidden="true" />}
      {active && <span className="absolute -right-3 -top-4 text-4xl animate-bounce">✨</span>}
      {active && <span className="absolute -left-3 -bottom-4 text-3xl animate-pulse">⭐</span>}
      <span className="relative z-10 flex items-center justify-center">
        {label}
      </span>
      <span className="relative z-10 mt-1 line-clamp-2 text-[10px] font-black leading-tight text-blue-700 xl:mt-2 xl:text-base">
        {name}
      </span>
    </div>
  );
}

function CustomerPanel({ customer, message, phase }) {
  return (
    <div className="customer-card-bg relative overflow-hidden rounded-3xl border-4 border-orange-100 p-3 shadow-xl sm:p-4 xl:p-5">
      <span className="absolute -right-6 top-6 h-20 w-20 rounded-full bg-orange-200/45" aria-hidden="true" />
      <span className="absolute bottom-4 right-12 h-6 w-6 rounded-full bg-sky-200/55" aria-hidden="true" />
      <div key={customer.speech} className="relative z-10 mb-3 flex animate-welcome-pop items-center justify-center gap-2 sm:gap-3 xl:mb-4 xl:gap-4">
        <div className="flex h-14 w-12 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-4 ring-orange-200 sm:h-20 sm:w-16 xl:h-28 xl:w-24 xl:rounded-3xl xl:ring-[6px]">
          <StaffImage className="h-[3.4rem] w-10 object-contain sm:h-[5rem] sm:w-14 xl:h-[7rem] xl:w-20" />
        </div>
        <div className="relative whitespace-nowrap rounded-[1.25rem] bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 px-3 py-3 text-base font-black text-white shadow-xl ring-4 ring-white sm:rounded-[1.5rem] sm:px-5 sm:text-3xl xl:rounded-[2rem] xl:px-7 xl:py-5 xl:text-5xl">
          <span className="mr-1" aria-hidden="true">✨</span>
          いらっしゃいませ！
          <span className="ml-1" aria-hidden="true">✨</span>
        </div>
      </div>
      <div className="relative z-10 rounded-[1.5rem] border-4 border-white bg-gradient-to-br from-orange-100 via-yellow-50 to-white p-3 shadow-2xl ring-4 ring-orange-200/90 sm:p-4 xl:rounded-[2rem] xl:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center xl:items-start xl:gap-5">
        <div className="mx-auto flex h-20 w-20 shrink-0 animate-floaty items-center justify-center rounded-full bg-white text-4xl shadow-lg ring-4 ring-blue-100 sm:mx-0 xl:h-28 xl:w-28 xl:text-6xl">
          {customer.visual === "insurance" && <InsuranceCustomerIcon className="h-16 w-16" />}
          {customer.visual === "staffBooking" && <InspectionCustomerIcon />}
          {!customer.visual && customer.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-4 inline-flex rounded-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 px-5 py-2 text-base font-black tracking-[.08em] text-white shadow-lg ring-4 ring-white xl:text-2xl">
            <span className="mr-2" aria-hidden="true">✨</span>
            クイズ問題
            <span className="ml-2" aria-hidden="true">✨</span>
          </div>
          <p
            className={`whitespace-pre-line rounded-[1.75rem] border-4 border-orange-300 bg-white px-5 py-7 text-center text-2xl font-black leading-relaxed text-slate-950 shadow-xl ring-4 ring-orange-100 sm:text-3xl xl:px-8 xl:py-10 xl:leading-tight ${
              customer.visual === "insurance" ? "xl:text-4xl" : "xl:text-5xl"
            }`}
            style={
              customer.visual === "staffBooking"
                ? { whiteSpace: "nowrap" }
                : customer.correctService === "給油"
                  ? { whiteSpace: "pre-line", wordBreak: "keep-all", overflowWrap: "normal" }
                  : undefined
            }
          >
            「{customer.speech}」
          </p>
          <p
            className={`mt-2 rounded-2xl px-4 py-2 text-base font-bold shadow-sm ring-2 ring-white xl:text-lg ${
              phase === "mini"
                ? "bg-emerald-100 text-emerald-700"
              : phase === "done"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-50 text-blue-700"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

function ServiceSelector({ onChoose }) {
  return (
    <div className="rounded-[2rem] border-4 border-orange-300 bg-orange-50 p-3 shadow-xl shadow-orange-100 sm:p-4 xl:p-5">
      <div className="mb-3 flex items-center justify-center gap-4 rounded-3xl bg-white px-4 py-4 text-center shadow-md ring-4 ring-orange-100 xl:mb-5 xl:gap-5 xl:py-5">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 ring-4 ring-orange-200 xl:h-24 xl:w-24" aria-hidden="true">
          <MousePointerClick className="h-10 w-10 xl:h-16 xl:w-16" strokeWidth={3.5} />
        </span>
        <div>
          <h2 className="text-3xl font-black leading-tight text-orange-600 xl:text-6xl">
            サービスを選んでね
          </h2>
          <p className="mt-1 text-base font-black text-slate-600 sm:text-lg xl:text-2xl">
            お客さまのセリフに合うボタンを押そう
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-2 xl:gap-5">
        {services.map(({ name, visual, hint, color }) => (
          <button
            key={name}
            onClick={() => onChoose(name)}
            aria-label={`${name}、${hint}`}
            className={`group relative flex min-h-36 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-white bg-gradient-to-br ${color} p-3 text-center text-white shadow-lg ring-2 ring-orange-100 transition hover:-translate-y-1 hover:ring-orange-300 hover:shadow-xl active:scale-[.97] sm:min-h-40 xl:min-h-56 xl:gap-3 xl:p-4`}
          >
            <span
              className={`flex items-center justify-center overflow-hidden rounded-3xl bg-white p-2 text-5xl shadow-inner ring-4 ring-white/40 transition group-hover:scale-105 ${
                visual === "tankerTruck" ? "h-24 w-32 sm:h-28 sm:w-36 xl:h-32 xl:w-44" : "h-24 w-24 sm:h-28 sm:w-28 xl:h-32 xl:w-32"
              }`}
            >
              <ServiceVisualIcon visual={visual} />
            </span>
            <span className="text-xl font-black leading-tight sm:text-2xl xl:text-3xl">{name}</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold leading-tight xl:text-base">
              {hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ServiceVisualIcon({ visual }) {
  if (visual === "fuelPump") return <span className="flex scale-110 items-center justify-center xl:scale-150"><FuelPumpIcon /></span>;
  if (visual === "carWash") return <CarWashImage className="h-24 w-24 xl:h-32 xl:w-32" fallback="洗" />;
  if (visual === "winterTire") return <TireImage className="h-24 w-24 xl:h-32 xl:w-32" fallback="🛞" />;
  if (visual === "tankerTruck") return <TankerLorryImage className="h-24 w-32 xl:h-32 xl:w-44" fallback="🚚" />;
  if (visual === "evCharger") return <EvChargeIcon className="h-24 w-24 xl:h-32 xl:w-32" fallback="🚙" />;
  if (visual === "staffBooking") return <InspectionImage className="h-24 w-24 xl:h-32 xl:w-32" fallback="車検" />;
  if (visual === "insurance") return <InsuranceImage className="h-24 w-24 xl:h-32 xl:w-32" fallback="🛡️" />;
  return <span aria-hidden="true">?</span>;
}

function ImageIcon({ src, className, fallback }) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showFallback = failed || !loaded;

  return (
    <span className={`relative flex shrink-0 items-center justify-center ${className}`}>
      <span
        className={`absolute inset-0 z-0 flex items-center justify-center rounded-2xl bg-white text-4xl font-black text-blue-700 ${
          showFallback ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        {fallback}
      </span>
      {!failed && (
        <img
          src={assetPath(src)}
          alt=""
          aria-hidden="true"
          className={`relative z-10 h-full w-full object-contain ${loaded ? "opacity-100" : "opacity-0"}`}
          draggable="false"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

function EvChargeIcon({ className = "h-16 w-16" }) {
  return (
    <ImageIcon src="/EV.png" className={className} fallback="🚙" />
  );
}

function CarWashImage({ className = "h-16 w-16", fallback = "洗" }) {
  return (
    <ImageIcon src="/car-wash.png" className={className} fallback={fallback} />
  );
}

function TankerLorryImage({ className = "h-16 w-16" }) {
  return (
    <img
      src={assetPath("/tanker-lorry.png?v=original-tanker")}
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function FuelPumpIcon() {
  return (
    <span className="relative block h-20 w-16" aria-hidden="true">
      <span className="absolute bottom-0 left-2 h-[4.25rem] w-11 rounded-t-xl rounded-b-sm border-4 border-orange-600 bg-orange-400 shadow-sm">
        <span className="absolute left-1.5 top-3 h-6 w-6 rounded-sm border-2 border-blue-600 bg-sky-100" />
        <span className="absolute bottom-3 left-1.5 right-1.5 h-3 rounded-full bg-white/70" />
      </span>
      <span className="absolute bottom-0 left-0 h-3 w-14 rounded bg-slate-700" />
      <span className="absolute right-1 top-5 h-11 w-6 rounded-r-full border-r-4 border-t-4 border-slate-700" />
      <span className="absolute right-0 top-8 h-6 w-3 rounded bg-slate-700" />
      <span className="absolute right-[-4px] top-12 h-4 w-1.5 rounded bg-orange-600" />
    </span>
  );
}

function CarWashIcon() {
  return (
    <span className="relative block h-16 w-16" aria-hidden="true">
      <span className="absolute left-1 top-1 h-12 w-14 rounded-t-2xl border-4 border-sky-700 bg-sky-100 shadow-sm" />
      <span className="absolute left-3 top-2 rounded bg-sky-700 px-1 py-[1px] text-[7px] font-black leading-none text-white">
        WASH
      </span>
      <span className="absolute left-2 top-5 h-9 w-3 rounded-full bg-cyan-500 shadow-sm">
        <span className="absolute left-1 top-1 h-1 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-3 h-1 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-5 h-1 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-7 h-1 w-1 rounded-full bg-white" />
      </span>
      <span className="absolute right-2 top-5 h-9 w-3 rounded-full bg-cyan-500 shadow-sm">
        <span className="absolute left-1 top-1 h-1 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-3 h-1 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-5 h-1 w-1 rounded-full bg-white" />
        <span className="absolute left-1 top-7 h-1 w-1 rounded-full bg-white" />
      </span>
      <span className="absolute left-5 top-4 h-8 w-6 rounded-b-full bg-white/90">
        <span className="absolute left-1 top-0 h-7 w-1 rotate-12 rounded-full bg-blue-300" />
        <span className="absolute left-3 top-0 h-7 w-1 rounded-full bg-blue-300" />
        <span className="absolute right-1 top-0 h-7 w-1 -rotate-12 rounded-full bg-blue-300" />
      </span>
      <span className="absolute bottom-2 left-4 h-6 w-8 rounded-t-xl bg-slate-700 shadow">
        <span className="absolute left-1 top-1 h-2 w-6 rounded bg-sky-100" />
        <span className="absolute bottom-[-3px] left-1 h-2 w-2 rounded-full bg-slate-950" />
        <span className="absolute bottom-[-3px] right-1 h-2 w-2 rounded-full bg-slate-950" />
      </span>
      <span className="absolute left-0 top-1 text-sm leading-none text-cyan-500">💦</span>
    </span>
  );
}

function WinterTireIcon() {
  return (
    <TireImage className="h-20 w-20" />
  );
}

function TireImage({ className = "h-16 w-16", fallback = "🛞" }) {
  return (
    <ImageIcon src="/tire.png" className={className} fallback={fallback} />
  );
}

function NutIcon({ tightened = false, className = "h-12 w-12" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={`${className} drop-shadow-sm`}
    >
      <polygon
        points="32 4 56 18 56 46 32 60 8 46 8 18"
        fill={tightened ? "#fb923c" : "#f8fafc"}
        stroke="#334155"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="13" fill="#ffffff" stroke="#334155" strokeWidth="5" />
      <path
        d="M23 18 41 46 M41 18 23 46"
        stroke={tightened ? "#ffffff" : "#cbd5e1"}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TankerTruckIcon() {
  return (
    <span className="relative block h-14 w-16" aria-hidden="true">
      <span className="absolute bottom-3 left-1 h-8 w-10 rounded-full border-4 border-blue-700 bg-white shadow-sm">
        <span className="absolute left-1 top-2 h-2 w-7 rounded-full bg-orange-500" />
        <span className="absolute left-2 top-4 text-[8px] font-black leading-none text-blue-700">
          道エネ
        </span>
      </span>
      <span className="absolute bottom-3 right-1 h-8 w-6 rounded-r-lg border-4 border-blue-700 bg-orange-400">
        <span className="absolute left-1 top-1 h-3 w-3 rounded-sm bg-sky-100" />
      </span>
      <span className="absolute bottom-1 left-4 h-4 w-4 rounded-full border-3 border-slate-700 bg-slate-900" />
      <span className="absolute bottom-1 right-2 h-4 w-4 rounded-full border-3 border-slate-700 bg-slate-900" />
      <span className="absolute bottom-5 left-0 h-1 w-3 rounded-full bg-slate-500" />
    </span>
  );
}

function InspectionImage({ className = "h-16 w-16", fallback = "車検" }) {
  return (
    <ImageIcon src="/inspection.png" className={className} fallback={fallback} />
  );
}

function InspectionCustomerIcon() {
  return (
    <span className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white p-2 shadow-inner">
      <InspectionImage className="h-12 w-12 object-contain" />
    </span>
  );
}

function InsuranceCustomerIcon({ className = "h-16 w-16" }) {
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <g filter="url(#insuranceCustomerShadow)">
        <path
          d="M15 41c2-9 7-19 13-23h25c6 4 11 14 13 23l6 4v13c0 4-3 7-7 7H15c-4 0-7-3-7-7V45l7-4Z"
          fill="#5ab3e8"
        />
        <path d="M29 23h21c4 4 7 10 9 17H21c2-7 4-13 8-17Z" fill="#ffffff" opacity=".92" />
        <path d="M12 47h12l-5 6h-7v-6Zm55 0H55l5 6h7v-6Z" fill="#ffffff" />
        <path d="M26 56h20" stroke="#3f4650" strokeWidth="4" strokeLinecap="round" />
        <circle cx="22" cy="65" r="6" fill="#3f4650" />
        <circle cx="58" cy="65" r="6" fill="#3f4650" />
      </g>
      <g filter="url(#insuranceCustomerShadow)">
        <path
          d="M55 34 72 41v13c0 11-7 18-17 22-10-4-17-11-17-22V41l17-7Z"
          fill="#5ab3e8"
          stroke="#3f4650"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="m47 55 6 6 12-14"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter id="insuranceCustomerShadow" x="-10" y="-10" width="100" height="100">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#334155" floodOpacity=".18" />
        </filter>
      </defs>
    </svg>
  );
}

function InsuranceImage({ className = "h-16 w-16", fallback = "🛡️" }) {
  return (
    <ImageIcon src="/insurance.png" className={className} fallback={fallback} />
  );
}

function UpgradeVisual({ upgrade, size = "panel" }) {
  const classes = {
    panel: {
      wrap: "h-14 w-14 rounded-xl border-2 border-yellow-300 bg-yellow-50 shadow-inner xl:h-24 xl:w-24 xl:rounded-3xl xl:border-4",
      image: "h-11 w-11 xl:h-20 xl:w-20",
      wide: "h-10 w-13 xl:h-20 xl:w-24",
      staff: "h-14 w-12 xl:h-24 xl:w-20"
    },
    scene: {
      wrap: "h-14 w-14 rounded-2xl xl:h-20 xl:w-20 xl:rounded-3xl",
      image: "h-12 w-12 xl:h-16 xl:w-16",
      wide: "h-12 w-18 xl:h-16 xl:w-24",
      staff: "h-14 w-12 xl:h-20 xl:w-16"
    },
    sceneWide: {
      wrap: "h-16 w-28 rounded-2xl",
      image: "h-14 w-14",
      wide: "h-16 w-28",
      staff: "h-20 w-14"
    },
    sky: {
      wrap: "h-20 w-20 rounded-full",
      image: "h-16 w-16",
      wide: "h-16 w-24",
      staff: "h-20 w-16"
    },
    pop: {
      wrap: "h-28 w-28 rounded-[2rem]",
      image: "h-24 w-24",
      wide: "h-24 w-36",
      staff: "h-28 w-24"
    }
  }[size];
  const isSky = size === "sky";
  const isPanel = size === "panel";

  return (
    <span className={`relative flex shrink-0 items-center justify-center ${isPanel ? "overflow-hidden" : "overflow-visible"} ${!isSky && !isPanel ? "bg-white shadow-inner" : ""} ${classes.wrap}`}>
      {!isSky && (
        <span
          className={`absolute inset-0 ${
            isPanel ? "bg-yellow-50" : "bg-gradient-to-br from-yellow-100 via-white to-sky-100"
          }`}
        />
      )}
      {isSky && <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/90 via-yellow-100/70 to-sky-100/70 shadow-inner" />}
      <span className="relative z-10 flex items-center justify-center text-5xl">
        {upgrade.visual === "carWash" ? (
          <CarWashImage className={classes.image} />
        ) : upgrade.visual === "tankerTruck" ? (
          <TankerLorryImage className={classes.wide} />
        ) : upgrade.visual === "evCharger" ? (
          <EvChargeIcon className={classes.image} />
        ) : upgrade.visual === "insurance" ? (
          <InsuranceImage className={classes.image} />
        ) : upgrade.visual === "staff" ? (
          <StaffImage className={classes.staff} />
        ) : (
          upgrade.icon
        )}
      </span>
    </span>
  );
}

function StaffImage({ className = "h-16 w-16" }) {
  return (
    <img
      src={assetPath("/staff.png?v=original-staff")}
      alt=""
      aria-hidden="true"
      className={className}
      draggable="false"
    />
  );
}

function MiniGame({ service, onComplete, size = "normal", completedMessage = "", onNextCustomer }) {
  const [retryKey, setRetryKey] = useState(0);
  const [failMessage, setFailMessage] = useState("");
  const [clearMessage, setClearMessage] = useState("");
  const isBookedFailure = failMessage.startsWith("予約済みです。");
  const miniGames = {
    給油: FuelGame,
    洗車: WashGame,
    タイヤ交換: TireGame,
    灯油配達: KeroseneGame,
    EV充電: EvGame,
    車検予約: InspectionGame,
    自動車保険: InsuranceGame
  };
  const Game = miniGames[service];
  const retryGame = () => {
    setRetryKey((value) => value + 1);
    setFailMessage("");
    setClearMessage("");
  };
  const clearGame = (successMessage) => {
    if (clearMessage || completedMessage) return;
    setFailMessage("");
    setClearMessage(successMessage);
    onComplete(successMessage);
  };

  const isLarge = size === "large";
  const successText = completedMessage || clearMessage;

  return (
    <div
      className={`relative rounded-3xl border-4 border-white bg-white/95 shadow-xl ${
        isLarge ? "min-h-[820px] p-5 xl:min-h-[calc(100vh-2rem)] xl:p-8" : "p-4"
      } ${isLarge ? "mini-game-large" : ""}`}
    >
      <div className={`mb-5 flex flex-col items-center justify-center gap-2 text-center ${isLarge ? "xl:mb-7" : ""}`}>
        <p className="rounded-full bg-blue-100 px-5 py-2 text-base font-black tracking-[.12em] text-blue-700">
          MINI GAME
        </p>
        <h2 className={`font-black leading-tight text-blue-700 ${isLarge ? "text-4xl xl:text-7xl" : "text-2xl"}`}>
          {service}ミニゲーム
        </h2>
      </div>
      <div className={isLarge ? "mini-game-body" : ""}>
        <Game key={retryKey} onComplete={clearGame} onFail={setFailMessage} />
      </div>
      {successText && (
        <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden rounded-3xl bg-blue-950/70 p-5">
          <div className="absolute left-6 top-6 text-4xl animate-bounce">✨</div>
          <div className="absolute right-8 top-10 text-5xl animate-pulse">⭐</div>
          <div className="absolute bottom-8 left-10 text-5xl animate-bounce">🎉</div>
          <div className="absolute bottom-12 right-10 text-4xl animate-pulse">✨</div>
          <div className="w-full max-w-3xl animate-pop rounded-[2rem] border-4 border-yellow-300 bg-white p-6 text-center shadow-2xl xl:p-10">
            <p className="text-lg font-black tracking-widest text-orange-500 xl:text-2xl">MISSION</p>
            <p className="mt-1 whitespace-nowrap text-4xl font-black leading-tight text-blue-700 sm:text-6xl xl:text-7xl">
              ミッションクリア！
            </p>
            <p className="mt-5 rounded-3xl bg-yellow-100 px-4 py-4 text-2xl font-black text-orange-700 xl:text-4xl">
              {successText}
            </p>
            {onNextCustomer && (
              <button
                onClick={onNextCustomer}
                className="mt-7 w-full rounded-3xl bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 px-6 py-6 text-3xl font-black text-white shadow-xl ring-4 ring-white transition hover:scale-[1.01] active:scale-[.98] xl:py-8 xl:text-5xl"
              >
                次のお客さまへ
              </button>
            )}
          </div>
        </div>
      )}
      {failMessage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/95 p-5">
          <div className="w-full max-w-3xl rounded-[2rem] border-4 border-red-200 bg-red-50 p-6 text-center shadow-2xl xl:p-10">
            <div className="mb-5 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-white shadow-inner ring-4 ring-red-100 xl:h-36 xl:w-36">
                <StaffImage className="h-32 w-24 xl:h-40 xl:w-28" />
              </div>
              <div className="relative rounded-3xl bg-white px-6 py-4 text-center text-2xl font-black text-orange-600 shadow xl:px-8 xl:py-5 xl:text-4xl">
                <span className="absolute -left-2 top-1/2 hidden h-5 w-5 -translate-y-1/2 rotate-45 bg-white sm:block" />
                所長さん「もう一度やってみよう！」
              </div>
            </div>
            <div className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-red-500 text-8xl font-black text-white shadow-lg xl:h-36 xl:w-36 xl:text-9xl">
              ×
            </div>
            <p className="text-4xl font-black text-red-700 xl:text-6xl">もう一度やりなおそう！</p>
            <p
              className={`mt-4 min-h-12 font-black ${
                isBookedFailure
                  ? "rounded-3xl bg-white px-5 py-4 text-4xl text-red-600 shadow-sm xl:text-5xl"
                  : "text-2xl text-slate-700 xl:text-3xl"
              }`}
            >
              {failMessage}
            </p>
            <button
              onClick={retryGame}
              className="mt-6 w-full rounded-3xl bg-orange-500 py-6 text-3xl font-black text-white shadow-lg active:scale-95 xl:py-8 xl:text-5xl"
            >
              もう一度やる
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FuelGame({ onComplete, onFail }) {
  const [result, setResult] = useState("");
  const stopGauge = () => {
    const marker = document.querySelector("#fuel-marker");
    const percent = marker ? parseFloat(getComputedStyle(marker).left) / marker.parentElement.clientWidth : 0;
    if (percent >= 0.42 && percent <= 0.64) {
      onComplete("満タン完了！");
    } else {
      setResult("緑のところをねらってもう一度！");
      onFail("ストップする場所が少しずれました。緑のところをねらおう！");
    }
  };
  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border-4 border-orange-200 bg-gradient-to-b from-orange-50 via-white to-sky-50 p-6 text-center shadow-inner">
        <div className="mb-6 flex items-center justify-center gap-8">
          <div className="flex h-36 w-32 items-center justify-center rounded-[2rem] bg-white shadow-xl ring-4 ring-orange-100">
            <span className="scale-[1.65]">
              <FuelPumpIcon />
            </span>
          </div>
          <div className="rounded-full bg-orange-500 px-8 py-4 text-4xl font-black text-white shadow-xl">
            満タンにしよう！
          </div>
        </div>
        <div className="relative mx-auto h-36 max-w-6xl overflow-hidden rounded-full bg-slate-200 p-4 shadow-inner">
          <div className="absolute left-[42%] top-4 flex h-28 w-[22%] items-center justify-center rounded-full bg-emerald-400 shadow-xl ring-4 ring-emerald-200">
            <span className="whitespace-nowrap rounded-full bg-white/95 px-6 py-3 text-3xl font-black text-emerald-700 shadow-sm">
              給油中
            </span>
          </div>
          <div
            id="fuel-marker"
            className="absolute top-3 h-[7.5rem] w-8 animate-gauge rounded-full bg-orange-500 shadow-2xl ring-4 ring-white"
          />
        </div>
        <div className="mx-auto mt-5 flex max-w-5xl items-center justify-between px-8 text-2xl font-black text-slate-500">
          <span>早すぎ</span>
          <span className="text-emerald-700">ここでストップ！</span>
          <span>遅すぎ</span>
        </div>
      </div>
      <button onClick={stopGauge} className="w-full rounded-3xl bg-orange-500 py-8 text-5xl font-black text-white shadow-xl">
        ストップ
      </button>
      {result && <p className="rounded-3xl bg-blue-50 px-4 py-4 text-center text-3xl font-black text-blue-700">{result}</p>}
    </div>
  );
}

function WashGame({ onComplete }) {
  const foamSpots = [
    { left: "18%", top: "20%" },
    { left: "58%", top: "18%" },
    { left: "38%", top: "36%" },
    { left: "68%", top: "48%" },
    { left: "24%", top: "54%" }
  ];
  const [washed, setWashed] = useState(0);
  const [bursts, setBursts] = useState([]);
  const currentSpot = foamSpots[washed];
  const dirtLeft = Math.max(0, foamSpots.length - washed);

  const washSpot = () => {
    if (!currentSpot) return;
    const burstId = `${washed}-${Date.now()}`;
    setBursts((value) => [...value.slice(-2), { id: burstId, ...currentSpot }]);
    window.setTimeout(() => {
      setBursts((value) => value.filter((burst) => burst.id !== burstId));
    }, 900);

    const next = washed + 1;
    setWashed(next);
    if (next === foamSpots.length) onComplete("ピカピカになりました！");
  };

  return (
    <div className="space-y-5">
      <p className="rounded-3xl bg-sky-100 px-6 py-5 text-center text-2xl font-black text-sky-800 xl:text-4xl">
        大きな「あわ」をタッチして、車をピカピカにしよう！
      </p>

      <div className="relative mx-auto h-[38rem] max-w-6xl overflow-hidden rounded-[2rem] border-4 border-sky-200 bg-gradient-to-b from-sky-100 to-white p-6 shadow-inner">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-sky-200/70" />
        <div className="absolute bottom-16 left-1/2 flex h-72 w-[30rem] -translate-x-1/2 items-center justify-center rounded-[2.25rem] bg-white shadow-inner ring-4 ring-white">
          <CarWashImage className="h-64 w-[26rem]" />
        </div>

        {[...Array(dirtLeft)].map((_, index) => (
          <span
            key={`dirt-${index}`}
            className="absolute flex h-24 w-24 rotate-[-8deg] items-center justify-center rounded-full bg-gradient-to-br from-amber-700 via-amber-900 to-stone-800 shadow-xl ring-4 ring-amber-200"
            style={{
              left: `${20 + (index * 13) % 58}%`,
              bottom: `${90 + (index % 2) * 48}px`
            }}
            aria-label="茶色い汚れ"
          >
            <span className="absolute left-3 top-3 h-5 w-5 rounded-full bg-stone-950/45" />
            <span className="absolute bottom-4 right-4 h-6 w-6 rounded-full bg-stone-950/45" />
            <span className="absolute right-7 top-5 h-3 w-4 rounded-full bg-yellow-900/60" />
            <span className="absolute left-5 top-11 h-4 w-8 rounded-full bg-amber-950/55" />
            <span className="absolute bottom-6 left-8 h-3 w-6 rounded-full bg-stone-950/45" />
          </span>
        ))}

        {currentSpot && (
          <button
            onClick={washSpot}
            className="absolute flex h-36 w-36 animate-bounce items-center justify-center rounded-[2.25rem] border-4 border-white bg-sky-400 text-5xl font-black text-white shadow-2xl ring-4 ring-sky-100 active:scale-90"
            style={currentSpot}
            aria-label="あわをタッチ"
          >
            <span className="absolute left-4 top-3 text-4xl">✨</span>
            <span className="absolute right-4 top-4 text-5xl">⭐</span>
            <span className="absolute bottom-4 left-5 text-4xl">✨</span>
            <span className="absolute bottom-5 right-5 text-4xl">⭐</span>
            <span className="relative z-10 text-6xl">🫧</span>
          </button>
        )}

        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="pointer-events-none absolute z-20 h-36 w-36 -translate-x-2 -translate-y-2 animate-pop"
            style={{ left: burst.left, top: burst.top }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full bg-yellow-200/80 blur-sm" />
            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-300 bg-white/80 shadow-xl" />
            <span className="absolute -left-4 top-5 text-5xl animate-bounce">✨</span>
            <span className="absolute right-0 top-0 text-6xl animate-pulse">💦</span>
            <span className="absolute bottom-0 right-2 text-5xl animate-bounce">⭐</span>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-orange-500 px-4 py-2 text-xl font-black text-white shadow-lg">
              ピカッ!
            </span>
          </div>
        ))}

        <div className="absolute left-6 top-6 rounded-full bg-orange-400 px-5 py-3 text-2xl font-black text-white shadow">
          あと {dirtLeft} こ
        </div>
      </div>

      <button
        onClick={washSpot}
        disabled={!currentSpot}
        className="w-full rounded-3xl bg-sky-500 py-7 text-4xl font-black text-white shadow-xl active:scale-95 disabled:bg-slate-300"
      >
        あわをタッチ！
      </button>

      <div className="space-y-3 rounded-3xl bg-white p-5 shadow-inner">
        <div className="flex items-center justify-between text-2xl font-black text-sky-800">
          <span>洗車パワー</span>
          <span>{washed}/{foamSpots.length}</span>
        </div>
        <div className="h-8 overflow-hidden rounded-full bg-sky-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all"
            style={{ width: `${(washed / foamSpots.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {foamSpots.map((_, index) => (
            <div key={index} className={`h-4 rounded-full ${index < washed ? "bg-emerald-400" : "bg-slate-200"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TireGame({ onComplete, onFail }) {
  const tirePositions = [
    { label: "左前輪", short: "左前", x: "22%", y: "27%" },
    { label: "右前輪", short: "右前", x: "78%", y: "27%" },
    { label: "左後輪", short: "左後", x: "22%", y: "73%" },
    { label: "右後輪", short: "右後", x: "78%", y: "73%" }
  ];
  const [currentWheel, setCurrentWheel] = useState(0);
  const [stage, setStage] = useState("pick");
  const [tighteningStep, setTighteningStep] = useState(0);
  const [note, setNote] = useState("光っているタイヤ位置のボタンを押そう！");
  const activeTirePosition = tirePositions[currentWheel];

  useEffect(() => {
    if (stage !== "tighten") return undefined;

    const timers = [
      window.setTimeout(() => setTighteningStep(1), 150),
      window.setTimeout(() => setTighteningStep(2), 550),
      window.setTimeout(() => setTighteningStep(3), 950),
      window.setTimeout(() => {
        const nextWheel = currentWheel + 1;
        if (nextWheel === tirePositions.length) {
          onComplete("冬道の準備完了！");
          return;
        }
        setCurrentWheel(nextWheel);
        setStage("pick");
        setTighteningStep(0);
        setNote(`カチッと固定！次は${tirePositions[nextWheel].label}だよ。`);
      }, 1450)
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [currentWheel, onComplete, stage, tirePositions.length]);

  const pickWheel = (index) => {
    if (stage !== "pick") return;
    if (index < currentWheel) {
      setNote("そのタイヤはもう交換できているよ！");
      return;
    }
    if (index !== currentWheel) {
      setNote("光っている場所から順番に交換しよう！");
      onFail("光っている場所と違うタイヤを選びました。順番に交換しよう！");
      return;
    }
    setStage("tighten");
    setTighteningStep(0);
    setNote(`${tirePositions[index].label}を取り付け中。ナットをしめるよ！`);
  };

  return (
    <div className="space-y-5">
      <p className="rounded-3xl bg-blue-100 px-6 py-5 text-center text-2xl font-black text-blue-800 xl:text-4xl">
        {note}
      </p>

      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border-4 border-blue-200 bg-gradient-to-b from-sky-100 to-white p-6 shadow-inner">
        <div className="absolute left-6 top-6 text-5xl animate-bounce">❄️</div>
        <div className="absolute right-8 top-8 text-5xl animate-pulse">✨</div>
        <OverheadTireCar
          positions={tirePositions}
          activeIndex={currentWheel}
          stage={stage}
          tighteningStep={tighteningStep}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {tirePositions.map((position, index) => {
          const done = index < currentWheel;
          const active = index === currentWheel;
          return (
            <button
              key={position.label}
              onClick={() => pickWheel(index)}
              disabled={stage !== "pick" && active}
              className={`min-h-32 rounded-3xl border-4 p-4 text-2xl font-black shadow-lg transition active:scale-95 xl:min-h-40 xl:text-3xl ${
                done
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : active
                    ? "border-orange-300 bg-orange-100 text-orange-700 ring-4 ring-orange-200"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <span className="block text-5xl">{done ? "✅" : active ? "🛞" : "○"}</span>
              {position.label}
            </button>
          );
        })}
      </div>

      {stage === "tighten" && (
        <div className="rounded-3xl bg-slate-100 p-6 text-center shadow-inner">
          <div className="mb-4 flex items-center justify-center gap-4 text-3xl font-black text-orange-700">
            <Wrench className="h-12 w-12 animate-spin" />
            ナット締め中！
          </div>
          <div className="flex justify-center gap-5">
            {[0, 1, 2].map((index) => (
              <NutIcon
                key={index}
                tightened={index < tighteningStep}
                className={`h-20 w-20 transition ${index === tighteningStep ? "scale-110 animate-pulse" : ""}`}
              />
            ))}
          </div>
          <p className="mt-4 text-2xl font-bold text-slate-600">
            {activeTirePosition.label}をカチッと固定しています
          </p>
        </div>
      )}
    </div>
  );
}

function OverheadTireCar({ positions, activeIndex, stage, tighteningStep }) {
  return (
    <div className="relative mx-auto h-[42rem] max-w-4xl overflow-hidden rounded-[2rem] bg-white/60 shadow-inner">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={assetPath("/car-top-view.png")}
          alt=""
          aria-hidden="true"
          className="h-[36rem] w-full object-contain object-center"
          draggable="false"
        />
      </div>
      {positions.map((position, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div
            key={position.label}
            className={`absolute flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border-4 shadow-xl transition ${
              done
                ? "border-emerald-300 bg-emerald-100"
                : active
                  ? "border-yellow-300 bg-orange-100 ring-8 ring-yellow-200"
                  : "border-slate-300 bg-white"
            }`}
            style={{ left: position.x, top: position.y }}
          >
            <TireImage className={`${active ? "h-24 w-24 animate-pulse" : "h-20 w-20"}`} />
            {active && stage === "tighten" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/75">
                <NutIcon tightened={tighteningStep > 0} className="h-16 w-16 animate-spin" />
              </div>
            )}
            <span className="absolute -bottom-10 rounded-full bg-blue-700 px-4 py-1.5 text-lg font-black text-white">
              {position.short}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function KeroseneGame({ onComplete, onFail }) {
  const obstacles = [[0], [2], [0, 1], [1, 2], [0, 2]];
  const laneNames = ["上の道", "まんなか", "下の道"];
  const [steps, setSteps] = useState(0);
  const [lane, setLane] = useState(1);
  const [crashed, setCrashed] = useState(false);
  const [crashLeft, setCrashLeft] = useState(null);
  const [note, setNote] = useState("雪だるまをよけて、おうちまで灯油を届けよう！");
  const obstacleLanes = obstacles[steps % obstacles.length];
  const laneTop = (roadLane) => 78 + roadLane * 150;
  const objectTop = (roadLane) => 50 + roadLane * 150;
  const truckTop = (roadLane) => 38 + roadLane * 150;
  const obstacleLeft = (index) => (obstacleLanes.length > 1 ? 55 + index * 8 : 58);
  const truckLeft = crashed && crashLeft !== null ? crashLeft : 4 + Math.min(steps * 10, 42);

  const chooseLane = (nextLane) => {
    if (crashed) return;
    setLane(nextLane);
    const obstacleIndex = obstacleLanes.indexOf(nextLane);
    if (obstacleIndex !== -1) {
      setCrashed(true);
      setCrashLeft(Math.max(6, obstacleLeft(obstacleIndex) - 8));
      setNote("雪だるまに当たった！もう一度道を選ぼう");
      window.setTimeout(() => {
        onFail("雪だるまにぶつかりました。雪だるまのない道を選んでもう一度やろう！");
      }, 450);
      return;
    }

    const next = steps + 1;
    setSteps(next);
    setNote(next >= 5 ? "おうちに到着！" : `いい道！あと${5 - next}マスで到着！`);
    if (next >= 5) onComplete("灯油をお届けしました！");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-3xl bg-amber-100 p-5">
        <div className="mb-4 rounded-3xl bg-white p-5 text-center shadow-sm">
          <p className="text-2xl font-black text-amber-700 xl:text-4xl">灯油ローリー雪道チャレンジ</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <span className="text-6xl xl:text-7xl">☃️</span>
            <span className="text-2xl font-black text-slate-800 xl:text-4xl">雪だるまのない道を選ぼう</span>
          </div>
        </div>
        <div className="relative h-[34rem] overflow-hidden rounded-[2rem] border-4 border-sky-100 bg-gradient-to-b from-sky-100 to-white p-5 shadow-inner">
          {[0, 1, 2].map((roadLane) => (
            <div
              key={roadLane}
              className={`absolute left-6 right-28 h-20 rounded-full shadow-inner ${
                !crashed && !obstacleLanes.includes(roadLane)
                  ? "animate-pulse bg-emerald-500 ring-8 ring-emerald-200"
                  : "bg-slate-500"
              }`}
              style={{ top: `${laneTop(roadLane)}px` }}
            >
              <div className={`mx-auto mt-9 h-2 w-4/5 rounded-full ${!crashed && !obstacleLanes.includes(roadLane) ? "bg-white" : "bg-yellow-200"}`} />
            </div>
          ))}
          {obstacleLanes.map((obstacleLane, index) => (
            <div
              key={obstacleLane}
              className={`absolute flex h-24 w-24 items-center justify-center rounded-full bg-white text-7xl shadow-xl ring-4 ${
                crashed ? "animate-bounce ring-red-300" : "ring-red-100"
              }`}
              style={{
                left: `${obstacleLeft(index)}%`,
                top: `${objectTop(obstacleLane) - 8}px`
              }}
            >
              <span className="relative z-10">☃️</span>
            </div>
          ))}
          <div
            className={`absolute flex h-28 w-56 items-center justify-center rounded-3xl bg-white/85 shadow-xl transition-all duration-500 ${
              crashed ? "ring-4 ring-red-400 animate-pulse" : ""
            }`}
            style={{
              left: `${truckLeft}%`,
              top: `${truckTop(lane)}px`
            }}
          >
            <TankerLorryImage className="h-28 w-56" />
          </div>
          <div className="absolute right-4 top-[14.25rem] text-8xl">🏠</div>
          <div className="absolute right-16 top-[10.5rem] text-5xl">♨️</div>
        </div>
        <div className="mt-4 h-6 overflow-hidden rounded-full bg-white shadow-inner">
          <div className="h-full bg-orange-500 transition-all" style={{ width: `${Math.min(steps * 20, 100)}%` }} />
        </div>
        <p className="mt-4 min-h-10 text-center text-2xl font-black text-amber-700 xl:text-4xl">{note}</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {laneNames.map((label, index) => (
          <button
            key={label}
            onClick={() => chooseLane(index)}
            disabled={crashed}
            className={`rounded-3xl py-7 text-3xl font-black text-white shadow-xl transition hover:brightness-105 active:scale-[.97] xl:text-4xl ${
              index === 1 ? "bg-orange-500" : "bg-blue-600"
            } disabled:bg-slate-300`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function EvGame({ onComplete, onFail }) {
  const [charge, setCharge] = useState(0);
  const [note, setNote] = useState("動く車が緑のゾーンに来たら押そう！");
  const [combo, setCombo] = useState(0);

  const chargeUp = () => {
    const marker = document.querySelector("#ev-charge-marker");
    const rail = marker?.parentElement;
    const percent = marker && rail ? parseFloat(getComputedStyle(marker).left) / rail.clientWidth : 0;
    const isBest = percent >= 0.43 && percent <= 0.63;
    const isNear = percent >= 0.32 && percent <= 0.74;
    if (!isNear) {
      setCombo(0);
      setNote("緑のゾーンから離れちゃった。もう一度ねらおう！");
      onFail("車が緑のゾーンから離れていました。タイミングを見て押そう！");
      return;
    }
    const nextCombo = isBest ? combo + 1 : 0;
    const gain = isBest ? 35 + Math.min(nextCombo * 5, 15) : isNear ? 20 : 10;
    const next = Math.min(charge + gain, 100);

    setCharge(next);
    setCombo(nextCombo);
    setNote(
      isBest
        ? `ナイス充電！ +${gain}%${nextCombo >= 2 ? ` ${nextCombo}連続！` : ""}`
        : isNear
          ? "+20%。もう少し真ん中をねらおう！"
          : "+10%。緑のゾーンで押すと一気に進むよ！"
    );
    if (next === 100) onComplete("充電完了！");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] border-4 border-emerald-200 bg-gradient-to-b from-emerald-100 via-white to-sky-50 p-6 text-center shadow-inner">
        <div className="mb-6 flex items-center justify-center gap-8">
          <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] bg-white shadow-xl ring-4 ring-emerald-100">
            <EvChargeIcon className="h-28 w-28" />
          </div>
          <div className="rounded-full bg-emerald-500 px-8 py-4 text-4xl font-black text-white shadow-xl">
            バッテリーを満タンに！
          </div>
        </div>
        <div className="mx-auto mb-5 h-14 max-w-6xl overflow-hidden rounded-full bg-white shadow-inner">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${charge}%` }} />
        </div>
        <p className="text-6xl font-black text-emerald-700">{charge}%</p>
        <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-xl">
          <div className="relative h-36 overflow-hidden rounded-full bg-slate-200 shadow-inner">
            <div className="absolute left-[43%] top-4 flex h-28 w-[20%] items-center justify-center rounded-full bg-emerald-400 shadow-xl ring-4 ring-emerald-200">
              <span className="whitespace-nowrap rounded-full bg-white/95 px-6 py-3 text-3xl font-black text-emerald-700 shadow-sm">
                充電中
              </span>
            </div>
            <div className="absolute left-[32%] top-5 h-[6.5rem] w-[42%] rounded-full border-4 border-dashed border-emerald-500" />
            <div
              id="ev-charge-marker"
              className="absolute top-3 flex h-[7.5rem] w-36 animate-gauge items-center justify-center rounded-full border-4 border-white bg-white text-7xl shadow-2xl"
            >
              🚙
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-4 text-3xl font-black text-emerald-700">
            <span className="h-5 w-16 rounded-full bg-emerald-400" />
            ベスト充電ゾーン
          </div>
        </div>
        <p className="mt-5 min-h-10 text-3xl font-black text-emerald-700 xl:text-4xl">{note}</p>
      </div>
      <button onClick={chargeUp} className="w-full rounded-3xl bg-emerald-500 py-8 text-5xl font-black text-white shadow-xl">
        タイミング充電！
      </button>
    </div>
  );
}

function InspectionItemIcon({ icon }) {
  if (icon === "engine") return <EnginePartIcon />;
  if (icon === "muffler") return <MufflerPartIcon />;
  if (icon === "exhaustGas") return <ExhaustGasInspectionIcon />;
  if (icon === "speedometer") return <SpeedometerInspectionIcon />;
  return <span>{icon}</span>;
}

function EnginePartIcon() {
  return (
    <svg viewBox="0 0 96 72" className="h-16 w-20 drop-shadow-sm" aria-hidden="true">
      <rect x="24" y="24" width="38" height="30" rx="6" fill="#60a5fa" stroke="#1e3a8a" strokeWidth="5" />
      <rect x="34" y="14" width="18" height="12" rx="3" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="4" />
      <path d="M17 31h9v16h-9c-4 0-7-3-7-7v-2c0-4 3-7 7-7Z" fill="#93c5fd" stroke="#1e3a8a" strokeWidth="4" />
      <path d="M62 33h11l8 8v11H62Z" fill="#f97316" stroke="#1e3a8a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M31 35h24M31 44h18" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <path d="M42 14V8M58 24l6-8" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="75" cy="55" r="5" fill="#1e3a8a" />
    </svg>
  );
}

function MufflerPartIcon() {
  return (
    <svg viewBox="0 0 96 72" className="h-16 w-20 drop-shadow-sm" aria-hidden="true">
      <path d="M10 42h22" stroke="#475569" strokeWidth="9" strokeLinecap="round" />
      <rect x="29" y="29" width="38" height="24" rx="12" fill="#cbd5e1" stroke="#334155" strokeWidth="5" />
      <path d="M66 41h12c5 0 8-3 8-8v-4" fill="none" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <path d="M84 21h8" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <path d="M38 36h20M38 46h16" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 29c-4 0-7-3-7-7M20 24c-5-2-7-6-6-10" fill="none" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ExhaustGasInspectionIcon() {
  return (
    <svg viewBox="0 0 96 72" className="h-16 w-20 drop-shadow-sm" aria-hidden="true">
      <rect x="8" y="14" width="30" height="44" rx="8" fill="#e0f2fe" stroke="#0369a1" strokeWidth="5" />
      <path d="M16 27h14M16 39h10" stroke="#38bdf8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="24" cy="49" r="5" fill="#22c55e" stroke="#0369a1" strokeWidth="3" />
      <path d="M38 42h20" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
      <rect x="56" y="34" width="22" height="16" rx="8" fill="#cbd5e1" stroke="#334155" strokeWidth="5" />
      <path d="M76 42h11" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
      <path d="M86 31c-5-5-1-12 5-12M78 25c-6-6-2-14 6-16M70 30c-5-5-2-11 4-14" fill="none" stroke="#93c5fd" strokeWidth="4" strokeLinecap="round" />
      <path d="M18 18l5 5 9-10" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SpeedometerInspectionIcon() {
  return (
    <svg viewBox="0 0 96 72" className="h-16 w-20 drop-shadow-sm" aria-hidden="true">
      <path d="M18 53a30 30 0 1 1 60 0" fill="#dbeafe" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
      <path d="M25 53h46" stroke="#1e3a8a" strokeWidth="6" strokeLinecap="round" />
      <path d="M48 50l16-20" stroke="#f97316" strokeWidth="6" strokeLinecap="round" />
      <circle cx="48" cy="50" r="7" fill="#ffffff" stroke="#1e3a8a" strokeWidth="5" />
      <path d="M31 43l-5-4M39 31l-3-6M57 31l3-6M65 43l5-4" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" />
      <rect x="33" y="56" width="30" height="10" rx="5" fill="#22c55e" stroke="#166534" strokeWidth="3" />
      <path d="M42 61l4 3 8-8" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InspectionGame({ onComplete, onFail }) {
  const correctItems = ["ブレーキ", "車のライト", "排気ガス検査", "スピードメーター検査", "マフラー", "エンジン"];
  const checkItems = [
    { label: "ブレーキ", icon: "🛑", correct: true, hint: "止まる力" },
    { label: "車のライト", icon: "💡", correct: true, hint: "夜道の安全" },
    { label: "排気ガス検査", icon: "exhaustGas", correct: true, hint: "排気を測る" },
    { label: "スピードメーター検査", icon: "speedometer", correct: true, hint: "速度表示" },
    { label: "マフラー", icon: "muffler", correct: true, hint: "排気まわり" },
    { label: "エンジン", icon: "engine", correct: true, hint: "走る力" },
    { label: "洗車", icon: "🚿", correct: false, hint: "きれいにする" },
    { label: "景品交換", icon: "🎁", correct: false, hint: "プレゼント" },
    { label: "ドリンク補充", icon: "🥤", correct: false, hint: "お店の準備" },
    { label: "店内清掃", icon: "🧹", correct: false, hint: "お店そうじ" }
  ];
  const reservationDates = [
    { label: "5/18 13:00", open: false },
    { label: "5/20 15:00", open: false },
    { label: "5/22 10:00", open: true },
    { label: "5/24 14:00", open: false }
  ];
  const shuffleItems = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };
  const [randomCheckItems] = useState(() => shuffleItems(checkItems));
  const [randomReservationDates] = useState(() => shuffleItems(reservationDates));
  const [checkedItems, setCheckedItems] = useState([]);
  const [note, setNote] = useState(`点検スタンプを${correctItems.length}つ集めて、予約日を確定しよう！`);
  const isReadyToReserve = checkedItems.length === correctItems.length;

  const checkItem = (item) => {
    if (checkedItems.includes(item.label)) return;
    if (!item.correct) {
      setNote("それは車検前の点検スタンプではありません。");
      onFail("車検に必要な点検ではないものを選びました。点検スタンプを集め直そう！");
      return;
    }
    const next = [...checkedItems, item.label];
    setCheckedItems(next);
    setNote(
      next.length === correctItems.length
        ? "点検OK！予約日を確認して、必ず予約しよう。"
        : `いいね！あと${correctItems.length - next.length}つスタンプを集めよう。`
    );
  };

  const chooseReservationDate = (date) => {
    if (checkedItems.length < correctItems.length) {
      setNote(`先に点検スタンプを${correctItems.length}つ集めてね。`);
      return;
    }
    if (!date.open) {
      setNote("予約済みです。");
      onFail("予約済みです。空いている予約日を選ぼう！");
      return;
    }
    onComplete("車検予約を受け付けました！");
  };

  const skipReservation = () => {
    setNote("予約を確定しないと受付できません。");
    onFail("予約日を確定しませんでした。必ず予約ボタンを押そう！");
  };

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[2rem] border-4 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-orange-50 p-6 text-center shadow-inner">
        <div className="mx-auto mb-4 flex h-36 w-44 items-center justify-center rounded-[2rem] bg-white shadow-inner ring-4 ring-blue-100">
          <InspectionImage className="h-32 w-40" />
        </div>
        <p className="text-xl font-black tracking-[.16em] text-orange-500">INSPECTION NAVI</p>
        <p className="text-4xl font-black text-blue-700 xl:text-6xl">車検予約ナビチャレンジ</p>
        <p className="mx-auto mt-4 max-w-5xl whitespace-pre-line rounded-3xl bg-white px-6 py-5 text-center text-2xl font-bold text-slate-700 shadow-sm xl:text-4xl">
          安全点検カードを集めて、{"\n"}空いている予約日を1つ確定しよう。
        </p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-xl font-black sm:grid-cols-3 xl:text-2xl">
          <span className="rounded-full bg-blue-600 px-4 py-3 text-white shadow-sm">1 点検カード</span>
          <span className={`rounded-full px-4 py-3 shadow-sm ${isReadyToReserve ? "bg-orange-500 text-white" : "bg-white text-blue-400"}`}>2 予約日</span>
          <span className={`rounded-full px-4 py-3 shadow-sm ${isReadyToReserve ? "bg-emerald-500 text-white" : "bg-white text-blue-400"}`}>3 確定</span>
        </div>
        <div className="mt-5 h-8 overflow-hidden rounded-full bg-white shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all"
            style={{ width: `${(checkedItems.length / correctItems.length) * 100}%` }}
          />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {correctItems.map((item) => (
            <span
              key={item}
              className={`rounded-full px-3 py-3 text-base font-black shadow-sm xl:text-xl ${
                checkedItems.includes(item)
                  ? "bg-emerald-400 text-white"
                  : "bg-white text-blue-300"
              }`}
            >
              {checkedItems.includes(item) ? "OK" : "待機"}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {randomCheckItems.map((item) => {
          const checked = checkedItems.includes(item.label);
          return (
            <button
              key={item.label}
              onClick={() => checkItem(item)}
              className={`min-h-44 rounded-3xl border-4 p-4 text-center shadow-lg transition active:scale-[.97] xl:min-h-52 ${
                checked
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-white bg-white text-blue-700 hover:border-blue-300"
              }`}
            >
              <span className="flex h-20 items-center justify-center text-6xl">
                {checked ? "✅" : <InspectionItemIcon icon={item.icon} />}
              </span>
              <span className="mt-3 block text-xl font-black xl:text-2xl">{item.label}</span>
              <span className="mt-2 block rounded-full bg-blue-50 px-3 py-2 text-base font-black text-blue-500">
                {item.hint}
              </span>
            </button>
          );
        })}
      </div>
      <div className="rounded-[2rem] border-4 border-blue-200 bg-white p-6 text-center shadow-lg">
        <p className="text-xl font-black tracking-[.14em] text-blue-500">RESERVATION DATE</p>
        <p className="mt-2 text-3xl font-black text-slate-700">
          空きありのカレンダーだけを選ぼう
        </p>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {randomReservationDates.map((date) => (
            <button
              key={date.label}
              onClick={() => chooseReservationDate(date)}
              className={`relative rounded-3xl border-4 px-4 py-6 text-2xl font-black shadow transition active:scale-[.97] ${
                isReadyToReserve && date.open
                  ? "animate-pulse border-yellow-300 bg-yellow-100 text-orange-700 ring-4 ring-yellow-300 hover:border-orange-400 hover:bg-orange-100"
                  : isReadyToReserve
                    ? "border-slate-200 bg-slate-100 text-slate-400"
                    : "border-slate-200 bg-slate-100 text-slate-400"
              }`}
            >
              {isReadyToReserve && date.open && (
                <span className="absolute -right-2 -top-2 rounded-full bg-orange-500 px-3 py-1 text-sm font-black text-white shadow">
                  空きあり
                </span>
              )}
              <span className="mb-2 block text-6xl">📅</span>
              {date.label}
              {isReadyToReserve && !date.open && (
                <span className="mt-2 block text-lg font-black text-slate-500">
                  予約済み
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3">
          <button
            onClick={skipReservation}
            className="rounded-3xl border-4 border-slate-200 bg-slate-100 px-4 py-5 text-2xl font-black text-slate-500 shadow transition active:scale-[.97]"
          >
            予約しない
          </button>
        </div>
      </div>
      <p className="rounded-3xl bg-blue-50 px-5 py-4 text-center text-2xl font-black text-blue-700 shadow-inner">{note}</p>
    </div>
  );
}

function InsuranceGame({ onComplete, onFail }) {
  const correctCards = ["事故の補償", "車のトラブル", "ロードサービス"];
  const insuranceCards = [
    { label: "事故の補償", type: "crash", correct: true },
    { label: "車のトラブル", type: "trouble", correct: true },
    { label: "ロードサービス", type: "road", correct: true },
    { label: "洗車チケット", type: "wash", correct: false },
    { label: "カフェ割引", type: "cafe", correct: false },
    { label: "タイヤ交換", type: "tire", correct: false },
    { label: "オイル交換", type: "oil", correct: false },
    { label: "ガソリン割引", type: "fuel", correct: false },
    { label: "車検予約", type: "inspection", correct: false },
    { label: "店内清掃", type: "clean", correct: false }
  ];
  const shuffleCards = (items) => {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };
  const [cards] = useState(() => shuffleCards(insuranceCards));
  const [selected, setSelected] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [note, setNote] = useState("車の保険に必要な安心カードを3つ選ぼう！");

  const chooseCard = (card) => {
    if (selected.includes(card.label)) return;
    if (!card.correct) {
      setMistakes((value) => value + 1);
      setNote("それは車の保険とは少し違うかも。運転の安心につながるカードを選ぼう。");
      onFail("車の保険とは少し違うカードを選びました。安心につながるカードを選ぼう！");
      return;
    }

    const next = [...selected, card.label];
    setSelected(next);
    if (next.length === correctCards.length) {
      onComplete(mistakes === 0 ? "ぴったりの自動車保険プランを提案できました！" : "安心の自動車保険プランを提案できました！");
      return;
    }
    setNote(`いい選択！あと${correctCards.length - next.length}つ選ぼう。`);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-[2rem] bg-rose-100 p-6 text-center shadow-inner">
        <div className="mx-auto mb-4 flex h-36 w-36 items-center justify-center rounded-[2rem]">
          <InsuranceImage className="h-32 w-32" />
        </div>
        <p className="text-4xl font-black text-rose-700 xl:text-6xl">自動車保険の安心カードを選ぼう</p>
        <p className="mx-auto mt-4 max-w-5xl rounded-3xl bg-white px-6 py-5 text-2xl font-bold text-slate-700 shadow-sm xl:text-4xl">
          事故、雪道、急なトラブルに備えたいお客さまです。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => {
          const picked = selected.includes(card.label);
          return (
            <button
              key={card.label}
              onClick={() => chooseCard(card)}
              disabled={picked}
              className={`min-h-44 rounded-3xl border-4 p-4 text-center shadow-lg transition active:scale-[.97] xl:min-h-52 ${
                picked
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-white bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50"
              }`}
            >
              <span className="relative mx-auto flex h-24 w-24 items-center justify-center">
                <InsuranceMiniCardIcon type={card.type} />
                {picked && (
                  <span className="absolute -right-3 -top-3 rounded-full bg-emerald-500 px-3 py-1 text-sm font-black text-white shadow">
                    OK
                  </span>
                )}
              </span>
              <span className="mt-4 block text-xl font-black xl:text-2xl">{card.label}</span>
            </button>
          );
        })}
      </div>
      <p className="min-h-14 rounded-3xl bg-white px-5 py-4 text-center text-2xl font-black text-rose-700 shadow-sm xl:text-3xl">
        {note}
      </p>
    </div>
  );
}

function InsuranceMiniCardIcon({ type }) {
  const details = {
    crash: { mark: "!", color: "#ef4444", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    trouble: { mark: "?", color: "#f97316", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    road: { mark: "+", color: "#2563eb", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    wash: { mark: "W", color: "#38bdf8", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    cafe: { mark: "C", color: "#a16207", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    tire: { mark: "T", color: "#475569", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    oil: { mark: "O", color: "#334155", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    fuel: { mark: "F", color: "#f59e0b", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    inspection: { mark: "R", color: "#4f46e5", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" },
    clean: { mark: "S", color: "#64748b", path: "M18 39h28l-5-13c-1-3-4-5-7-5h-4c-3 0-6 2-7 5l-5 13Z" }
  }[type];

  return (
    <svg viewBox="0 0 64 64" className="h-24 w-24 drop-shadow-sm" aria-hidden="true">
      <rect x="6" y="8" width="52" height="48" rx="14" fill="none" stroke="#fecdd3" strokeWidth="4" />
      <path d={details.path} fill="#dbeafe" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
      <rect x="23" y="25" width="18" height="9" rx="2" fill="#ffffff" opacity=".95" />
      <circle cx="23" cy="43" r="4" fill="#334155" />
      <circle cx="41" cy="43" r="4" fill="#334155" />
      <path
        d="M45 17 54 21v7c0 6-4 10-9 12-5-2-9-6-9-12v-7l9-4Z"
        fill={details.color}
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <text
        x="45"
        y="31"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="14"
        fontWeight="900"
        fill="#ffffff"
      >
        {details.mark}
      </text>
    </svg>
  );
}

function UpgradePanel({ points, boughtUpgrades, onBuy }) {
  const availableUpgrades = upgrades.filter((upgrade) => !boughtUpgrades.includes(upgrade.key));

  return (
    <div className="rounded-3xl border-4 border-white bg-white/95 p-3 shadow-xl xl:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-blue-700 xl:text-4xl">スタンド成長</h2>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-black text-blue-700 xl:px-4 xl:py-2 xl:text-base">
          {boughtUpgrades.length}/{upgrades.length}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2 xl:gap-4">
        {availableUpgrades.length === 0 && (
          <div className="rounded-3xl bg-emerald-50 p-5 text-center font-black text-emerald-700">
            すべて購入済みです！
          </div>
        )}
        {availableUpgrades.map((upgrade) => {
          return (
            <button
              key={upgrade.key}
              onClick={() => onBuy(upgrade)}
              disabled={points < upgrade.cost}
              className={`flex items-center gap-3 rounded-2xl border-2 p-2.5 text-left shadow-sm transition active:scale-[.99] xl:min-h-44 xl:flex-row xl:justify-start xl:gap-4 xl:rounded-3xl xl:border-4 xl:p-4 xl:text-left ${
                points >= upgrade.cost
                    ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <span className="relative shrink-0">
                <span className="absolute -right-2 -top-2 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white shadow xl:px-2 xl:py-0.5 xl:text-xs">
                  UP
                </span>
                <UpgradeVisual upgrade={upgrade} size="panel" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-black leading-tight text-slate-800 xl:text-2xl">{upgrade.name}</span>
                <span className="mt-0.5 block text-xs font-bold leading-tight text-slate-500 xl:mt-1 xl:block xl:text-base">{upgrade.effect}</span>
              </span>
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-black text-orange-600 xl:px-4 xl:py-1.5 xl:text-xl">
                {upgrade.cost}pt
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function UpgradePurchaseToast({ upgrade }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-blue-950/65 p-5">
      {[...Array(30)].map((_, index) => (
        <span
          key={index}
          className="absolute animate-upgrade-confetti text-5xl"
          style={{
            left: `${(index * 29) % 100}%`,
            top: `${8 + (index * 17) % 76}%`,
            animationDelay: `${index * 0.06}s`
          }}
        >
          {index % 3 === 0 ? "✨" : index % 3 === 1 ? "⭐" : "🎉"}
        </span>
      ))}
      <div className="relative w-full max-w-4xl animate-upgrade-burst overflow-hidden rounded-[3rem] border-8 border-yellow-300 bg-white p-8 text-center shadow-2xl xl:p-12">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-yellow-300/50 blur-2xl" />
        <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-orange-300/50 blur-2xl" />
        <div className="absolute left-8 top-8 text-6xl animate-bounce">✨</div>
        <div className="absolute right-10 top-10 text-7xl animate-pulse">⭐</div>
        <div className="mx-auto mb-7 flex justify-center">
          <div className="animate-upgrade-arrive rounded-[3rem] bg-gradient-to-br from-yellow-300 via-orange-300 to-sky-300 p-5 shadow-2xl ring-[14px] ring-yellow-200/80">
            <UpgradeVisual upgrade={upgrade} size="pop" />
          </div>
        </div>
        <p className="relative text-2xl font-black tracking-[.18em] text-orange-500 xl:text-3xl">STAND UPGRADE</p>
        <p className="relative mt-2 text-6xl font-black text-blue-700 xl:text-8xl">設備パワーアップ！</p>
        <p className="relative mx-auto mt-6 max-w-3xl rounded-[2rem] bg-yellow-100 px-6 py-5 text-3xl font-black text-orange-700 shadow-inner xl:text-5xl">
          {upgrade.name}
        </p>
      </div>
    </div>
  );
}

function GoodJobClearOverlay() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-gradient-to-br from-yellow-300 via-orange-100 to-sky-300 p-4">
      {[...Array(52)].map((_, index) => (
        <span
          key={index}
          className="absolute animate-upgrade-confetti text-6xl"
          style={{
            left: `${(index * 23) % 98}%`,
            top: `${4 + (index * 31) % 82}%`,
            animationDelay: `${index * 0.05}s`
          }}
          aria-hidden="true"
        >
          {index % 4 === 0 ? "✨" : index % 4 === 1 ? "🎉" : index % 4 === 2 ? "⭐" : "🏆"}
        </span>
      ))}
      <div className="absolute inset-0 bg-white/25" />
      <div className="absolute left-8 top-8 text-8xl animate-bounce">✨</div>
      <div className="absolute right-10 top-10 text-8xl animate-pulse">🏆</div>
      <div className="absolute bottom-8 left-10 text-8xl animate-bounce">🎉</div>
      <div className="relative flex min-h-[86vh] w-full max-w-6xl animate-upgrade-burst flex-col items-center justify-center overflow-hidden rounded-[3.5rem] border-8 border-yellow-400 bg-white/96 p-8 text-center shadow-2xl xl:p-12">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-yellow-300/60 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-orange-300/60 blur-3xl" />
        <div className="relative mx-auto mb-8 flex h-72 w-72 animate-upgrade-arrive items-center justify-center rounded-full bg-gradient-to-br from-yellow-200 via-yellow-400 to-orange-500 text-[11rem] shadow-2xl ring-[18px] ring-yellow-100 xl:h-80 xl:w-80 xl:text-[13rem]">
          🥇
          <span className="absolute -right-2 -top-2 animate-bounce text-7xl">✨</span>
          <span className="absolute -bottom-4 -left-4 animate-pulse text-7xl">⭐</span>
        </div>
        <p className="relative text-3xl font-black tracking-[.2em] text-orange-500 xl:text-4xl">
          STAND COMPLETE
        </p>
        <p className="relative mt-3 text-7xl font-black leading-tight text-blue-700 xl:text-9xl">
          金メダル獲得！
        </p>
        <p className="relative mt-7 rounded-[2rem] bg-yellow-100 px-8 py-6 text-4xl font-black text-orange-700 shadow-inner xl:text-6xl">
          スタンド成長コンプリート！
        </p>
        <p className="relative mt-6 text-2xl font-bold text-slate-600 xl:text-3xl">
          5秒後にスタート画面へ戻ります
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
