import React, { useMemo, useState } from "react";
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
    speech: "雪道を走ったら車が真っ白になっちゃった！",
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
    icon: "📋"
  },
  {
    speech: "もしもの事故や雪道のトラブルに備えて、保険を見直したいな",
    correctService: "自動車保険",
    icon: "🛡️"
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
    name: "休憩スペースを作る",
    cost: 300,
    effect: "お客さんの満足度が上がる",
    key: "rest",
    icon: "☕"
  },
  {
    name: "子育て応援スペースを作る",
    cost: 500,
    effect: "ファミリーのお客さんが増える",
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
const levelThresholds = [0, 500, 1000, 2000, 3500];

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
  const [message, setMessage] = useState("いらっしゃいませ！お客さんの話を聞いてサービスを選ぼう。");
  const [activeService, setActiveService] = useState(null);
  const [boughtUpgrades, setBoughtUpgrades] = useState([]);
  const [levelMessage, setLevelMessage] = useState("");
  const [pointPop, setPointPop] = useState("");

  const level = getLevel(totalPoints);

  const startGame = () => {
    setScreen("game");
    setCustomer(randomCustomer());
    setPhase("select");
    setMessage("お客さんの困りごとに合うサービスを選ぼう。");
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
    setMessage("次のお客さんです。セリフをよく読んでね。");
  };

  const buyUpgrade = (upgrade) => {
    if (boughtUpgrades.includes(upgrade.key)) return;
    if (points < upgrade.cost) {
      setMessage("ポイントが足りません。もう少し接客してためよう！");
      return;
    }
    setPoints((value) => value - upgrade.cost);
    setBoughtUpgrades((value) => [...value, upgrade.key]);
    setMessage(`${upgrade.name}を購入！スタンドがもっと便利になりました。`);
  };

  if (screen === "title") {
    return <TitleScreen onStart={startGame} />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-sky-100 text-slate-800">
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
                次のお客さんへ
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
          <div className="mx-auto mb-5 flex h-28 w-full max-w-2xl items-end justify-center rounded-3xl bg-sky-100 p-3 shadow-inner sm:h-40">
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-sky-100">
              <img
                src="/station-background.png"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-left-bottom"
                draggable="false"
              />
              <div className="absolute bottom-0 left-0 h-14 w-16 bg-gradient-to-b from-sky-100 from-45% to-[#b7d99a] to-45%" />
            </div>
          </div>
          <p className="mb-2 text-sm font-bold tracking-[.18em] text-orange-500 sm:text-base">
            HOKKAIDO SERVICE STATION GAME
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <div className="flex h-20 w-16 shrink-0 items-end justify-center overflow-hidden rounded-2xl bg-white shadow-inner sm:h-28 sm:w-20">
              <StaffImage className="h-24 w-20 sm:h-32 sm:w-24" />
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
  const has = (key) => boughtUpgrades.includes(key);

  return (
    <div className="relative min-h-[230px] overflow-hidden rounded-3xl border-4 border-white bg-sky-100 p-4 shadow-xl sm:min-h-[300px]">
      <img
        src="/station-background.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-left-bottom"
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
      <div className="absolute bottom-3 left-0 right-0 h-14 bg-gradient-to-t from-black/10 to-transparent" />
      {has("wash") && (
        <SceneIcon
          className="left-[4%] bottom-[22%]"
          label={<CarWashImage className="h-12 w-12" />}
        />
      )}
      {has("kerosene") && (
        <SceneIcon
          className="right-[8%] bottom-[23%]"
          label={<TankerLorryImage className="h-16 w-28" />}
        />
      )}
      {has("ev") && (
        <SceneIcon
          className="right-[24%] bottom-[22%]"
          label={<EvChargeIcon className="h-12 w-12" />}
        />
      )}
      {has("rest") && <SceneIcon className="left-[34%] bottom-[22%]" label="☕" />}
      {has("family") && <SceneIcon className="right-[38%] bottom-[33%]" label="🧸" />}
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

function SceneIcon({ className, label }) {
  return (
    <div
      className={`absolute flex h-14 w-14 animate-pop items-center justify-center rounded-2xl border-4 border-white bg-white/90 text-3xl shadow-lg ${className}`}
    >
      {label}
    </div>
  );
}

function CustomerPanel({ customer, message, phase }) {
  return (
    <div className="rounded-3xl border-4 border-white bg-white/90 p-4 shadow-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto flex h-24 w-24 shrink-0 animate-floaty items-center justify-center rounded-full bg-orange-100 text-5xl shadow-inner sm:mx-0">
          {customer.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
            来店中のお客さん
          </div>
          <p className="text-xl font-black leading-relaxed text-slate-800 sm:text-2xl">
            「{customer.speech}」
          </p>
          <p
            className={`mt-3 rounded-2xl px-4 py-3 text-base font-bold ${
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
            お客さんのセリフに合うボタンを押そう
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {services.map(({ name, emoji, visual, hint, color }) => (
          <button
            key={name}
            onClick={() => onChoose(name)}
            aria-label={`${name}、${hint}`}
            className={`group relative flex min-h-40 flex-col items-center justify-center gap-2 overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br ${color} p-3 text-center text-white shadow-lg ring-2 ring-orange-100 transition hover:-translate-y-1 hover:ring-orange-300 hover:shadow-xl active:scale-[.97]`}
          >
            <span className={`flex items-center justify-center rounded-3xl bg-white p-1 text-5xl shadow-inner ring-4 ring-white/40 transition group-hover:scale-105 ${visual === "tankerTruck" ? "h-32 w-40" : visual === "winterTire" ? "h-28 w-28" : visual === "fuelPump" || visual === "insurance" ? "h-28 w-28" : "h-24 w-24"}`}>
              {visual === "fuelPump" && <FuelPumpIcon />}
              {visual === "carWash" && <CarWashImage className="h-[5.5rem] w-[5.5rem]" />}
              {visual === "winterTire" && <WinterTireIcon />}
              {visual === "tankerTruck" && <TankerLorryImage className="h-28 w-44" />}
              {visual === "evCharger" && <EvChargeIcon className="h-[5.5rem] w-[5.5rem]" />}
              {visual === "staffBooking" && <InspectionImage className="h-[5.5rem] w-[5.5rem]" />}
              {visual === "insurance" && <InsuranceImage className="h-28 w-28" />}
              {!visual && emoji}
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

function EvChargeIcon({ className = "h-16 w-16" }) {
  return (
    <img
      src="/EV.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function CarWashImage({ className = "h-16 w-16" }) {
  return (
    <img
      src="/car-wash.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function TankerLorryImage({ className = "h-16 w-16" }) {
  return (
    <img
      src="/tanker-lorry.png"
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
    <TireImage className="h-28 w-28" />
  );
}

function TireImage({ className = "h-16 w-16" }) {
  return (
    <img
      src="/tire.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
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

function InspectionImage({ className = "h-16 w-16" }) {
  return (
    <img
      src="/inspection.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function InsuranceImage({ className = "h-16 w-16" }) {
  return (
    <img
      src="/insurance.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function StaffImage({ className = "h-16 w-16" }) {
  return (
    <img
      src="/staff.png"
      alt=""
      aria-hidden="true"
      className={`${className} object-contain`}
      draggable="false"
    />
  );
}

function MiniGame({ service, onComplete }) {
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
  return (
    <div className="rounded-3xl border-4 border-white bg-white/95 p-4 shadow-xl">
      <h2 className="mb-4 text-2xl font-black text-blue-700">{service}ミニゲーム</h2>
      <Game onComplete={onComplete} />
    </div>
  );
}

function FuelGame({ onComplete }) {
  const [result, setResult] = useState("");
  const stopGauge = () => {
    const marker = document.querySelector("#fuel-marker");
    const percent = marker ? parseFloat(getComputedStyle(marker).left) / marker.parentElement.clientWidth : 0;
    if (percent >= 0.42 && percent <= 0.64) {
      onComplete("満タン完了！");
    } else {
      setResult("緑のところをねらってもう一度！");
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
  const [dirt, setDirt] = useState([0, 1, 2, 3, 4]);
  const removeDirt = (id) => {
    const next = dirt.filter((item) => item !== id);
    setDirt(next);
    if (next.length === 0) onComplete("ピカピカになりました！");
  };
  return (
    <div className="relative mx-auto h-56 max-w-md rounded-3xl bg-sky-100 p-4">
      <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-white shadow-inner">
        <CarWashImage className="h-36 w-36" />
      </div>
      {dirt.map((id) => (
        <button
          key={id}
          onClick={() => removeDirt(id)}
          className="absolute h-12 w-12 rounded-full bg-amber-700 text-2xl shadow-lg active:scale-90"
          style={{
            left: `${18 + (id * 15) % 62}%`,
            top: `${22 + (id * 19) % 48}%`
          }}
          aria-label="汚れを落とす"
        >
          ✨
        </button>
      ))}
    </div>
  );
}

function TireGame({ onComplete }) {
  const [nextTire, setNextTire] = useState(0);
  const clickTire = (index) => {
    if (index !== nextTire) return;
    const next = nextTire + 1;
    setNextTire(next);
    if (next === 4) onComplete("冬道の準備完了！");
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {[0, 1, 2, 3].map((index) => (
        <button
          key={index}
          onClick={() => clickTire(index)}
          className={`min-h-28 rounded-3xl border-4 p-3 text-4xl font-black shadow-lg ${
            index < nextTire
              ? "border-emerald-300 bg-emerald-100"
              : index === nextTire
                ? "border-orange-300 bg-orange-100"
                : "border-slate-200 bg-slate-100"
          }`}
        >
          <span className="mx-auto flex h-20 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white">
            <TireImage className="h-24 w-28" />
          </span>
          <span className="mt-2 block text-sm text-slate-700">{index + 1}番</span>
        </button>
      ))}
    </div>
  );
}

function KeroseneGame({ onComplete }) {
  const deliveryEvents = [
    { type: "go", icon: "🟢", label: "道路は安全", hint: "進む" },
    { type: "stop", icon: "❄️", label: "吹雪で前が見えない", hint: "待つ" },
    { type: "go", icon: "🚜", label: "除雪が終わった", hint: "進む" },
    { type: "stop", icon: "🚧", label: "道に雪の山", hint: "待つ" },
    { type: "go", icon: "🏠", label: "配達先が見えた", hint: "進む" }
  ];
  const [steps, setSteps] = useState(0);
  const [eventIndex, setEventIndex] = useState(0);
  const [safeChecks, setSafeChecks] = useState(0);
  const [note, setNote] = useState("道路の様子を見て、安全なら進もう！");
  const event = deliveryEvents[eventIndex % deliveryEvents.length];

  const nextEvent = () => {
    setEventIndex((value) => value + 1);
  };

  const chooseDeliveryAction = (action) => {
    const correct = action === event.hint;
    if (!correct) {
      setSafeChecks(0);
      setNote(action === "進む" ? "危ない！雪道では待つ判断も大切。" : "今なら進めそう。安全な道を進もう！");
      nextEvent();
      return;
    }

    if (action === "待つ") {
      const nextChecks = safeChecks + 1;
      setSafeChecks(nextChecks);
      setNote(nextChecks >= 2 ? "よく待てました。次は進めるはず！" : "安全第一！少し待って様子を見よう。");
      nextEvent();
      return;
    }

    const next = steps + 1;
    setSteps(next);
    setSafeChecks(0);
    setNote(next >= 5 ? "到着！" : "ローリーが配達先に近づいた！");
    nextEvent();
    if (next >= 5) onComplete("灯油をお届けしました！");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-amber-100 p-4">
        <div className="mb-3 rounded-2xl bg-white p-3 text-center shadow-sm">
          <p className="text-sm font-black text-amber-700">道路の様子</p>
          <div className="mt-1 flex items-center justify-center gap-3">
            <span className="text-4xl">{event.icon}</span>
            <span className="text-lg font-black text-slate-800">{event.label}</span>
          </div>
        </div>
        <div className="relative h-28 overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 to-white p-4 shadow-inner">
          <div className="absolute bottom-0 left-0 h-10 w-full bg-slate-500">
            <div className="mx-auto mt-4 h-1 w-3/4 rounded-full bg-yellow-200" />
          </div>
          <div className="absolute bottom-10 left-0 h-7 w-full bg-white" />
          <div
            className="absolute bottom-8 flex h-24 w-44 items-center justify-center rounded-2xl bg-white/80 transition-all duration-500"
            style={{ left: `${4 + Math.min(steps * 17, 82)}%` }}
          >
            <TankerLorryImage className="h-28 w-56" />
          </div>
          <div className="absolute bottom-9 right-4 text-5xl">🏠</div>
          <div className="absolute right-14 top-4 text-2xl">♨️</div>
        </div>
        <div className="mt-3 h-4 overflow-hidden rounded-full bg-white shadow-inner">
          <div className="h-full bg-orange-500 transition-all" style={{ width: `${Math.min(steps * 20, 100)}%` }} />
        </div>
        <p className="mt-3 min-h-7 text-center text-base font-black text-amber-700">{note}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => chooseDeliveryAction("進む")}
          className="rounded-2xl bg-orange-500 py-4 text-xl font-black text-white shadow-lg transition hover:bg-orange-600 active:scale-[.97]"
        >
          進む
        </button>
        <button
          onClick={() => chooseDeliveryAction("待つ")}
          className="rounded-2xl bg-blue-600 py-4 text-xl font-black text-white shadow-lg transition hover:bg-blue-700 active:scale-[.97]"
        >
          待つ
        </button>
      </div>
    </div>
  );
}

function EvGame({ onComplete }) {
  const [charge, setCharge] = useState(0);
  const [note, setNote] = useState("動くプラグが緑のゾーンに来たら押そう！");
  const [combo, setCombo] = useState(0);

  const chargeUp = () => {
    const marker = document.querySelector("#ev-charge-marker");
    const rail = marker?.parentElement;
    const percent = marker && rail ? parseFloat(getComputedStyle(marker).left) / rail.clientWidth : 0;
    const isBest = percent >= 0.43 && percent <= 0.63;
    const isNear = percent >= 0.32 && percent <= 0.74;
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
          <EvChargeIcon className="h-16 w-16" />
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
              className="absolute top-1 flex h-10 w-10 animate-gauge items-center justify-center rounded-full border-4 border-white bg-white shadow-lg"
            >
              <EvChargeIcon className="h-8 w-8" />
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

function InspectionGame({ onComplete }) {
  const [note, setNote] = useState("空いている日を選ぼう！");
  const dates = useMemo(
    () => [
      { label: "5/18", open: false },
      { label: "5/22", open: true },
      { label: "5/29", open: false }
    ],
    []
  );
  const chooseDate = (date) => {
    if (date.open) onComplete("車検予約を受け付けました！");
    else setNote("その日は予約でいっぱい。別の日を選んでね。");
  };
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {dates.map((date) => (
          <button
            key={date.label}
            onClick={() => chooseDate(date)}
            className="min-h-28 rounded-2xl border-4 border-blue-200 bg-white p-3 text-xl font-black text-blue-700 shadow"
          >
            <InspectionImage className="mx-auto mb-2 h-12 w-14" />
            {date.label}
          </button>
        ))}
      </div>
      <p className="text-center font-bold text-blue-700">{note}</p>
    </div>
  );
}

function InsuranceGame({ onComplete }) {
  const correctCards = ["事故の補償", "雪道トラブル", "ロードサービス"];
  const cards = [
    { label: "事故の補償", icon: "🚗", correct: true },
    { label: "雪道トラブル", icon: "❄️", correct: true },
    { label: "ロードサービス", icon: "🔧", correct: true },
    { label: "洗車チケット", icon: "🚿", correct: false },
    { label: "カフェ割引", icon: "☕", correct: false }
  ];
  const [selected, setSelected] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [note, setNote] = useState("車の保険に必要な安心カードを3つ選ぼう！");

  const chooseCard = (card) => {
    if (selected.includes(card.label)) return;
    if (!card.correct) {
      setMistakes((value) => value + 1);
      setNote("それは車の保険とは少し違うかも。運転の安心につながるカードを選ぼう。");
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
          事故、雪道、急なトラブルに備えたいお客さんです。
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
  return (
    <div className="rounded-3xl border-4 border-white bg-white/95 p-4 shadow-xl">
      <h2 className="mb-3 text-2xl font-black text-blue-700">スタンド成長</h2>
      <div className="grid gap-3">
        {upgrades.map((upgrade) => {
          const bought = boughtUpgrades.includes(upgrade.key);
          return (
            <button
              key={upgrade.key}
              onClick={() => onBuy(upgrade)}
              disabled={bought}
              className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left shadow-sm transition active:scale-[.99] ${
                bought
                  ? "border-emerald-200 bg-emerald-50"
                  : points >= upgrade.cost
                    ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                    : "border-slate-200 bg-slate-50"
              }`}
            >
              <span className={`flex shrink-0 items-center justify-center text-3xl ${upgrade.visual === "staff" ? "h-14 w-14 rounded-2xl bg-white" : "h-10 w-10"}`}>
                {upgrade.visual === "carWash" ? (
                  <CarWashImage className="h-10 w-10" />
                ) : upgrade.visual === "tankerTruck" ? (
                  <TankerLorryImage className="h-14 w-24" />
                ) : upgrade.visual === "evCharger" ? (
                  <EvChargeIcon className="h-10 w-10" />
                ) : upgrade.visual === "staff" ? (
                  <StaffImage className="h-14 w-12" />
                ) : (
                  upgrade.icon
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-black text-slate-800">{upgrade.name}</span>
                <span className="block text-sm font-bold text-slate-500">{upgrade.effect}</span>
              </span>
              <span className="shrink-0 rounded-full bg-white px-3 py-1 text-sm font-black text-orange-600">
                {bought ? "購入済" : `${upgrade.cost}pt`}
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

createRoot(document.getElementById("root")).render(<App />);
