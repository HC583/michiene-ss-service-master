import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CheckCircle2,
  Droplets,
  Fuel,
  Home,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Users,
  Wrench
} from "lucide-react";
import "./index.css";

const customers = [
  {
    speech: "札幌から函館まで行くから、満タンにしたい！",
    correctService: "給油",
    icon: "🚗"
  },
  {
    speech: "車でお出かけしたら車が汚れちゃった",
    correctService: "洗車",
    icon: "🚙"
  },
  {
    speech: "来週から雪が降りそう。そろそろ準備したいな",
    correctService: "タイヤ交換",
    icon: "🛞"
  },
  {
    speech: "家のストーブ用の灯油が少なくなってきたよ",
    correctService: "灯油配達",
    icon: "🏠"
  },
  {
    speech: "電気自動車のバッテリーが少ない！",
    correctService: "EV充電",
    icon: "🚘"
  },
  {
    speech: "車検の期限が来月なんだ",
    correctService: "車検予約",
    visual: "staffBooking"
  },
  {
    speech: "もしもの事故や車のトラブルに備えて保険を見直したい",
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
const levelThresholds = [0, 200, 400, 600, 800];

function randomCustomer() {
  return customers[Math.floor(Math.random() * customers.length)];
}

function getLevel(totalPoints) {
  return levelThresholds.reduce((level, threshold, index) => {
    return totalPoints >= threshold ? index + 1 : level;
  }, 1);
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
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [customer, setCustomer] = useState(() => randomCustomer());
  const [phase, setPhase] = useState("select");
  const [message, setMessage] = useState("いらっしゃいませ！お客さまの話を聞いてサービスを選ぼう。");
  const [activeService, setActiveService] = useState(null);
  const [boughtUpgrades, setBoughtUpgrades] = useState([]);
  const [levelMessage, setLevelMessage] = useState("");
  const [pointPop, setPointPop] = useState("");
  const [upgradePop, setUpgradePop] = useState(null);
  const [gameClear, setGameClear] = useState(false);

  const level = getLevel(totalPoints);

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
    setLevelMessage("");
    setPointPop("");
    setUpgradePop(null);
    setGameClear(false);
  };

  const chooseService = (service) => {
    if (phase !== "select") return;
    if (service === customer.correctService) {
      setActiveService(service);
      setPhase("mini");
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
    const nextTotal = totalPoints + earned;
    const oldLevel = getLevel(totalPoints);
    const nextLevel = getLevel(nextTotal);

    setPoints((value) => value + earned);
    setTotalPoints(nextTotal);
    setStreak(nextStreak);
    setPhase("done");
    setPointPop(`+${earned}`);
    setMessage(
      `${successMessage} ${basePoint}ポイント獲得！` +
        (serviceBonus ? ` 強化ボーナス +${serviceBonus}ポイント！` : "") +
        (bonus
          ? ` ${nextStreak}連続正解ボーナス！ +${bonus}ポイント`
          : "")
    );

    if (nextLevel > oldLevel) {
      setLevelMessage(
        `スタンドレベルが${nextLevel}にアップ！地域に頼られるスタンドになってきました！`
      );
      window.setTimeout(() => setLevelMessage(""), 2800);
    }
    window.setTimeout(() => setPointPop(""), 1000);
  };

  const nextCustomer = () => {
    setCustomer(randomCustomer());
    setPhase("select");
    setActiveService(null);
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

  if (screen === "title") {
    return <TitleScreen onStart={startGame} />;
  }

  return (
    <div className="min-h-screen bg-sky-100 text-slate-800">
      <div className="relative min-h-screen">
        <SnowBackground />
        <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-3 py-4 sm:px-5 lg:grid lg:grid-cols-[1.2fr_.8fr] lg:gap-5">
          <section className="flex flex-col gap-4">
            <TopBar points={points} totalPoints={totalPoints} level={level} streak={streak} />
            <StationScene boughtUpgrades={boughtUpgrades} level={level} pointPop={pointPop} />
            <CustomerPanel customer={customer} message={message} phase={phase} />
            {phase === "select" && <ServiceSelector onChoose={chooseService} />}
            {phase === "mini" && (
              <MiniGame service={activeService} onComplete={completeMiniGame} />
            )}
            {phase === "done" && (
              <button
                onClick={nextCustomer}
                className="w-full rounded-2xl bg-orange-500 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 active:scale-[.98]"
              >
                次のお客さまへ
              </button>
            )}
          </section>
          <aside className="flex flex-col gap-4">
            <UpgradePanel
              points={points}
              boughtUpgrades={boughtUpgrades}
              onBuy={buyUpgrade}
            />
            <ProgressPanel totalPoints={totalPoints} level={level} />
          </aside>
        </main>
        {levelMessage && <LevelUpToast message={levelMessage} />}
        {upgradePop && <UpgradePurchaseToast upgrade={upgradePop} />}
        {gameClear && <GoodJobClearOverlay />}
      </div>
    </div>
  );
}

function TitleScreen({ onStart }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-white to-orange-100" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-orange-100" />
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 text-center">
        <div className="w-full rounded-[2rem] border-4 border-white bg-white/75 p-5 shadow-2xl backdrop-blur sm:p-8">
          <div className="mx-auto mb-5 flex h-40 w-full max-w-4xl items-end justify-center rounded-3xl bg-sky-100 shadow-inner sm:h-56">
            <div className="relative h-full w-full overflow-hidden rounded-3xl bg-sky-100">
              <img
                src="/station-background-new.png?v=2"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain object-center"
                draggable="false"
              />
            </div>
          </div>
          <p className="mb-2 text-sm font-bold tracking-[.18em] text-orange-500 sm:text-base">
            HOKKAIDO SERVICE STATION GAME
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <div className="flex h-24 w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-inner sm:h-32 sm:w-24">
              <StaffImage className="h-[5.5rem] w-16 object-contain sm:h-28 sm:w-20" />
            </div>
            <h1 className="text-left text-4xl font-black leading-tight text-blue-700 sm:text-6xl">
              道エネ
              <span className="block text-orange-500">スタンドマスター</span>
            </h1>
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-bold text-slate-700 sm:text-2xl">
            北海道のくらしを支えるスタンドを育てよう！
          </p>
          <button
            onClick={onStart}
            className="mt-8 rounded-full bg-orange-500 px-10 py-5 text-xl font-black text-white shadow-xl shadow-orange-200 transition hover:bg-orange-600 active:scale-95 sm:text-2xl"
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
      <div className="absolute inset-x-0 bottom-0 h-28 bg-white" />
      <div className="absolute bottom-24 left-[-10%] h-32 w-[65%] rounded-t-[100%] bg-white/90" />
      <div className="absolute bottom-24 right-[-10%] h-40 w-[70%] rounded-t-[100%] bg-white/80" />
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

function TopBar({ points, totalPoints, level, streak }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="ポイント" value={`${points} pt`} icon={<Star />} tone="orange" />
      <StatCard label="スタンドレベル" value={`Lv.${level}`} icon={<Sparkles />} tone="blue" />
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
    <div className={`rounded-2xl border-2 p-3 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center gap-2 text-xs font-bold sm:text-sm">
        {React.cloneElement(icon, { size: 18 })}
        {label}
      </div>
      <div className="mt-1 text-xl font-black sm:text-2xl">{value}</div>
    </div>
  );
}

function StationScene({ boughtUpgrades, level, pointPop }) {
  const purchasedUpgrades = upgrades.filter((upgrade) => boughtUpgrades.includes(upgrade.key));

  return (
    <div className="relative min-h-[230px] overflow-hidden rounded-3xl border-4 border-white bg-sky-100 p-4 shadow-xl sm:min-h-[270px]">
      <img
        src="/station-background-new.png?v=2"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain object-center"
        draggable="false"
      />
      <div className="absolute inset-0 bg-white/5" />
      {pointPop && (
        <div className="absolute right-8 top-6 z-20 animate-pop rounded-full bg-orange-500 px-5 py-3 text-2xl font-black text-white shadow-xl">
          {pointPop}
        </div>
      )}
      <div className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-4 py-2 text-sm font-black text-blue-700 shadow">
        道エネ SS Lv.{level}
      </div>
      <div className="absolute left-4 right-4 top-14 z-10">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-blue-700/90 px-3 py-1 text-xs font-black text-white shadow">
            購入済み設備 {purchasedUpgrades.length}/{upgrades.length}
          </span>
          {purchasedUpgrades.length > 0 && <span className="text-2xl animate-pulse">✨</span>}
        </div>
        <div className="flex min-h-20 flex-wrap items-center gap-3">
          {purchasedUpgrades.length > 0 &&
            purchasedUpgrades.map((upgrade) => (
              <SceneIcon key={upgrade.key} label={<UpgradeVisual upgrade={upgrade} size="scene" />} />
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

function SceneIcon({ label }) {
  return (
    <div className="relative flex h-20 w-20 animate-pop items-center justify-center rounded-3xl border-4 border-yellow-300 bg-gradient-to-br from-white via-yellow-50 to-orange-100 text-4xl shadow-2xl ring-4 ring-white/60">
      <span className="absolute -right-1 -top-1 text-2xl animate-pulse">✨</span>
      <span className="relative z-10 flex h-full w-full items-center justify-center">
        {label}
      </span>
    </div>
  );
}

function CustomerPanel({ customer, message, phase }) {
  return (
    <div className="rounded-3xl border-4 border-white bg-white/90 p-4 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto flex h-20 w-20 shrink-0 animate-floaty items-center justify-center rounded-full bg-orange-100 text-4xl shadow-inner sm:mx-0">
          {customer.visual === "insurance" && <InsuranceCustomerIcon className="h-16 w-16" />}
          {customer.visual === "staffBooking" && <InspectionCustomerIcon />}
          {!customer.visual && customer.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
            お客さま
          </div>
          <p className="text-lg font-black leading-relaxed text-slate-800 sm:text-xl">
            「{customer.speech}」
          </p>
          <p
            className={`mt-2 rounded-2xl px-4 py-2 text-base font-bold ${
              phase === "mini"
                ? "bg-emerald-100 text-emerald-700"
                : phase === "done"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-sky-100 text-blue-700"
            }`}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function ServiceSelector({ onChoose }) {
  return (
    <div className="rounded-[2rem] border-4 border-orange-300 bg-orange-50 p-3 shadow-xl shadow-orange-100 sm:p-4">
      <div className="mb-3 flex items-center justify-center gap-3 rounded-2xl bg-white px-4 py-3 text-center shadow-sm">
        <span className="text-3xl" aria-hidden="true">
          👇
        </span>
        <div>
          <h2 className="text-2xl font-black leading-tight text-orange-600">
            サービスを選んでね
          </h2>
          <p className="text-sm font-bold text-slate-600 sm:text-base">
            お客さまのセリフに合うボタンを押そう
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {services.map(({ name, visual, hint, color }) => (
          <button
            key={name}
            onClick={() => onChoose(name)}
            aria-label={`${name}、${hint}`}
            className={`group relative flex min-h-40 flex-col items-center justify-center gap-2 rounded-3xl border-4 border-white bg-gradient-to-br ${color} p-3 text-center text-white shadow-lg ring-2 ring-orange-100 transition hover:-translate-y-1 hover:ring-orange-300 hover:shadow-xl active:scale-[.97]`}
          >
            <span className={`flex items-center justify-center rounded-3xl bg-white p-2 text-5xl shadow-inner ring-4 ring-white/40 transition group-hover:scale-105 ${visual === "tankerTruck" ? "h-28 w-36" : "h-28 w-28"}`}>
              <ServiceVisualIcon visual={visual} />
            </span>
            <span className="text-2xl font-black leading-tight">{name}</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-sm font-bold leading-tight">
              {hint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ServiceVisualIcon({ visual }) {
  if (visual === "fuelPump") return <FuelPumpIcon />;
  if (visual === "carWash") return <CarWashImage className="h-24 w-24" fallback="洗" />;
  if (visual === "winterTire") return <TireImage className="h-24 w-24" fallback="🛞" />;
  if (visual === "tankerTruck") return <TankerLorryImage className="h-24 w-32" fallback="🚚" />;
  if (visual === "evCharger") return <EvChargeIcon className="h-24 w-24" fallback="🚙" />;
  if (visual === "staffBooking") return <InspectionImage className="h-24 w-24" fallback="車検" />;
  if (visual === "insurance") return <InsuranceImage className="h-24 w-24" fallback="🛡️" />;
  return <span aria-hidden="true">?</span>;
}

function ImageIcon({ src, className, fallback }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`relative flex shrink-0 items-center justify-center ${className}`}>
      <span
        className={`absolute inset-0 z-0 flex items-center justify-center rounded-2xl bg-white text-4xl font-black text-blue-700 ${
          failed ? "opacity-100" : "opacity-20"
        }`}
        aria-hidden="true"
      >
        {fallback}
      </span>
      {!failed && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="relative z-10 h-full w-full object-contain"
          draggable="false"
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

function TankerLorryImage({ className = "h-16 w-16", fallback = "🚚" }) {
  return (
    <ImageIcon src="/tanker-lorry.png" className={className} fallback={fallback} />
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
      wrap: "h-16 w-16 rounded-2xl",
      image: "h-12 w-12",
      wide: "h-14 w-20",
      staff: "h-16 w-14"
    },
    scene: {
      wrap: "h-16 w-16 rounded-2xl",
      image: "h-14 w-14",
      wide: "h-16 w-24",
      staff: "h-20 w-14"
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

  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-visible ${isSky ? "" : "bg-white shadow-inner"} ${classes.wrap}`}>
      {!isSky && <span className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-white to-sky-100" />}
      {isSky && <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/90 via-yellow-100/70 to-sky-100/70 shadow-inner" />}
      {!isSky && <span className="absolute -left-6 top-2 h-6 w-24 rotate-[-25deg] bg-white/70" />}
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
    <ImageIcon src="/staff.png" className={className} fallback="👨‍🔧" />
  );
}

function MiniGame({ service, onComplete }) {
  const [retryKey, setRetryKey] = useState(0);
  const [failMessage, setFailMessage] = useState("");
  const [clearMessage, setClearMessage] = useState("");
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
  };
  const clearGame = (successMessage) => {
    if (clearMessage) return;
    setFailMessage("");
    setClearMessage(successMessage);
    window.setTimeout(() => onComplete(successMessage), 3200);
  };

  return (
    <div className="relative rounded-3xl border-4 border-white bg-white/95 p-4 shadow-xl">
      <h2 className="mb-4 text-2xl font-black text-blue-700">{service}ミニゲーム</h2>
      <Game key={retryKey} onComplete={clearGame} onFail={setFailMessage} />
      {clearMessage && (
        <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden rounded-3xl bg-blue-950/70 p-5">
          <div className="absolute left-6 top-6 text-4xl animate-bounce">✨</div>
          <div className="absolute right-8 top-10 text-5xl animate-pulse">⭐</div>
          <div className="absolute bottom-8 left-10 text-5xl animate-bounce">🎉</div>
          <div className="absolute bottom-12 right-10 text-4xl animate-pulse">✨</div>
          <div className="w-full max-w-lg animate-pop rounded-[2rem] border-4 border-yellow-300 bg-white p-6 text-center shadow-2xl">
            <p className="text-sm font-black tracking-widest text-orange-500">MISSION</p>
            <p className="mt-1 whitespace-nowrap text-3xl font-black leading-tight text-blue-700 sm:text-5xl">
              ミッションクリア！
            </p>
            <p className="mt-4 rounded-2xl bg-yellow-100 px-4 py-3 text-lg font-black text-orange-700">
              {clearMessage}
            </p>
          </div>
        </div>
      )}
      {failMessage && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/95 p-5">
          <div className="w-full max-w-sm rounded-3xl border-4 border-red-200 bg-red-50 p-5 text-center shadow-xl">
            <div className="mb-3 flex items-center justify-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white shadow-inner">
                <StaffImage className="h-24 w-20" />
              </div>
              <div className="relative rounded-2xl bg-white px-4 py-3 text-left text-base font-black text-orange-600 shadow">
                <span className="absolute -left-2 top-6 h-4 w-4 rotate-45 bg-white" />
                所長さん「もう一度やってみよう！」
              </div>
            </div>
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-6xl font-black text-white shadow-lg">
              ×
            </div>
            <p className="text-xl font-black text-red-700">もう一度やりなおそう！</p>
            <p className="mt-2 min-h-7 text-base font-bold text-slate-700">{failMessage}</p>
            <button
              onClick={retryGame}
              className="mt-4 w-full rounded-2xl bg-orange-500 py-4 text-xl font-black text-white shadow-lg active:scale-95"
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
    <div className="space-y-4">
      <div className="relative h-16 overflow-hidden rounded-full bg-slate-200 p-2">
        <div className="absolute left-[42%] top-2 h-12 w-[22%] rounded-full bg-emerald-400" />
        <div
          id="fuel-marker"
          className="absolute top-1 h-14 w-4 animate-gauge rounded-full bg-orange-500 shadow-lg"
        />
      </div>
      <button onClick={stopGauge} className="w-full rounded-2xl bg-orange-500 py-4 text-xl font-black text-white">
        ストップ
      </button>
      {result && <p className="text-center font-bold text-blue-700">{result}</p>}
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
    <div className="space-y-4">
      <p className="rounded-2xl bg-sky-100 px-4 py-3 text-center text-base font-black text-sky-800">
        大きな「あわ」をタッチして、車をピカピカにしよう！
      </p>

      <div className="relative mx-auto h-72 max-w-md overflow-hidden rounded-3xl border-4 border-sky-200 bg-gradient-to-b from-sky-100 to-white p-4 shadow-inner">
        <div className="absolute inset-x-0 bottom-0 h-20 bg-sky-200/70" />
        <div className="absolute bottom-8 left-1/2 flex h-36 w-52 -translate-x-1/2 items-center justify-center rounded-3xl bg-white shadow-inner">
          <CarWashImage className="h-32 w-44" />
        </div>

        {[...Array(dirtLeft)].map((_, index) => (
          <span
            key={`dirt-${index}`}
            className="absolute flex h-9 w-9 items-center justify-center rounded-full bg-amber-700 text-lg shadow-lg"
            style={{
              left: `${20 + (index * 13) % 58}%`,
              bottom: `${42 + (index % 2) * 22}px`
            }}
          >
            ✨
          </span>
        ))}

        {currentSpot && (
          <button
            onClick={washSpot}
            className="absolute flex h-20 w-20 animate-bounce items-center justify-center rounded-3xl border-4 border-white bg-sky-300 text-5xl shadow-xl active:scale-90"
            style={currentSpot}
            aria-label="あわをタッチ"
          >
            🫧
          </button>
        )}

        {bursts.map((burst) => (
          <div
            key={burst.id}
            className="pointer-events-none absolute z-20 h-24 w-24 -translate-x-2 -translate-y-2 animate-pop"
            style={{ left: burst.left, top: burst.top }}
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full bg-yellow-200/80 blur-sm" />
            <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-300 bg-white/80 shadow-xl" />
            <span className="absolute -left-4 top-5 text-3xl animate-bounce">✨</span>
            <span className="absolute right-0 top-0 text-4xl animate-pulse">💦</span>
            <span className="absolute bottom-0 right-2 text-3xl animate-bounce">⭐</span>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-orange-500 px-3 py-1 text-sm font-black text-white shadow-lg">
              ピカッ!
            </span>
          </div>
        ))}

        <div className="absolute left-4 top-4 rounded-full bg-orange-400 px-3 py-1 text-sm font-black text-white shadow">
          あと {dirtLeft} こ
        </div>
      </div>

      <button
        onClick={washSpot}
        disabled={!currentSpot}
        className="w-full rounded-2xl bg-sky-500 py-4 text-xl font-black text-white shadow-lg active:scale-95 disabled:bg-slate-300"
      >
        あわをタッチ！
      </button>

      <div className="space-y-2 rounded-2xl bg-white p-3 shadow-inner">
        <div className="flex items-center justify-between text-sm font-black text-sky-800">
          <span>洗車パワー</span>
          <span>{washed}/{foamSpots.length}</span>
        </div>
        <div className="h-5 overflow-hidden rounded-full bg-sky-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500 transition-all"
            style={{ width: `${(washed / foamSpots.length) * 100}%` }}
          />
        </div>
        <div className="grid grid-cols-5 gap-1">
          {foamSpots.map((_, index) => (
            <div key={index} className={`h-2 rounded-full ${index < washed ? "bg-emerald-400" : "bg-slate-200"}`} />
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
    <div className="space-y-4">
      <p className="rounded-2xl bg-blue-100 px-4 py-3 text-center text-base font-black text-blue-800">
        {note}
      </p>

      <div className="relative mx-auto max-w-md overflow-hidden rounded-3xl border-4 border-blue-200 bg-gradient-to-b from-sky-100 to-white p-5 shadow-inner">
        <div className="absolute left-4 top-4 text-3xl animate-bounce">❄️</div>
        <div className="absolute right-5 top-6 text-2xl animate-pulse">✨</div>
        <OverheadTireCar
          positions={tirePositions}
          activeIndex={currentWheel}
          stage={stage}
          tighteningStep={tighteningStep}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tirePositions.map((position, index) => {
          const done = index < currentWheel;
          const active = index === currentWheel;
          return (
            <button
              key={position.label}
              onClick={() => pickWheel(index)}
              disabled={stage !== "pick" && active}
              className={`min-h-20 rounded-3xl border-4 p-3 text-lg font-black shadow-lg transition active:scale-95 ${
                done
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : active
                    ? "border-orange-300 bg-orange-100 text-orange-700 ring-4 ring-orange-200"
                    : "border-slate-200 bg-white text-slate-500"
              }`}
            >
              <span className="block text-2xl">{done ? "✅" : active ? "🛞" : "○"}</span>
              {position.label}
            </button>
          );
        })}
      </div>

      {stage === "tighten" && (
        <div className="rounded-3xl bg-slate-100 p-4 text-center shadow-inner">
          <div className="mb-3 flex items-center justify-center gap-3 text-lg font-black text-orange-700">
            <Wrench className="h-8 w-8 animate-spin" />
            ナット締め中！
          </div>
          <div className="flex justify-center gap-3">
            {[0, 1, 2].map((index) => (
              <NutIcon
                key={index}
                tightened={index < tighteningStep}
                className={`h-12 w-12 transition ${index === tighteningStep ? "scale-110 animate-pulse" : ""}`}
              />
            ))}
          </div>
          <p className="mt-3 text-sm font-bold text-slate-600">
            {activeTirePosition.label}をカチッと固定しています
          </p>
        </div>
      )}
    </div>
  );
}

function OverheadTireCar({ positions, activeIndex, stage, tighteningStep }) {
  return (
    <div className="relative mx-auto h-96 max-w-sm overflow-hidden rounded-[2rem] bg-white/55 shadow-inner">
      <img
        src="/car-top-view.png"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[22rem] -translate-x-1/2 -translate-y-1/2 object-contain"
        draggable="false"
      />
      {positions.map((position, index) => {
        const done = index < activeIndex;
        const active = index === activeIndex;
        return (
          <div
            key={position.label}
            className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-4 shadow-xl transition ${
              done
                ? "border-emerald-300 bg-emerald-100"
                : active
                  ? "border-yellow-300 bg-orange-100 ring-8 ring-yellow-200"
                  : "border-slate-300 bg-white"
            }`}
            style={{ left: position.x, top: position.y }}
          >
            <TireImage className={`${active ? "h-16 w-16 animate-pulse" : "h-14 w-14"}`} />
            {active && stage === "tighten" && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/75">
                <NutIcon tightened={tighteningStep > 0} className="h-10 w-10 animate-spin" />
              </div>
            )}
            <span className="absolute -bottom-6 rounded-full bg-blue-700 px-2 py-0.5 text-xs font-black text-white">
              {position.short}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function KeroseneGame({ onComplete, onFail }) {
  const obstacles = [0, 2, 1, 0, 2];
  const laneNames = ["上の道", "まんなか", "下の道"];
  const [steps, setSteps] = useState(0);
  const [lane, setLane] = useState(1);
  const [note, setNote] = useState("雪だるまをよけて、おうちまで灯油を届けよう！");
  const obstacleLane = obstacles[steps % obstacles.length];

  const chooseLane = (nextLane) => {
    setLane(nextLane);
    if (nextLane === obstacleLane) {
      setNote("あっ、雪でストップ！別の道を選んでね。");
      onFail("雪だるまのある道に入ってしまいました。雪だるまのない道を選ぼう！");
      return;
    }

    const next = steps + 1;
    setSteps(next);
    setNote(next >= 5 ? "おうちに到着！" : `いい道！あと${5 - next}マスで到着！`);
    if (next >= 5) onComplete("灯油をお届けしました！");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-amber-100 p-4">
        <div className="mb-3 rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-sm font-black text-amber-700">灯油ローリー雪道チャレンジ</p>
          <div className="mt-1 flex items-center justify-center gap-3">
            <span className="text-4xl">☃️</span>
            <span className="text-lg font-black text-slate-800">雪だるまのない道を選ぼう</span>
          </div>
        </div>
        <div className="relative h-48 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-white p-4 shadow-inner">
          {[0, 1, 2].map((roadLane) => (
            <div
              key={roadLane}
              className="absolute left-4 right-16 h-9 rounded-full bg-slate-500 shadow-inner"
              style={{ top: `${22 + roadLane * 46}px` }}
            >
              <div className="mx-auto mt-4 h-1 w-4/5 rounded-full bg-yellow-200" />
            </div>
          ))}
          <div
            className="absolute left-[58%] flex h-10 w-10 items-center justify-center rounded-full bg-white text-3xl shadow"
            style={{ top: `${20 + obstacleLane * 46}px` }}
          >
            ☃️
          </div>
          <div
            className="absolute flex h-16 w-32 items-center justify-center rounded-2xl bg-white/80 transition-all duration-500"
            style={{
              left: `${4 + Math.min(steps * 10, 42)}%`,
              top: `${8 + lane * 46}px`
            }}
          >
            <TankerLorryImage className="h-16 w-32" />
          </div>
          <div className="absolute right-2 top-16 text-5xl">🏠</div>
          <div className="absolute right-10 top-7 text-2xl">♨️</div>
        </div>
        <div className="mt-3 h-4 overflow-hidden rounded-full bg-white shadow-inner">
          <div className="h-full bg-orange-500 transition-all" style={{ width: `${Math.min(steps * 20, 100)}%` }} />
        </div>
        <p className="mt-3 min-h-7 text-center text-base font-black text-amber-700">{note}</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {laneNames.map((label, index) => (
          <button
            key={label}
            onClick={() => chooseLane(index)}
            className={`rounded-2xl py-4 text-base font-black text-white shadow-lg transition hover:brightness-105 active:scale-[.97] sm:text-xl ${
              index === 1 ? "bg-orange-500" : "bg-blue-600"
            }`}
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
    <div className="space-y-4">
      <div className="rounded-3xl bg-emerald-100 p-5 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-inner">
          <span className="text-5xl" aria-hidden="true">
            🚙
          </span>
        </div>
        <div className="mb-4 h-8 overflow-hidden rounded-full bg-white shadow-inner">
          <div className="h-full bg-emerald-500 transition-all" style={{ width: `${charge}%` }} />
        </div>
        <p className="text-3xl font-black text-emerald-700">{charge}%</p>
        <div className="mt-4 rounded-2xl bg-white p-3 shadow-sm">
          <div className="relative h-12 overflow-hidden rounded-full bg-slate-200">
            <div className="absolute left-[43%] top-1 h-10 w-[20%] rounded-full bg-emerald-400 shadow-inner" />
            <div className="absolute left-[32%] top-2 h-8 w-[42%] rounded-full border-2 border-dashed border-emerald-500" />
            <div
              id="ev-charge-marker"
              className="absolute top-1 flex h-10 w-12 animate-gauge items-center justify-center rounded-full border-4 border-white bg-white text-2xl shadow-lg"
            >
              🚙
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-sm font-black text-emerald-700">
            <span className="h-3 w-8 rounded-full bg-emerald-400" />
            ベスト充電ゾーン
          </div>
        </div>
        <p className="mt-3 min-h-7 text-base font-black text-emerald-700">{note}</p>
      </div>
      <button onClick={chargeUp} className="w-full rounded-2xl bg-emerald-500 py-4 text-xl font-black text-white">
        タイミング充電！
      </button>
    </div>
  );
}

function InspectionGame({ onComplete, onFail }) {
  const correctItems = ["ブレーキ", "ライト", "ワイパー", "タイヤ溝", "バッテリー", "エンジンオイル"];
  const checkItems = [
    { label: "ブレーキ", icon: "🛑", correct: true },
    { label: "ライト", icon: "💡", correct: true },
    { label: "ワイパー", icon: "🌧️", correct: true },
    { label: "タイヤ溝", icon: "🛞", correct: true },
    { label: "バッテリー", icon: "🔋", correct: true },
    { label: "エンジンオイル", icon: "🛢️", correct: true },
    { label: "洗車", icon: "🚿", correct: false },
    { label: "ドリンク補充", icon: "🥤", correct: false },
    { label: "景品交換", icon: "🎁", correct: false },
    { label: "レシート確認", icon: "🧾", correct: false }
  ];
  const dates = useMemo(
    () => [
      { label: "5/18", open: false },
      { label: "5/22", open: true },
      { label: "5/29", open: false }
    ],
    []
  );
  const [checkedItems, setCheckedItems] = useState([]);
  const [note, setNote] = useState("車検に必要な点検を6つ選ぼう！");

  const checkItem = (item) => {
    if (checkedItems.includes(item.label)) return;
    if (!item.correct) {
      setNote("それは車検の点検とは少し違うよ。車の安全に関係するものを選ぼう。");
      onFail("車検の点検項目ではないものを選びました。安全に関係する項目を探そう！");
      return;
    }
    const next = [...checkedItems, item.label];
    setCheckedItems(next);
    setNote(
      next.length === correctItems.length
        ? "点検OK！空いている日を選んで予約しよう。"
        : `いいね！あと${correctItems.length - next.length}つ点検しよう。`
    );
  };

  const chooseDate = (date) => {
    if (checkedItems.length < correctItems.length) {
      setNote("先に車検に必要な点検を全部チェックしてね。");
      return;
    }
    if (date.open) onComplete("車検予約を受け付けました！");
    else {
      setNote("その日は予約でいっぱい。別の日を選んでね。");
      onFail("予約がいっぱいの日を選びました。空いている日を探そう！");
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-blue-100 p-4 text-center">
        <div className="mx-auto mb-3 flex h-24 w-28 items-center justify-center rounded-3xl bg-white shadow-inner">
          <InspectionImage className="h-20 w-24" />
        </div>
        <p className="text-lg font-black text-blue-700">車検まえの点検スタンプ</p>
        <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          正しい点検を6つチェックできたら予約に進めます。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {checkItems.map((item) => {
          const checked = checkedItems.includes(item.label);
          return (
            <button
              key={item.label}
              onClick={() => checkItem(item)}
              className={`min-h-28 rounded-3xl border-4 p-3 text-center shadow-lg transition active:scale-[.97] ${
                checked
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-white bg-white text-blue-700 hover:border-blue-300"
              }`}
            >
              <span className="block text-4xl">{checked ? "✅" : item.icon}</span>
              <span className="mt-2 block text-sm font-black sm:text-base">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {dates.map((date) => (
          <button
            key={date.label}
            onClick={() => chooseDate(date)}
            className={`min-h-24 rounded-2xl border-4 p-3 text-xl font-black shadow transition active:scale-[.97] ${
              checkedItems.length === correctItems.length
                ? "border-blue-200 bg-white text-blue-700 hover:bg-blue-50"
                : "border-slate-200 bg-slate-100 text-slate-400"
            }`}
          >
            <span className="mb-2 block text-2xl">📅</span>
            {date.label}
          </button>
        ))}
      </div>
      <p className="text-center font-bold text-blue-700">{note}</p>
    </div>
  );
}

function InsuranceGame({ onComplete, onFail }) {
  const correctCards = ["事故の補償", "車のトラブル", "ロードサービス"];
  const cards = [
    { label: "事故の補償", icon: "🚗", correct: true },
    { label: "車のトラブル", icon: "⚠️", correct: true },
    { label: "ロードサービス", icon: "🔧", correct: true },
    { label: "洗車チケット", icon: "🚿", correct: false },
    { label: "カフェ割引", icon: "☕", correct: false },
    { label: "タイヤ交換", icon: "🛞", correct: false },
    { label: "オイル交換", icon: "🛢️", correct: false },
    { label: "ガソリン割引", icon: "⛽", correct: false },
    { label: "車検予約", icon: "📅", correct: false },
    { label: "店内清掃", icon: "🧹", correct: false }
  ];
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
    <div className="space-y-4">
      <div className="rounded-3xl bg-rose-100 p-4 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-inner">
          <InsuranceImage className="h-16 w-16" />
        </div>
        <p className="text-lg font-black text-rose-700">自動車保険の安心カードを選ぼう</p>
        <p className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          事故、雪道、急なトラブルに備えたいお客さまです。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {cards.map((card) => {
          const picked = selected.includes(card.label);
          return (
            <button
              key={card.label}
              onClick={() => chooseCard(card)}
              disabled={picked}
              className={`min-h-28 rounded-3xl border-4 p-3 text-center shadow-lg transition active:scale-[.97] ${
                picked
                  ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                  : "border-white bg-white text-slate-800 hover:border-rose-300 hover:bg-rose-50"
              }`}
            >
              <span className="block text-4xl">{picked ? "✅" : card.icon}</span>
              <span className="mt-2 block text-base font-black">{card.label}</span>
            </button>
          );
        })}
      </div>
      <p className="min-h-7 rounded-2xl bg-white px-4 py-3 text-center font-black text-rose-700 shadow-sm">
        {note}
      </p>
    </div>
  );
}

function UpgradePanel({ points, boughtUpgrades, onBuy }) {
  const availableUpgrades = upgrades.filter((upgrade) => !boughtUpgrades.includes(upgrade.key));

  return (
    <div className="rounded-3xl border-4 border-white bg-white/95 p-4 shadow-xl">
      <h2 className="mb-3 text-2xl font-black text-blue-700">スタンド成長</h2>
      <div className="grid gap-3">
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
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left shadow-sm transition active:scale-[.99] ${
                points >= upgrade.cost
                    ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <span className="relative shrink-0">
                <span className="absolute -right-2 -top-2 z-10 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white shadow">
                  UP
                </span>
                <UpgradeVisual upgrade={upgrade} size="panel" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-slate-800">{upgrade.name}</span>
                <span className="block text-sm font-bold text-slate-500">{upgrade.effect}</span>
              </span>
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-black text-orange-600">
                {upgrade.cost}pt
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProgressPanel({ totalPoints, level }) {
  const nextThreshold = levelThresholds[level] ?? levelThresholds[levelThresholds.length - 1];
  const currentThreshold = levelThresholds[level - 1] ?? 0;
  const progress =
    level >= 5
      ? 100
      : ((totalPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return (
    <div className="rounded-3xl border-4 border-white bg-blue-700 p-4 text-white shadow-xl">
      <h2 className="mb-3 text-xl font-black">レベルアップ進行</h2>
      <div className="h-5 overflow-hidden rounded-full bg-white/25">
        <div className="h-full bg-orange-400 transition-all" style={{ width: `${Math.max(0, Math.min(progress, 100))}%` }} />
      </div>
      <p className="mt-3 font-bold">
        {level >= 5 ? "最高レベル！すごいスタンドです。" : `次のレベルまで ${Math.max(nextThreshold - totalPoints, 0)} pt`}
      </p>
    </div>
  );
}

function LevelUpToast({ message }) {
  return (
    <div className="fixed inset-x-3 top-6 z-50 mx-auto max-w-xl animate-pop rounded-3xl border-4 border-yellow-300 bg-white p-5 text-center shadow-2xl">
      <div className="mb-2 flex justify-center gap-2 text-3xl text-yellow-400">
        <Sparkles className="animate-sparkle" />
        <Sparkles className="animate-sparkle [animation-delay:.2s]" />
        <Sparkles className="animate-sparkle [animation-delay:.4s]" />
      </div>
      <p className="text-xl font-black text-blue-700">{message}</p>
    </div>
  );
}

function UpgradePurchaseToast({ upgrade }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/45 p-5">
      <div className="relative w-full max-w-md animate-pop overflow-hidden rounded-[2rem] border-4 border-yellow-300 bg-white p-6 text-center shadow-2xl">
        <div className="absolute left-5 top-5 text-4xl animate-bounce">✨</div>
        <div className="absolute right-6 top-7 text-4xl animate-pulse">⭐</div>
        <div className="absolute bottom-7 left-7 text-4xl animate-bounce">🎉</div>
        <div className="absolute bottom-8 right-8 text-4xl animate-pulse">✨</div>
        <div className="mx-auto mb-4 flex justify-center">
          <div className="rounded-[2rem] bg-gradient-to-br from-yellow-300 via-orange-300 to-sky-300 p-2 shadow-xl">
            <UpgradeVisual upgrade={upgrade} size="pop" />
          </div>
        </div>
        <p className="text-sm font-black tracking-[.18em] text-orange-500">STAND UPGRADE</p>
        <p className="mt-1 text-3xl font-black text-blue-700">設備パワーアップ！</p>
        <p className="mt-3 rounded-2xl bg-yellow-100 px-4 py-3 text-lg font-black text-orange-700">
          {upgrade.name}
        </p>
      </div>
    </div>
  );
}

function GoodJobClearOverlay() {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-gradient-to-br from-sky-300 via-white to-yellow-200 p-5">
      {[...Array(18)].map((_, index) => (
        <span
          key={index}
          className="absolute animate-bounce text-3xl"
          style={{
            left: `${(index * 17) % 96}%`,
            top: `${(index * 29) % 90}%`,
            animationDelay: `${index * 0.08}s`
          }}
          aria-hidden="true"
        >
          {index % 3 === 0 ? "✨" : index % 3 === 1 ? "🎉" : "⭐"}
        </span>
      ))}
      <div className="relative w-full max-w-lg animate-pop rounded-[2rem] border-4 border-yellow-300 bg-white/95 p-6 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-32 w-32 items-end justify-center overflow-hidden rounded-full bg-orange-100 shadow-inner">
          <StaffImage className="h-40 w-32" />
        </div>
        <p className="text-6xl font-black leading-none text-blue-700 sm:text-7xl">
          Good Job
        </p>
        <p className="mt-4 rounded-2xl bg-yellow-100 px-4 py-3 text-xl font-black text-orange-700">
          すべての設備がそろいました！
        </p>
        <p className="mt-3 text-base font-bold text-slate-600">
          5秒後にスタート画面へ戻ります
        </p>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
