import React, { useState, useEffect, useMemo } from "react";
import {
  Search, MessageCircle, ArrowRight, Star, MapPin, Phone, Menu, X,
  Home, LayoutGrid, Wand2, Calculator, Image as ImageIcon, User,
  Heart, FileText, Package, Calendar, Bell, TrendingUp, Users,
  ShoppingBag, ClipboardList, Boxes, Download, Share2, Save,
  Upload, ChevronRight, ChevronLeft, Check, Ruler, Sparkles,
  BadgeCheck, Layers, PanelsTopLeft, Grid3X3, Blinds, Scissors,
  Trees, Square, ChefHat, DoorOpen, Building2, Film, Sofa, Baby,
  Briefcase, Hotel, UtensilsCrossed, Coffee, SprayCan, IndianRupee,
  Plus, Minus, Eye, Shield
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

/* ————— DESIGN TOKENS ————— */
const T = {
  ink: "#17161B",        // charcoal
  ink2: "#26242C",
  paper: "#FAF9F6",      // warm white
  card: "#FFFFFF",
  gold: "#C6A15B",
  goldDeep: "#9C7A3C",
  goldSoft: "#F3EAD8",
  line: "#E9E4DA",
  mute: "#6E6A63",
};

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Manrope:wght@400;500;600;700;800&display=swap');
* { -webkit-tap-highlight-color: transparent; }
body { margin:0; }
.wd { font-family:'Manrope',sans-serif; color:${T.ink}; background:${T.paper}; }
.disp { font-family:'Fraunces',serif; letter-spacing:-0.01em; }
.gold-rule { height:1px; background:linear-gradient(90deg,${T.gold},transparent); }
.hover-lift { transition:transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
.hover-lift:hover { transform:translateY(-4px); box-shadow:0 20px 40px -18px rgba(23,22,27,.25); }
.glass { background:rgba(255,255,255,.72); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
.glass-dark { background:rgba(23,22,27,.6); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); }
@keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
.skeleton { background:linear-gradient(90deg,#efece5 25%,#f7f5ef 50%,#efece5 75%); background-size:800px 100%; animation:shimmer 1.4s infinite linear; }
@keyframes fadeUp { from{opacity:0; transform:translateY(14px)} to{opacity:1; transform:translateY(0)} }
.fade-up { animation:fadeUp .55s cubic-bezier(.2,.8,.2,1) both; }
@keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
.floaty { animation:floaty 3.2s ease-in-out infinite; }
.no-scrollbar::-webkit-scrollbar{ display:none } .no-scrollbar{ scrollbar-width:none }
@media (prefers-reduced-motion: reduce){ .fade-up,.floaty,.skeleton{animation:none} .hover-lift,.hover-lift:hover{transition:none;transform:none} }
button:focus-visible, a:focus-visible, input:focus-visible, [tabindex]:focus-visible { outline:2px solid ${T.gold}; outline-offset:2px; }
`;

/* material textures — CSS-only, the visual signature of the system */
const TEX = {
  marble: { background: `radial-gradient(ellipse at 30% 20%, #fff 0%, #ece8e0 40%, #d9d2c4 100%)`, backgroundColor:"#e8e3d8" },
  wood: { backgroundImage: `repeating-linear-gradient(95deg,#8a6743 0 14px,#96734d 14px 26px,#7d5c3a 26px 42px)` },
  fluted: { backgroundImage: `repeating-linear-gradient(90deg,#3a3630 0 10px,#4d483f 10px 14px,#2e2b26 14px 24px)` },
  wallpaper: { backgroundImage: `radial-gradient(circle at 20% 30%, ${T.goldSoft} 0 8%, transparent 8%), radial-gradient(circle at 70% 60%, #e6d9be 0 10%, transparent 10%), linear-gradient(160deg,#f4efe4,#e8dfcc)` },
  mural: { backgroundImage: `linear-gradient(120deg,#2f4a43,#5c7f6d 45%,#c9b98a)` },
  pvc: { backgroundImage: `repeating-linear-gradient(0deg,#f2f0ea 0 26px,#e4e0d6 26px 28px)` },
  wpc: { backgroundImage: `repeating-linear-gradient(90deg,#6b5136 0 18px,#7c5f40 18px 22px,#5d4530 22px 40px)` },
  spc: { backgroundImage: `repeating-linear-gradient(45deg,#c9c2b2 0 22px,#bdb5a3 22px 44px)` },
  vinyl: { backgroundImage: `linear-gradient(135deg,#d9d4c8,#c4beae)` },
  blinds: { backgroundImage: `repeating-linear-gradient(0deg,#efe9dc 0 16px,#d8d0bf 16px 20px)` },
  curtains: { backgroundImage: `repeating-linear-gradient(90deg,#8a795f 0 20px,#a3906f 20px 40px)` },
  glass: { backgroundImage: `linear-gradient(120deg,rgba(198,161,91,.25),rgba(255,255,255,.7) 50%,rgba(198,161,91,.18))`, backgroundColor:"#eef0ee" },
  grass: { backgroundImage: `repeating-linear-gradient(80deg,#3f6b3a 0 6px,#4e7d46 6px 12px,#37602f 12px 18px)` },
  ceiling: { backgroundImage: `radial-gradient(circle at 50% 40%, #fff 0 18%, #efece4 18% 60%, #e2ddd0 60%)` },
  kitchen: { backgroundImage: `linear-gradient(180deg,#23303a 0 55%, #b9a274 55% 60%, #ece7db 60%)` },
  wardrobe: { backgroundImage: `repeating-linear-gradient(90deg,#41372c 0 34px,#57493a 34px 36px)` },
  acp: { backgroundImage: `repeating-linear-gradient(0deg,#5b6670 0 30px,#49525a 30px 60px)` },
};

const CATEGORIES = [
  { name:"Wallpapers", icon:Layers, tex:TEX.wallpaper, count:240 },
  { name:"Customized Wall Murals", icon:ImageIcon, tex:TEX.mural, count:64 },
  { name:"PVC Wall Panels", icon:PanelsTopLeft, tex:TEX.pvc, count:112 },
  { name:"WPC Panels", icon:Square, tex:TEX.wpc, count:86 },
  { name:"Fluted Panels", icon:Grid3X3, tex:TEX.fluted, count:58 },
  { name:"SPC Flooring", icon:Layers, tex:TEX.spc, count:74 },
  { name:"Vinyl Flooring", icon:Layers, tex:TEX.vinyl, count:52 },
  { name:"Wooden Flooring", icon:Trees, tex:TEX.wood, count:39 },
  { name:"Window Blinds", icon:Blinds, tex:TEX.blinds, count:95 },
  { name:"Curtains", icon:Scissors, tex:TEX.curtains, count:120 },
  { name:"Glass Films", icon:Film, tex:TEX.glass, count:44 },
  { name:"Artificial Grass", icon:Trees, tex:TEX.grass, count:27 },
  { name:"False Ceiling", icon:Square, tex:TEX.ceiling, count:33 },
  { name:"Modular Kitchen", icon:ChefHat, tex:TEX.kitchen, count:18 },
  { name:"Wardrobes", icon:DoorOpen, tex:TEX.wardrobe, count:22 },
  { name:"ACP / HPL Exterior", icon:Building2, tex:TEX.acp, count:31 },
];

const INR = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

/* ————— SHARED ————— */
const Btn = ({ children, dark, gold, ghost, sm, full, onClick, icon:Icon }) => (
  <button onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[.98] ${sm?"px-4 py-2 text-sm":"px-6 py-3.5 text-sm"} ${full?"w-full":""}`}
    style={{
      borderRadius:16,
      background: gold ? `linear-gradient(135deg,${T.gold},${T.goldDeep})` : dark ? T.ink : ghost ? "transparent" : "#fff",
      color: gold||dark ? "#fff" : T.ink,
      border: ghost ? `1px solid ${T.line}` : "1px solid transparent",
      boxShadow: gold ? "0 10px 24px -10px rgba(156,122,60,.55)" : dark ? "0 10px 24px -12px rgba(23,22,27,.5)" : "none",
    }}>
    {Icon && <Icon size={16} />}{children}
  </button>
);

const Eyebrow = ({ children }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="text-xs font-bold tracking-widest uppercase" style={{color:T.goldDeep}}>{children}</span>
    <span className="gold-rule flex-1 max-w-16" />
  </div>
);

const H2 = ({ children }) => <h2 className="disp text-2xl md:text-4xl font-medium mb-2">{children}</h2>;

const Chip = ({ children, active, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 text-sm font-semibold whitespace-nowrap transition-all"
    style={{ borderRadius:14, background: active?T.ink:"#fff", color:active?"#fff":T.mute, border:`1px solid ${active?T.ink:T.line}` }}>
    {children}
  </button>
);

const Section = ({ children, className="" }) => (
  <section className={`px-5 md:px-10 lg:px-16 py-10 md:py-16 max-w-7xl mx-auto ${className}`}>{children}</section>
);

const Texture = ({ tex, className="", style={}, children }) => (
  <div className={className} style={{...tex, ...style}}>{children}</div>
);

/* ————— NAV ————— */
const NAV = [
  { id:"home", label:"Home", icon:Home },
  { id:"categories", label:"Categories", icon:LayoutGrid },
  { id:"product", label:"Product", icon:Package },
  { id:"visualizer", label:"Visualizer", icon:Wand2 },
  { id:"calculator", label:"Calculator", icon:Calculator },
  { id:"gallery", label:"Gallery", icon:ImageIcon },
  { id:"account", label:"My Account", icon:User },
  { id:"admin", label:"Admin", icon:TrendingUp },
];

const TopNav = ({ screen, go }) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="glass sticky top-0 z-40" style={{borderBottom:`1px solid ${T.line}`}}>
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 h-16 flex items-center justify-between gap-4">
        <button onClick={()=>go("home")} className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center text-white font-bold"
            style={{borderRadius:12, background:`linear-gradient(135deg,${T.ink},${T.ink2})`, border:`1px solid ${T.gold}`}}>
            <span className="disp" style={{color:T.gold}}>W</span>
          </div>
          <div className="text-left leading-none">
            <div className="disp text-lg font-semibold">Walldecor<span style={{color:T.goldDeep}}>99</span></div>
            <div className="text-[10px] tracking-widest uppercase" style={{color:T.mute}}>Interior · Exterior · Agra</div>
          </div>
        </button>
        <nav className="hidden lg:flex items-center gap-1">
          {NAV.slice(0,6).map(n=>(
            <button key={n.id} onClick={()=>go(n.id)} className="px-3.5 py-2 text-sm font-semibold transition-colors"
              style={{borderRadius:12, color:screen===n.id?T.ink:T.mute, background:screen===n.id?T.goldSoft:"transparent"}}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          <Btn ghost sm onClick={()=>go("account")} icon={User}>Account</Btn>
          <Btn gold sm icon={Calendar}>Book Site Visit</Btn>
        </div>
        <button className="lg:hidden p-2" onClick={()=>setOpen(!open)} aria-label="Menu">{open?<X/>:<Menu/>}</button>
      </div>
      {open && (
        <div className="lg:hidden px-5 pb-4 grid grid-cols-2 gap-2 fade-up">
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>{go(n.id); setOpen(false);}} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold bg-white"
              style={{borderRadius:14, border:`1px solid ${screen===n.id?T.gold:T.line}`}}>
              <n.icon size={16} color={T.goldDeep}/>{n.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

const MobileTabs = ({ screen, go }) => (
  <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass" style={{borderTop:`1px solid ${T.line}`}}>
    <div className="grid grid-cols-5">
      {[NAV[0],NAV[1],NAV[3],NAV[4],NAV[6]].map(n=>(
        <button key={n.id} onClick={()=>go(n.id)} className="flex flex-col items-center gap-1 py-2.5">
          <n.icon size={20} color={screen===n.id?T.goldDeep:T.mute}/>
          <span className="text-[10px] font-bold" style={{color:screen===n.id?T.ink:T.mute}}>{n.label.split(" ")[0]}</span>
        </button>
      ))}
    </div>
  </nav>
);

const WhatsAppFab = () => (
  <a href="#" className="fixed z-40 right-4 bottom-20 lg:bottom-8 floaty flex items-center gap-2 px-4 py-3.5 text-white font-bold text-sm"
    style={{borderRadius:20, background:"#1FA855", boxShadow:"0 16px 32px -12px rgba(31,168,85,.6)"}}>
    <MessageCircle size={20} fill="white" /> <span className="hidden sm:inline">WhatsApp Us</span>
  </a>
);

/* ————— HOME ————— */
const PRODUCTS = [
  { name:"Botanica Gold Wallpaper", cat:"Wallpapers", price:1850, unit:"roll", rating:4.9, tex:TEX.wallpaper },
  { name:"Walnut Fluted Panel", cat:"Fluted Panels", price:340, unit:"sq.ft", rating:4.8, tex:TEX.fluted },
  { name:"Oakline SPC Plank", cat:"SPC Flooring", price:145, unit:"sq.ft", rating:4.7, tex:TEX.spc },
  { name:"Teak Louver WPC", cat:"WPC Panels", price:290, unit:"sq.ft", rating:4.9, tex:TEX.wpc },
];

const ProductCard = ({ p, go }) => (
  <button onClick={()=>go("product")} className="hover-lift text-left bg-white overflow-hidden group" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
    <Texture tex={p.tex} className="h-40 md:h-48 relative">
      <span className="absolute top-3 left-3 glass px-2.5 py-1 text-[11px] font-bold" style={{borderRadius:10}}>{p.cat}</span>
      <span className="absolute top-3 right-3 glass px-2 py-1 text-[11px] font-bold flex items-center gap-1" style={{borderRadius:10}}>
        <Star size={11} fill={T.goldDeep} color={T.goldDeep}/>{p.rating}
      </span>
    </Texture>
    <div className="p-4">
      <div className="font-bold text-sm mb-1">{p.name}</div>
      <div className="flex items-end justify-between">
        <div><span className="disp text-lg font-semibold">{INR(p.price)}</span><span className="text-xs" style={{color:T.mute}}> / {p.unit}</span></div>
        <span className="w-8 h-8 flex items-center justify-center transition-colors group-hover:text-white"
          style={{borderRadius:12, border:`1px solid ${T.line}`}}>
          <ArrowRight size={14}/>
        </span>
      </div>
    </div>
  </button>
);

const BeforeAfter = ({ h=280 }) => {
  const [v, setV] = useState(50);
  return (
    <div className="relative overflow-hidden select-none" style={{borderRadius:24, height:h, border:`1px solid ${T.line}`}}>
      {/* after */}
      <div className="absolute inset-0" style={{background:"linear-gradient(180deg,#efe9dc 0 62%, #c9b48b 62% 64%, transparent 64%)"}}>
        <Texture tex={TEX.fluted} className="absolute" style={{left:"8%", right:"8%", top:"10%", height:"52%", borderRadius:12}}/>
        <Texture tex={TEX.wood} className="absolute inset-x-0 bottom-0" style={{height:"36%"}}/>
        <div className="absolute glass px-3 py-1.5 text-xs font-bold bottom-3 right-3" style={{borderRadius:10}}>After</div>
      </div>
      {/* before */}
      <div className="absolute inset-0" style={{clipPath:`inset(0 ${100-v}% 0 0)`}}>
        <div className="absolute inset-0" style={{background:"linear-gradient(180deg,#dcd8cf 0 64%, #b9b4a8 64%)"}}/>
        <div className="absolute glass px-3 py-1.5 text-xs font-bold bottom-3 left-3" style={{borderRadius:10}}>Before</div>
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{left:`${v}%`, boxShadow:"0 0 0 1px rgba(0,0,0,.08)"}}>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-white flex items-center justify-center"
          style={{borderRadius:14, boxShadow:"0 8px 20px rgba(0,0,0,.25)"}}>
          <ChevronLeft size={12}/><ChevronRight size={12}/>
        </div>
      </div>
      <input aria-label="Compare before and after" type="range" min="2" max="98" value={v} onChange={e=>setV(+e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"/>
    </div>
  );
};

const HomeScreen = ({ go }) => (
  <div className="fade-up">
    {/* HERO */}
    <div className="relative overflow-hidden" style={{background:T.ink}}>
      <Texture tex={TEX.fluted} className="absolute inset-y-0 right-0 w-1/3 opacity-30 hidden md:block"/>
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20" style={{background:`radial-gradient(circle,${T.gold},transparent 70%)`}}/>
      <Section className="relative text-white">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 glass-dark px-3.5 py-1.5 mb-6 text-xs font-bold" style={{borderRadius:12, border:"1px solid rgba(198,161,91,.4)"}}>
            <BadgeCheck size={14} color={T.gold}/> Trusted by 2,000+ homes in Agra
          </div>
          <h1 className="disp text-4xl md:text-6xl font-medium leading-tight mb-5">
            Walls that speak.<br/><span style={{color:T.gold}}>Spaces that stay with you.</span>
          </h1>
          <p className="text-white/70 mb-8 md:text-lg">Wallpapers, panels, flooring & complete interiors — designed, delivered and installed by Walldecor99.</p>
          {/* Search */}
          <div className="glass flex items-center gap-3 p-2 pl-4 mb-6" style={{borderRadius:18}}>
            <Search size={18} color={T.mute}/>
            <input placeholder="Search wallpapers, panels, flooring…" className="flex-1 bg-transparent text-sm py-2 outline-none" style={{color:T.ink}}/>
            <Btn dark sm>Search</Btn>
          </div>
          <div className="flex flex-wrap gap-3">
            <Btn gold icon={Calendar}>Book Free Site Visit</Btn>
            <button onClick={()=>go("visualizer")} className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white"
              style={{borderRadius:16, border:"1px solid rgba(255,255,255,.25)"}}>
              <Wand2 size={16} color={T.gold}/> Try AI Visualizer
            </button>
          </div>
        </div>
      </Section>
    </div>

    {/* CATEGORIES STRIP */}
    <Section>
      <Eyebrow>Browse</Eyebrow>
      <div className="flex items-end justify-between mb-6">
        <H2>Shop by category</H2>
        <button onClick={()=>go("categories")} className="text-sm font-bold flex items-center gap-1" style={{color:T.goldDeep}}>View all <ArrowRight size={14}/></button>
      </div>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5">
        {CATEGORIES.slice(0,8).map(c=>(
          <button key={c.name} onClick={()=>go("categories")} className="hover-lift shrink-0 w-36 text-left bg-white overflow-hidden" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
            <Texture tex={c.tex} className="h-24"/>
            <div className="p-3">
              <c.icon size={16} color={T.goldDeep}/>
              <div className="text-xs font-bold mt-1.5 leading-snug">{c.name}</div>
            </div>
          </button>
        ))}
      </div>
    </Section>

    {/* FEATURED + BESTSELLERS */}
    <Section className="pt-0">
      <Eyebrow>Curated</Eyebrow>
      <H2>Featured collections</H2>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {[["The Fluted Edit","Ribbed warmth for feature walls",TEX.fluted],["Botanical Luxe","Hand-drawn murals in gold & sage",TEX.mural],["Quiet Floors","SPC & wood tones that ground a room",TEX.wood]].map(([t,d,tex],i)=>(
          <Texture key={i} tex={tex} className="hover-lift relative h-52 overflow-hidden flex items-end" style={{borderRadius:24}}>
            <div className="glass m-3 p-4 w-full" style={{borderRadius:16}}>
              <div className="font-bold">{t}</div>
              <div className="text-xs" style={{color:T.mute}}>{d}</div>
            </div>
          </Texture>
        ))}
      </div>
    </Section>

    <Section className="pt-0">
      <Eyebrow>Popular</Eyebrow>
      <H2>Best sellers</H2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {PRODUCTS.map(p=><ProductCard key={p.name} p={p} go={go}/>)}
      </div>
    </Section>

    {/* BEFORE / AFTER */}
    <Section className="pt-0">
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <Eyebrow>Transformation</Eyebrow>
          <H2>Before & after, in one drag</H2>
          <p className="text-sm md:text-base mb-6" style={{color:T.mute}}>A plain living room in Kamla Nagar became a fluted-panel feature wall with warm wooden flooring — completed in 3 days.</p>
          <Btn dark onClick={()=>go("visualizer")} icon={Wand2}>Visualize your room</Btn>
        </div>
        <BeforeAfter/>
      </div>
    </Section>

    {/* TESTIMONIALS */}
    <div style={{background:T.ink}} className="text-white">
      <Section>
        <Eyebrow>Word of mouth</Eyebrow>
        <H2>What Agra says about us</H2>
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[["Ritu Sharma","Dayalbagh","The mural in our bedroom looks like art. Installation was spotless — done in one afternoon."],["Amit Bansal","Kamla Nagar","Fluted panels + SPC flooring for our clinic. Premium finish, honest pricing, on time."],["Neha & Karan","Sikandra","Used the visualizer to pick wallpaper before buying. Exactly what we saw is what we got."]].map(([n,l,q],i)=>(
            <div key={i} className="p-6" style={{borderRadius:22, background:T.ink2, border:"1px solid rgba(198,161,91,.25)"}}>
              <div className="flex gap-0.5 mb-3">{[...Array(5)].map((_,j)=><Star key={j} size={13} fill={T.gold} color={T.gold}/>)}</div>
              <p className="text-sm text-white/80 mb-4">“{q}”</p>
              <div className="text-sm font-bold">{n}</div>
              <div className="text-xs text-white/50 flex items-center gap-1"><MapPin size={11}/>{l}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>

    {/* LATEST PROJECTS + CTA */}
    <Section>
      <Eyebrow>Recent work</Eyebrow>
      <H2>Latest projects</H2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[["Hotel lobby, Fatehabad Rd",TEX.mural],["3BHK interiors, Sastripuram",TEX.fluted],["Café feature wall",TEX.wallpaper],["Office flooring, Sanjay Place",TEX.spc]].map(([t,tex],i)=>(
          <Texture key={i} tex={tex} className="hover-lift relative h-40 md:h-48 overflow-hidden flex items-end" style={{borderRadius:20}}>
            <div className="glass m-2.5 px-3 py-2 text-xs font-bold w-full" style={{borderRadius:12}}>{t}</div>
          </Texture>
        ))}
      </div>
      <div className="mt-10 relative overflow-hidden p-8 md:p-12 text-white" style={{borderRadius:28, background:`linear-gradient(135deg,${T.ink},${T.ink2})`, border:`1px solid ${T.gold}`}}>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full opacity-20" style={{background:`radial-gradient(circle,${T.gold},transparent 70%)`}}/>
        <div className="max-w-lg relative">
          <h3 className="disp text-2xl md:text-3xl font-medium mb-2">Free site visit & measurement</h3>
          <p className="text-white/70 text-sm mb-6">Our team visits your home or shop anywhere in Agra, measures every wall, and gives you a same-day quotation. No charges, no obligation.</p>
          <div className="flex flex-wrap gap-3">
            <Btn gold icon={Calendar}>Book Free Visit</Btn>
            <Btn ghost icon={Phone}><span className="text-white">Call +91 99XX XXX 99</span></Btn>
          </div>
        </div>
      </div>
    </Section>
  </div>
);

/* ————— CATEGORIES ————— */
const CategoriesScreen = ({ go }) => (
  <Section className="fade-up">
    <Eyebrow>Catalogue</Eyebrow>
    <H2>All categories</H2>
    <p className="text-sm mb-8" style={{color:T.mute}}>16 solutions for every surface — interior and exterior.</p>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {CATEGORIES.map(c=>(
        <button key={c.name} onClick={()=>go("product")} className="hover-lift text-left bg-white overflow-hidden group" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
          <Texture tex={c.tex} className="h-28 md:h-36 relative">
            <span className="absolute top-3 right-3 w-9 h-9 glass flex items-center justify-center" style={{borderRadius:12}}>
              <c.icon size={16} color={T.goldDeep}/>
            </span>
          </Texture>
          <div className="p-4 flex items-center justify-between gap-2">
            <div>
              <div className="font-bold text-sm leading-snug">{c.name}</div>
              <div className="text-xs" style={{color:T.mute}}>{c.count} designs</div>
            </div>
            <ArrowRight size={15} className="shrink-0 transition-transform group-hover:translate-x-1" color={T.goldDeep}/>
          </div>
        </button>
      ))}
    </div>
  </Section>
);

/* ————— PRODUCT DETAIL ————— */
const ProductScreen = ({ go }) => {
  const [img, setImg] = useState(0);
  const [color, setColor] = useState(1);
  const [size, setSize] = useState(0);
  const gallery = [TEX.fluted, TEX.wpc, TEX.wood, TEX.mural];
  const colors = [["Espresso","#3a3026"],["Walnut","#6b5136"],["Natural Oak","#a5875f"],["Charcoal","#26242C"]];
  const sizes = ["8 ft × 6 in","10 ft × 6 in","Custom cut"];
  return (
    <Section className="fade-up">
      <div className="text-xs font-semibold mb-5 flex items-center gap-1.5" style={{color:T.mute}}>
        <button onClick={()=>go("home")}>Home</button><ChevronRight size={12}/>
        <button onClick={()=>go("categories")}>Fluted Panels</button><ChevronRight size={12}/>
        <span style={{color:T.ink}}>Walnut Fluted Panel</span>
      </div>
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* gallery */}
        <div>
          <Texture tex={gallery[img]} className="h-72 md:h-[430px] relative overflow-hidden" style={{borderRadius:26, border:`1px solid ${T.line}`}}>
            <span className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-white" style={{borderRadius:10, background:T.ink}}>Best seller</span>
          </Texture>
          <div className="flex gap-3 mt-3">
            {gallery.map((g,i)=>(
              <button key={i} onClick={()=>setImg(i)} aria-label={`Image ${i+1}`}>
                <Texture tex={g} className="w-16 h-16 md:w-20 md:h-20" style={{borderRadius:16, border:`2px solid ${img===i?T.gold:T.line}`}}/>
              </button>
            ))}
          </div>
        </div>
        {/* info */}
        <div>
          <Eyebrow>Fluted Panels</Eyebrow>
          <h1 className="disp text-3xl md:text-4xl font-medium mb-2">Walnut Fluted Panel</h1>
          <div className="flex items-center gap-3 mb-4 text-sm">
            <span className="flex items-center gap-1 font-bold"><Star size={14} fill={T.goldDeep} color={T.goldDeep}/>4.8</span>
            <span style={{color:T.mute}}>126 reviews</span>
            <span className="flex items-center gap-1 font-bold" style={{color:"#1FA855"}}><Check size={14}/>In stock</span>
          </div>
          <div className="mb-6"><span className="disp text-3xl font-semibold">₹340</span><span className="text-sm" style={{color:T.mute}}> / sq.ft · installed</span></div>

          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:T.mute}}>Finish</div>
          <div className="flex gap-2.5 mb-5">
            {colors.map(([n,c],i)=>(
              <button key={n} onClick={()=>setColor(i)} title={n} aria-label={n}
                className="w-10 h-10 transition-transform active:scale-95"
                style={{borderRadius:14, background:c, border:`2px solid ${color===i?T.gold:"transparent"}`, boxShadow:color===i?`0 0 0 2px #fff inset`:"none"}}/>
            ))}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:T.mute}}>Material</div>
          <div className="flex gap-2 mb-5 flex-wrap">
            {["WPC core","Charcoal core","Solid wood veneer"].map((m,i)=><Chip key={m} active={i===0}>{m}</Chip>)}
          </div>

          <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:T.mute}}>Size</div>
          <div className="flex gap-2 mb-7 flex-wrap">
            {sizes.map((s,i)=><Chip key={s} active={size===i} onClick={()=>setSize(i)}>{s}</Chip>)}
          </div>

          <div className="flex gap-3 mb-8">
            <Btn gold full icon={FileText}>Request quotation</Btn>
            <button aria-label="Save to wishlist" className="w-12 h-12 shrink-0 flex items-center justify-center bg-white" style={{borderRadius:16, border:`1px solid ${T.line}`}}><Heart size={18}/></button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[["Specifications","2900×160×24 mm · fire-retardant"],["Features","Termite-proof · zero maintenance"],["Installation","On-frame or direct paste · 1 day"],["Warranty","7-year manufacturer warranty"]].map(([t,d])=>(
              <div key={t} className="p-4 bg-white" style={{borderRadius:18, border:`1px solid ${T.line}`}}>
                <div className="font-bold text-xs mb-1 flex items-center gap-1.5"><Shield size={13} color={T.goldDeep}/>{t}</div>
                <div className="text-xs" style={{color:T.mute}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* reviews + related */}
      <div className="mt-12 grid lg:grid-cols-2 gap-8">
        <div>
          <H2>Customer reviews</H2>
          <div className="space-y-3 mt-4">
            {[["Pooja V.","Perfect match with our TV unit. Installer was careful with edges."],["Rahul S.","Looks far more expensive than it costs. Very happy."]].map(([n,q])=>(
              <div key={n} className="p-4 bg-white" style={{borderRadius:18, border:`1px solid ${T.line}`}}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm">{n}</span>
                  <span className="flex gap-0.5">{[...Array(5)].map((_,j)=><Star key={j} size={11} fill={T.goldDeep} color={T.goldDeep}/>)}</span>
                </div>
                <p className="text-sm" style={{color:T.mute}}>{q}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <H2>You may also like</H2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {PRODUCTS.slice(0,2).map(p=><ProductCard key={p.name} p={p} go={go}/>)}
          </div>
        </div>
      </div>

      {/* sticky enquiry bar */}
      <div className="fixed bottom-16 lg:bottom-6 inset-x-4 lg:inset-x-auto lg:right-24 z-30 glass p-3 flex items-center gap-3 lg:w-96"
        style={{borderRadius:20, border:`1px solid ${T.line}`, boxShadow:"0 20px 40px -16px rgba(23,22,27,.3)"}}>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate">Walnut Fluted Panel</div>
          <div className="text-xs" style={{color:T.mute}}>₹340 / sq.ft</div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 text-white text-xs font-bold" style={{borderRadius:14, background:"#1FA855"}}>
          <MessageCircle size={14}/> Enquire
        </button>
      </div>
    </Section>
  );
};

/* ————— AI ROOM VISUALIZER ————— */
const WALL_OPTIONS = [
  { name:"Botanica Gold", type:"Wallpaper", tex:TEX.wallpaper },
  { name:"Sage Mural", type:"Wall Mural", tex:TEX.mural },
  { name:"Charcoal Fluted", type:"Fluted Panel", tex:TEX.fluted },
  { name:"Teak WPC", type:"WPC Panel", tex:TEX.wpc },
  { name:"Classic PVC", type:"PVC Panel", tex:TEX.pvc },
];
const FLOOR_OPTIONS = [
  { name:"Oakline SPC", tex:TEX.spc },
  { name:"Walnut Wood", tex:TEX.wood },
  { name:"Stone Vinyl", tex:TEX.vinyl },
];

const VisualizerScreen = () => {
  const [wall, setWall] = useState(2);
  const [floor, setFloor] = useState(1);
  const [blindsOn, setBlindsOn] = useState(true);
  const [filmOn, setFilmOn] = useState(false);
  const [v, setV] = useState(55);
  const [saved, setSaved] = useState(false);

  const Room = ({ styled }) => (
    <div className="absolute inset-0" style={{background:"linear-gradient(180deg,#e6e2d9 0 62%, #cfc9bb 62%)"}}>
      {/* feature wall */}
      {styled
        ? <Texture tex={WALL_OPTIONS[wall].tex} className="absolute" style={{left:"6%", right:"38%", top:"8%", height:"54%", borderRadius:10, boxShadow:"0 10px 24px -12px rgba(0,0,0,.35)"}}/>
        : <div className="absolute" style={{left:"6%", right:"38%", top:"8%", height:"54%", borderRadius:10, background:"#d8d4ca"}}/>}
      {/* window */}
      <div className="absolute overflow-hidden" style={{right:"8%", top:"12%", width:"22%", height:"38%", borderRadius:8, background: filmOn && styled ? "linear-gradient(160deg,rgba(198,161,91,.5),rgba(255,255,255,.85))" : "linear-gradient(160deg,#bcd3e0,#e8f1f6)", border:"6px solid #fff"}}>
        {styled && blindsOn && <Texture tex={TEX.blinds} className="absolute inset-0 opacity-90"/>}
      </div>
      {/* floor */}
      {styled
        ? <Texture tex={FLOOR_OPTIONS[floor].tex} className="absolute inset-x-0 bottom-0" style={{height:"38%"}}/>
        : <div className="absolute inset-x-0 bottom-0" style={{height:"38%", background:"#b6b0a2"}}/>}
      {/* sofa silhouette */}
      <div className="absolute" style={{left:"14%", bottom:"20%", width:"32%", height:"16%", borderRadius:14, background:styled?"#4a4038":"#8f887c", boxShadow:"0 14px 20px -10px rgba(0,0,0,.4)"}}/>
    </div>
  );

  return (
    <Section className="fade-up">
      <Eyebrow>AI Studio</Eyebrow>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <H2>Room visualizer</H2>
          <p className="text-sm" style={{color:T.mute}}>Upload a photo, tap a wall, and try any finish before you buy.</p>
        </div>
        <div className="flex gap-2">
          <Btn ghost sm icon={Save} onClick={()=>setSaved(true)}>{saved?"Saved ✓":"Save design"}</Btn>
          <Btn ghost sm icon={Download}>Download</Btn>
          <Btn dark sm icon={Share2}>Share</Btn>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* canvas */}
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden select-none" style={{borderRadius:26, height:"min(60vw,440px)", border:`1px solid ${T.line}`}}>
            <Room styled/>
            <div className="absolute inset-0" style={{clipPath:`inset(0 ${100-v}% 0 0)`}}><Room/></div>
            <div className="absolute top-0 bottom-0 w-0.5 bg-white" style={{left:`${v}%`}}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white flex items-center justify-center" style={{borderRadius:16, boxShadow:"0 10px 24px rgba(0,0,0,.3)"}}>
                <ChevronLeft size={13}/><ChevronRight size={13}/>
              </div>
            </div>
            <input aria-label="Compare" type="range" min="2" max="98" value={v} onChange={e=>setV(+e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"/>
            <div className="absolute glass px-3 py-1.5 text-xs font-bold top-3 left-3" style={{borderRadius:10}}>Before</div>
            <div className="absolute glass px-3 py-1.5 text-xs font-bold top-3 right-3" style={{borderRadius:10}}>After</div>
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 py-6 text-sm font-bold bg-white transition-colors hover:bg-stone-50"
            style={{borderRadius:20, border:`2px dashed ${T.line}`, color:T.mute}}>
            <Upload size={16} color={T.goldDeep}/> Upload your room photo (JPG / PNG)
          </button>
        </div>

        {/* controls */}
        <div className="space-y-5">
          <div className="p-5 bg-white" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles size={13} color={T.goldDeep}/>Feature wall</div>
            <div className="grid grid-cols-5 gap-2">
              {WALL_OPTIONS.map((w,i)=>(
                <button key={w.name} onClick={()=>setWall(i)} title={w.name} aria-label={w.name}>
                  <Texture tex={w.tex} className="h-12 w-full" style={{borderRadius:12, border:`2px solid ${wall===i?T.gold:T.line}`}}/>
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs font-semibold">{WALL_OPTIONS[wall].name} <span style={{color:T.mute}}>· {WALL_OPTIONS[wall].type}</span></div>
          </div>

          <div className="p-5 bg-white" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
            <div className="text-xs font-bold uppercase tracking-wider mb-3">Flooring</div>
            <div className="grid grid-cols-3 gap-2">
              {FLOOR_OPTIONS.map((f,i)=>(
                <button key={f.name} onClick={()=>setFloor(i)} aria-label={f.name}>
                  <Texture tex={f.tex} className="h-12 w-full" style={{borderRadius:12, border:`2px solid ${floor===i?T.gold:T.line}`}}/>
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs font-semibold">{FLOOR_OPTIONS[floor].name}</div>
          </div>

          {[["Window blinds",blindsOn,setBlindsOn],["Glass film",filmOn,setFilmOn]].map(([label,val,set])=>(
            <button key={label} onClick={()=>set(!val)} className="w-full p-4 bg-white flex items-center justify-between" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
              <span className="text-sm font-bold">{label}</span>
              <span className="w-11 h-6 relative transition-colors" style={{borderRadius:99, background:val?T.gold:T.line}}>
                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all" style={{left:val?"22px":"2px", boxShadow:"0 2px 6px rgba(0,0,0,.2)"}}/>
              </span>
            </button>
          ))}

          <div className="p-4 flex items-center gap-3" style={{borderRadius:20, background:T.goldSoft, border:`1px solid ${T.gold}`}}>
            <Eye size={16} color={T.goldDeep}/>
            <p className="text-xs font-semibold" style={{color:T.goldDeep}}>Like this look? Send it on WhatsApp and get a quotation for these exact materials.</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

/* ————— COST CALCULATOR ————— */
const CALCS = [
  { name:"Wallpaper", unit:"roll (57 sq.ft)", rate:1850, labour:6, perRoll:true },
  { name:"Wall Panels", unit:"sq.ft", rate:340, labour:40, panel:true, lengths:[8,10,12] },
  { name:"Flooring", unit:"sq.ft", rate:145, labour:25 },
  { name:"Glass Film", unit:"sq.ft", rate:85, labour:15 },
  { name:"Blinds", unit:"sq.ft", rate:120, labour:10 },
  { name:"Curtains", unit:"sq.ft", rate:160, labour:12 },
  { name:"Modular Kitchen", unit:"sq.ft", rate:1450, labour:180 },
  { name:"Wardrobe", unit:"sq.ft", rate:1150, labour:150 },
];

const NumInput = ({ label, value, set, suffix }) => (
  <div className="flex-1 min-w-0">
    <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{color:T.mute}}>{label}</label>
    <div className="flex items-center bg-white" style={{borderRadius:16, border:`1px solid ${T.line}`}}>
      <button aria-label="Decrease" className="px-3 py-3" onClick={()=>set(Math.max(1, value-1))}><Minus size={14}/></button>
      <input type="number" value={value} onChange={e=>set(Math.max(0,+e.target.value||0))} className="w-full text-center font-bold bg-transparent outline-none py-3 text-sm"/>
      <button aria-label="Increase" className="px-3 py-3" onClick={()=>set(value+1)}><Plus size={14}/></button>
    </div>
    <div className="text-[10px] mt-1" style={{color:T.mute}}>{suffix}</div>
  </div>
);

/* live wall diagram — panels drawn to scale on the wall */
const WallPreview = ({ w, h, pwIn, pl, across, rows, panels, cutIn }) => {
  const stripPct = (pwIn / (w*12)) * 100; // one panel width as % of wall
  return (
    <div className="mt-4">
      <div className="flex items-stretch gap-2">
        {/* height label */}
        <div className="flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold" style={{color:T.mute, writingMode:"vertical-rl", transform:"rotate(180deg)"}}>{h} ft</span>
        </div>
        {/* wall */}
        <div className="relative flex-1 overflow-hidden" style={{aspectRatio:`${w}/${h}`, maxHeight:280, borderRadius:14, border:`2px solid ${T.ink}`, background:"#efece4"}}>
          <div className="absolute inset-0 flex">
            {[...Array(across)].map((_,i)=>{
              const isLast = i===across-1 && cutIn>0;
              return (
                <div key={i} className="relative h-full shrink-0 transition-all"
                  style={{width:`${stripPct}%`, background:i%2? "#7c5f40":"#6b5136", borderRight:"1px solid rgba(255,255,255,.28)"}}>
                  {isLast && <div className="absolute inset-0" style={{background:"repeating-linear-gradient(45deg, rgba(198,161,91,.55) 0 6px, transparent 6px 12px)"}} title="Cut panel"/>}
                </div>
              );
            })}
          </div>
          {/* horizontal joints when wall is taller than panel */}
          {rows>1 && [...Array(rows-1)].map((_,r)=>(
            <div key={r} className="absolute inset-x-0" style={{top:`${((r+1)*pl/h)*100}%`, borderTop:`2px dashed ${T.gold}`}}/>
          ))}
          <span className="absolute top-2 right-2 glass px-2.5 py-1 text-[11px] font-extrabold" style={{borderRadius:9}}>{panels} panels</span>
          {cutIn>0 && <span className="absolute bottom-2 right-2 glass px-2.5 py-1 text-[10px] font-bold" style={{borderRadius:9, color:T.goldDeep}}>last panel cut to {(pwIn-cutIn).toFixed(1)}"</span>}
        </div>
      </div>
      {/* width label */}
      <div className="text-center text-[10px] font-bold mt-1.5" style={{color:T.mute}}>← {w} ft →</div>
      <div className="flex items-center gap-4 mt-1 text-[10px] font-semibold" style={{color:T.mute}}>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block" style={{borderRadius:4, background:"#6b5136"}}/>Full panel</span>
        {cutIn>0 && <span className="flex items-center gap-1.5"><span className="w-3 h-3 inline-block" style={{borderRadius:4, background:"repeating-linear-gradient(45deg, rgba(198,161,91,.8) 0 3px, #6b5136 3px 6px)"}}/>Cut panel</span>}
        {rows>1 && <span className="flex items-center gap-1.5"><span className="w-4 inline-block" style={{borderTop:`2px dashed ${T.gold}`}}/>Joint line</span>}
      </div>
    </div>
  );
};

const CalculatorScreen = () => {
  const [tab, setTab] = useState(1);
  const [w, setW] = useState(10);
  const [h, setH] = useState(10);
  const [pwIn, setPwIn] = useState(6);   // panel width in inches (6–12)
  const [plIdx, setPlIdx] = useState(0); // panel length option
  const c = CALCS[tab];
  const area = w*h;
  // panel math: panels run floor-to-ceiling; join rows if wall is taller than panel length
  const pl = c.panel ? c.lengths[plIdx] : 0;
  const across = c.panel ? Math.ceil((w*12)/pwIn) : 0;
  const rows = c.panel ? Math.ceil(h/pl) : 0;
  const panels = across*rows;
  const panelArea = c.panel ? (pwIn/12)*pl : 0;
  const cutIn = c.panel ? (across*pwIn - w*12) : 0; // inches trimmed off the last panel
  const qty = c.perRoll ? Math.ceil(area/57) : c.panel ? panels : area;
  const material = c.perRoll ? qty*c.rate : c.panel ? panels*panelArea*c.rate : area*c.rate;
  const labour = area*c.labour;
  const gst = (material+labour)*0.18;
  const total = material+labour+gst;

  const Row = ({ l, v, bold }) => (
    <div className={`flex justify-between py-2.5 text-sm ${bold?"font-extrabold":""}`} style={{borderBottom:bold?"none":`1px dashed ${T.line}`}}>
      <span style={{color:bold?T.ink:T.mute}}>{l}</span><span>{v}</span>
    </div>
  );

  return (
    <Section className="fade-up">
      <Eyebrow>Estimate</Eyebrow>
      <H2>Cost calculator</H2>
      <p className="text-sm mb-6" style={{color:T.mute}}>Live rates including material, labour and GST — the same math we use in your quotation.</p>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 mb-8">
        {CALCS.map((x,i)=><Chip key={x.name} active={tab===i} onClick={()=>setTab(i)}>{x.name}</Chip>)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white" style={{borderRadius:24, border:`1px solid ${T.line}`}}>
          <div className="text-sm font-extrabold mb-4 flex items-center gap-2"><Ruler size={16} color={T.goldDeep}/>Measurements — {c.name}</div>
          <div className="flex gap-3 mb-5">
            <NumInput label="Width" value={w} set={setW} suffix="feet"/>
            <NumInput label="Height / Length" value={h} set={setH} suffix="feet"/>
          </div>
          {c.panel && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider" style={{color:T.mute}}>Panel width</span>
                <span className="text-sm font-extrabold px-2.5 py-0.5" style={{borderRadius:8, background:T.goldSoft, color:T.goldDeep}}>{pwIn}″</span>
              </div>
              <input type="range" min="6" max="12" step="1" value={pwIn} onChange={e=>setPwIn(+e.target.value)}
                aria-label="Panel width in inches" className="w-full" style={{accentColor:T.goldDeep}}/>
              <div className="flex justify-between text-[10px] font-bold mb-4" style={{color:T.mute}}><span>6″</span><span>8″</span><span>10″</span><span>12″</span></div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{color:T.mute}}>Panel length</div>
              <div className="flex gap-2 flex-wrap">
                {c.lengths.map((l,i)=><Chip key={l} active={plIdx===i} onClick={()=>setPlIdx(i)}>{l} ft</Chip>)}
              </div>
            </div>
          )}
          <div className="p-4 flex items-center justify-between" style={{borderRadius:18, background:T.paper, border:`1px solid ${T.line}`}}>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider" style={{color:T.mute}}>Total area</div>
              <div className="disp text-2xl font-semibold">{area} <span className="text-sm font-normal">sq.ft</span></div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold uppercase tracking-wider" style={{color:T.mute}}>Quantity</div>
              <div className="disp text-2xl font-semibold">{qty} <span className="text-sm font-normal">{c.perRoll?"rolls":c.panel?"panels":"sq.ft"}</span></div>
            </div>
          </div>
          {c.panel && (
            <div className="mt-3 p-4 fade-up" key={panels+"-"+pwIn} style={{borderRadius:18, background:T.goldSoft, border:`1px solid ${T.gold}`}}>
              <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{color:T.goldDeep}}>Panel layout — {pwIn}″ × {pl} ft</div>
              <div className="text-sm font-bold">{panels} panels fit this {w}×{h} ft wall — {across} across{rows>1?` × ${rows} rows (joint at ${pl} ft, wall taller than panel)`:" in a single floor-to-ceiling row"}</div>
              <div className="text-xs mt-1" style={{color:T.goldDeep}}>Each panel covers {panelArea.toFixed(1)} sq.ft · total coverage {(panels*panelArea).toFixed(0)} sq.ft{cutIn>0?` · last panel cut by ${cutIn.toFixed(1)}″`:" · fits exactly, no cutting"}</div>
              <WallPreview w={w} h={h} pwIn={pwIn} pl={pl} across={across} rows={rows} panels={panels} cutIn={cutIn}/>
            </div>
          )}
          <div className="text-xs mt-4" style={{color:T.mute}}>Rate: {INR(c.rate)} / {c.unit} · Labour: {INR(c.labour)} / sq.ft</div>
        </div>

        <div className="p-6 text-white relative overflow-hidden fade-up" key={tab+"-"+area}
          style={{borderRadius:24, background:`linear-gradient(150deg,${T.ink},${T.ink2})`, border:`1px solid ${T.gold}`}}>
          <div className="absolute -right-12 -top-12 w-52 h-52 rounded-full opacity-20" style={{background:`radial-gradient(circle,${T.gold},transparent 70%)`}}/>
          <div className="text-sm font-extrabold mb-4 flex items-center gap-2 relative"><IndianRupee size={16} color={T.gold}/>Your estimate</div>
          <div className="relative">
            {c.panel && <Row l={`Panels required (${pwIn}″ × ${pl} ft)`} v={`${panels} pcs`}/>}
            {c.perRoll && <Row l="Rolls required" v={`${qty} rolls`}/>}
            <Row l="Material cost" v={INR(material)}/>
            <Row l="Labour & installation" v={INR(labour)}/>
            <Row l="GST (18%)" v={INR(gst)}/>
            <div className="mt-3 p-4 flex items-center justify-between" style={{borderRadius:18, background:"rgba(198,161,91,.14)", border:`1px solid ${T.gold}`}}>
              <span className="text-sm font-bold" style={{color:T.gold}}>Grand total</span>
              <span className="disp text-3xl font-semibold">{INR(total)}</span>
            </div>
            <div className="flex gap-3 mt-5">
              <Btn gold full icon={MessageCircle}>Get exact quote</Btn>
              <Btn ghost sm icon={Calendar}><span className="text-white">Site visit</span></Btn>
            </div>
            <p className="text-[11px] text-white/50 mt-3">Indicative estimate. Final quotation after free site measurement.</p>
          </div>
        </div>
      </div>
    </Section>
  );
};

/* ————— INSPIRATION GALLERY ————— */
const ROOMS = ["All","Living Room","Bedroom","Kids Room","Office","Hotel","Restaurant","Cafe","Salon"];
const GALLERY = [
  ["Gold botanic lounge","Living Room",TEX.wallpaper,260],["Fluted TV wall","Living Room",TEX.fluted,200],
  ["Sage mural suite","Bedroom",TEX.mural,300],["Walnut headboard wall","Bedroom",TEX.wpc,190],
  ["Cloud mural nursery","Kids Room",TEX.glass,230],["Playful panel wall","Kids Room",TEX.pvc,180],
  ["Boardroom flute",  "Office",TEX.fluted,210],["Quiet SPC floor","Office",TEX.spc,170],
  ["Lobby statement","Hotel",TEX.mural,320],["Corridor panels","Hotel",TEX.wpc,180],
  ["Warm dine wall","Restaurant",TEX.wood,240],["Counter cladding","Cafe",TEX.fluted,190],
  ["Mirror wall glow","Salon",TEX.glass,220],["Grass patio nook","Cafe",TEX.grass,200],
];

const GalleryScreen = () => {
  const [f, setF] = useState("All");
  const [loading, setLoading] = useState(false);
  useEffect(()=>{ setLoading(true); const t=setTimeout(()=>setLoading(false), 450); return ()=>clearTimeout(t); },[f]);
  const items = GALLERY.filter(g=>f==="All"||g[1]===f);
  return (
    <Section className="fade-up">
      <Eyebrow>Ideas</Eyebrow>
      <H2>Inspiration gallery</H2>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 my-6">
        {ROOMS.map(r=><Chip key={r} active={f===r} onClick={()=>setF(r)}>{r}</Chip>)}
      </div>
      <div style={{columns:"2", columnGap:"16px"}} className="md:hidden">
        {loading ? [...Array(6)].map((_,i)=><div key={i} className="skeleton mb-4" style={{borderRadius:20, height:140+((i%3)*60), breakInside:"avoid"}}/>)
        : items.map(([t,r,tex,ht],i)=>(
          <div key={t} className="hover-lift relative overflow-hidden mb-4 flex items-end fade-up" style={{borderRadius:20, height:ht*0.7, breakInside:"avoid", animationDelay:`${i*40}ms`}}>
            <Texture tex={tex} className="absolute inset-0"/>
            <div className="glass m-2 px-3 py-2 w-full relative" style={{borderRadius:12}}>
              <div className="text-xs font-bold">{t}</div>
              <div className="text-[10px]" style={{color:T.mute}}>{r}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block" style={{columns:"3", columnGap:"18px"}}>
        {loading ? [...Array(9)].map((_,i)=><div key={i} className="skeleton mb-4" style={{borderRadius:22, height:160+((i%3)*70), breakInside:"avoid"}}/>)
        : items.map(([t,r,tex,ht],i)=>(
          <div key={t} className="hover-lift relative overflow-hidden mb-4 flex items-end fade-up group" style={{borderRadius:22, height:ht, breakInside:"avoid", animationDelay:`${i*40}ms`}}>
            <Texture tex={tex} className="absolute inset-0"/>
            <button aria-label="Save" className="absolute top-3 right-3 w-9 h-9 glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{borderRadius:12}}><Heart size={15}/></button>
            <div className="glass m-3 px-3.5 py-2.5 w-full relative" style={{borderRadius:14}}>
              <div className="text-sm font-bold">{t}</div>
              <div className="text-xs" style={{color:T.mute}}>{r}</div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

/* ————— CUSTOMER DASHBOARD ————— */
const AccountScreen = ({ go }) => {
  const [tab, setTab] = useState("Saved designs");
  const tabs = [["Saved designs",Wand2],["Wishlist",Heart],["Quotations",FileText],["Orders",Package],["Appointments",Calendar],["Notifications",Bell]];
  return (
    <Section className="fade-up">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 flex items-center justify-center text-white disp text-xl font-semibold" style={{borderRadius:18, background:T.ink, border:`1px solid ${T.gold}`}}>G</div>
        <div>
          <h1 className="disp text-2xl font-medium">Namaste, Gaurav</h1>
          <p className="text-xs" style={{color:T.mute}}>Member since 2024 · Agra</p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 mb-6">
        {tabs.map(([t])=><Chip key={t} active={tab===t} onClick={()=>setTab(t)}>{t}</Chip>)}
      </div>

      {tab==="Saved designs" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[["Living room · Fluted",TEX.fluted],["Bedroom · Sage mural",TEX.mural],["Office · SPC floor",TEX.spc]].map(([t,tex])=>(
            <div key={t} className="hover-lift bg-white overflow-hidden" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
              <Texture tex={tex} className="h-28"/>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs font-bold">{t}</span>
                <button onClick={()=>go("visualizer")} aria-label="Open"><ArrowRight size={14} color={T.goldDeep}/></button>
              </div>
            </div>
          ))}
          <button onClick={()=>go("visualizer")} className="flex flex-col items-center justify-center gap-2 min-h-40 text-xs font-bold" style={{borderRadius:20, border:`2px dashed ${T.line}`, color:T.mute}}>
            <Plus size={18} color={T.goldDeep}/> New design
          </button>
        </div>
      )}
      {tab==="Wishlist" && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{PRODUCTS.map(p=><ProductCard key={p.name} p={p} go={go}/>)}</div>}
      {tab==="Quotations" && (
        <div className="space-y-3">
          {[["QT-2049","Fluted panels + SPC · Living room",48500,"Awaiting approval"],["QT-2031","Wallpaper · Master bedroom",16200,"Approved"]].map(([id,d,amt,st])=>(
            <div key={id} className="p-4 bg-white flex items-center justify-between gap-3 flex-wrap" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
              <div><div className="text-sm font-bold">{id} · {d}</div><div className="text-xs" style={{color:T.mute}}>{st}</div></div>
              <div className="flex items-center gap-3"><span className="disp text-lg font-semibold">{INR(amt)}</span><Btn dark sm>View PDF</Btn></div>
            </div>
          ))}
        </div>
      )}
      {tab==="Orders" && (
        <div className="space-y-3">
          {[["#WD-1189","Walnut Fluted Panel · 140 sq.ft","Installation on 12 Jul",1],["#WD-1177","Botanica Gold Wallpaper · 6 rolls","Delivered & installed",3]].map(([id,d,st,step])=>(
            <div key={id} className="p-5 bg-white" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
              <div className="flex justify-between flex-wrap gap-2 mb-4">
                <div><div className="text-sm font-bold">{id}</div><div className="text-xs" style={{color:T.mute}}>{d}</div></div>
                <span className="text-xs font-bold px-3 py-1.5 self-start" style={{borderRadius:10, background:T.goldSoft, color:T.goldDeep}}>{st}</span>
              </div>
              <div className="flex items-center gap-1">
                {["Ordered","Material ready","Installation","Complete"].map((s,i)=>(
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-6 h-6 flex items-center justify-center text-[10px] font-bold" style={{borderRadius:8, background:i<=step?T.gold:T.line, color:i<=step?"#fff":T.mute}}>{i<=step?<Check size={11}/>:i+1}</div>
                      <span className="text-[9px] font-bold hidden sm:block" style={{color:i<=step?T.ink:T.mute}}>{s}</span>
                    </div>
                    {i<3 && <div className="flex-1 h-0.5 mb-0 sm:mb-4" style={{background:i<step?T.gold:T.line}}/>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {tab==="Appointments" && (
        <div className="p-5 bg-white flex items-center justify-between flex-wrap gap-3" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex flex-col items-center justify-center" style={{borderRadius:14, background:T.goldSoft}}>
              <span className="text-[10px] font-bold" style={{color:T.goldDeep}}>JUL</span><span className="font-extrabold">14</span>
            </div>
            <div><div className="text-sm font-bold">Free site visit — measurement</div><div className="text-xs" style={{color:T.mute}}>11:00 AM · Kamla Nagar, Agra</div></div>
          </div>
          <Btn ghost sm>Reschedule</Btn>
        </div>
      )}
      {tab==="Notifications" && (
        <div className="space-y-2">
          {[["Your quotation QT-2049 is ready","2h ago"],["Installer assigned for order #WD-1189","1d ago"],["New fluted panel colours just arrived","3d ago"]].map(([t,d])=>(
            <div key={t} className="p-4 bg-white flex items-center gap-3" style={{borderRadius:16, border:`1px solid ${T.line}`}}>
              <Bell size={15} color={T.goldDeep}/><div className="flex-1 text-sm font-semibold">{t}</div><span className="text-xs" style={{color:T.mute}}>{d}</span>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
};

/* ————— ADMIN DASHBOARD ————— */
const SALES = [["Jan",3.2],["Feb",4.1],["Mar",3.8],["Apr",5.2],["May",6.1],["Jun",5.6],["Jul",7.2]].map(([m,v])=>({m, v}));
const LEADS = [["Wallpaper",42],["Panels",65],["Flooring",38],["Blinds",22],["Kitchen",15]].map(([n,v])=>({n,v}));

const AdminScreen = () => {
  const [side, setSide] = useState("Overview");
  const menu = [["Overview",TrendingUp],["Sales",IndianRupee],["Leads",Users],["Products",Package],["Categories",LayoutGrid],["Inventory",Boxes],["CRM",MessageCircle],["Team",Users],["Orders",ShoppingBag],["Quotations",ClipboardList]];
  const kpis = [["Revenue (Jul)","₹7.2L","+18%"],["New leads","96","+11%"],["Orders","41","+6%"],["Quotes sent","58","+22%"]];
  return (
    <div className="fade-up max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-8 grid lg:grid-cols-5 gap-6">
      {/* sidebar */}
      <aside className="lg:col-span-1">
        <div className="lg:sticky lg:top-20 flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
          {menu.map(([m,Ic])=>(
            <button key={m} onClick={()=>setSide(m)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap"
              style={{borderRadius:14, background:side===m?T.ink:"transparent", color:side===m?"#fff":T.mute}}>
              <Ic size={15} color={side===m?T.gold:T.mute}/>{m}
            </button>
          ))}
        </div>
      </aside>
      {/* main */}
      <main className="lg:col-span-4 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div><Eyebrow>Admin · {side}</Eyebrow><h1 className="disp text-2xl md:text-3xl font-medium -mt-1">Business at a glance</h1></div>
          <Btn gold sm icon={Plus}>Add product</Btn>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map(([t,v,d])=>(
            <div key={t} className="p-4 bg-white hover-lift" style={{borderRadius:20, border:`1px solid ${T.line}`}}>
              <div className="text-xs font-bold" style={{color:T.mute}}>{t}</div>
              <div className="disp text-2xl font-semibold my-0.5">{v}</div>
              <div className="text-xs font-bold" style={{color:"#1FA855"}}>{d} vs last month</div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 p-5 bg-white" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
            <div className="text-sm font-extrabold mb-3">Sales — last 7 months (₹ lakh)</div>
            <div style={{height:200}}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES}>
                  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.gold} stopOpacity=".5"/><stop offset="100%" stopColor={T.gold} stopOpacity="0"/></linearGradient></defs>
                  <XAxis dataKey="m" tick={{fontSize:11, fill:T.mute}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11, fill:T.mute}} axisLine={false} tickLine={false} width={26}/>
                  <Tooltip contentStyle={{borderRadius:14, border:`1px solid ${T.line}`, fontFamily:"Manrope"}}/>
                  <Area type="monotone" dataKey="v" stroke={T.goldDeep} strokeWidth={2.5} fill="url(#g)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lg:col-span-2 p-5 bg-white" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
            <div className="text-sm font-extrabold mb-3">Leads by category (Jul)</div>
            <div style={{height:200}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={LEADS}>
                  <XAxis dataKey="n" tick={{fontSize:10, fill:T.mute}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{borderRadius:14, border:`1px solid ${T.line}`, fontFamily:"Manrope"}}/>
                  <Bar dataKey="v" fill={T.ink} radius={[8,8,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="p-5 bg-white overflow-x-auto" style={{borderRadius:22, border:`1px solid ${T.line}`}}>
          <div className="text-sm font-extrabold mb-3">Recent leads</div>
          <table className="w-full text-sm min-w-[560px]">
            <thead><tr className="text-left text-xs uppercase tracking-wider" style={{color:T.mute}}>
              <th className="py-2 font-bold">Customer</th><th className="font-bold">Interest</th><th className="font-bold">Source</th><th className="font-bold">Value</th><th className="font-bold">Status</th>
            </tr></thead>
            <tbody>
              {[["Sanjay Mehta","Fluted panels","WhatsApp",42000,"Hot"],["Priya Agarwal","Modular kitchen","Site visit",185000,"Quote sent"],["Hotel Grand Vista","ACP exterior","Referral",520000,"Negotiation"],["Rohit Jain","SPC flooring","Instagram",36000,"New"]].map(([n,i,s,v,st])=>(
                <tr key={n} style={{borderTop:`1px solid ${T.line}`}}>
                  <td className="py-3 font-bold">{n}</td><td style={{color:T.mute}}>{i}</td><td style={{color:T.mute}}>{s}</td>
                  <td className="font-semibold">{INR(v)}</td>
                  <td><span className="text-xs font-bold px-2.5 py-1" style={{borderRadius:8, background:st==="Hot"?"#FDECEC":T.goldSoft, color:st==="Hot"?"#C0392B":T.goldDeep}}>{st}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

/* ————— DESIGN SYSTEM ————— */
const DesignSystemScreen = () => (
  <Section className="fade-up">
    <Eyebrow>Foundation</Eyebrow>
    <H2>Design system</H2>
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <div className="p-6 bg-white" style={{borderRadius:24, border:`1px solid ${T.line}`}}>
        <div className="text-sm font-extrabold mb-4">Colour palette</div>
        <div className="grid grid-cols-3 gap-3">
          {[["Charcoal",T.ink],["Ink 2",T.ink2],["Paper",T.paper],["Gold",T.gold],["Gold deep",T.goldDeep],["Gold soft",T.goldSoft]].map(([n,c])=>(
            <div key={n}>
              <div className="h-14" style={{borderRadius:14, background:c, border:`1px solid ${T.line}`}}/>
              <div className="text-xs font-bold mt-1.5">{n}</div><div className="text-[10px]" style={{color:T.mute}}>{c}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 bg-white" style={{borderRadius:24, border:`1px solid ${T.line}`}}>
        <div className="text-sm font-extrabold mb-4">Typography</div>
        <div className="disp text-3xl font-medium mb-1">Fraunces — display</div>
        <p className="text-sm mb-4" style={{color:T.mute}}>Headlines, prices, hero statements. Serif warmth = craft & luxury.</p>
        <div className="text-xl font-extrabold mb-1" style={{fontFamily:"Manrope"}}>Manrope — interface</div>
        <p className="text-sm" style={{color:T.mute}}>Body, labels, buttons, data. Clean geometry = Stripe-grade clarity.</p>
      </div>
      <div className="p-6 bg-white" style={{borderRadius:24, border:`1px solid ${T.line}`}}>
        <div className="text-sm font-extrabold mb-4">Buttons</div>
        <div className="flex flex-wrap gap-3"><Btn gold>Gold primary</Btn><Btn dark>Dark</Btn><Btn>Light</Btn><Btn ghost>Ghost</Btn><Btn gold sm>Small</Btn></div>
        <div className="text-sm font-extrabold my-4">Chips</div>
        <div className="flex gap-2"><Chip active>Active</Chip><Chip>Default</Chip></div>
      </div>
      <div className="p-6 bg-white" style={{borderRadius:24, border:`1px solid ${T.line}`}}>
        <div className="text-sm font-extrabold mb-4">Surfaces & radius</div>
        <div className="flex gap-3">
          <div className="flex-1 h-24 glass flex items-center justify-center text-xs font-bold" style={{borderRadius:20, border:`1px solid ${T.line}`}}>Glass · 20px</div>
          <Texture tex={TEX.fluted} className="flex-1 h-24 flex items-center justify-center text-xs font-bold text-white" style={{borderRadius:24}}>Texture · 24px</Texture>
        </div>
        <div className="skeleton h-8 mt-3" style={{borderRadius:12}}/>
        <div className="text-[10px] mt-1.5" style={{color:T.mute}}>Loading skeleton</div>
      </div>
    </div>
  </Section>
);

/* ————— APP ————— */
export default function App(){
  const [screen, setScreen] = useState("home");
  const go = (s) => { setScreen(s); window.scrollTo({top:0}); };
  useEffect(()=>{
    const el = document.createElement("style"); el.innerHTML = css; document.head.appendChild(el);
    return ()=>el.remove();
  },[]);
  const S = { home:HomeScreen, categories:CategoriesScreen, product:ProductScreen, visualizer:VisualizerScreen, calculator:CalculatorScreen, gallery:GalleryScreen, account:AccountScreen, admin:AdminScreen, design:DesignSystemScreen }[screen] || HomeScreen;
  return (
    <div className="wd min-h-screen pb-20 lg:pb-0" style={{background:T.paper}}>
      <TopNav screen={screen} go={go}/>
      <S key={screen} go={go}/>
      {/* footer */}
      <footer style={{background:T.ink}} className="text-white mt-6">
        <Section className="py-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="disp text-xl font-semibold mb-2">Walldecor<span style={{color:T.gold}}>99</span></div>
              <p className="text-sm text-white/60">Premium interior & exterior solutions. Showroom in Agra, projects across UP.</p>
            </div>
            <div className="text-sm text-white/60 space-y-1.5">
              <div className="font-bold text-white mb-2">Explore</div>
              {["Categories","AI Visualizer","Cost Calculator","Inspiration"].map(x=><div key={x}>{x}</div>)}
            </div>
            <div className="text-sm text-white/60 space-y-1.5">
              <div className="font-bold text-white mb-2">Contact</div>
              <div className="flex items-center gap-2"><MapPin size={13} color={T.gold}/>Agra, Uttar Pradesh</div>
              <div className="flex items-center gap-2"><Phone size={13} color={T.gold}/>+91 99XX XXX 99</div>
              <button onClick={()=>go("design")} className="flex items-center gap-2 text-white/40 mt-3 text-xs"><Layers size={12}/>View design system</button>
            </div>
          </div>
        </Section>
      </footer>
      <MobileTabs screen={screen} go={go}/>
      <WhatsAppFab/>
    </div>
  );
}
