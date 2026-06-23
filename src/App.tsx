import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  History, 
  Cpu, 
  Radio, 
  Bell,
  Activity,
  Wrench
} from 'lucide-react';

// --- Types ---

type Tab = 'STATO' | 'CONTROLLI' | 'ALLARMI' | 'MANUTENZIONE';

interface Alarm {
  id: string;
  time: string;
  code: string;
  desc: string;
  type: 'ERR' | 'WRN';
}

// --- Constants ---

const INITIAL_ALARMS: Alarm[] = [
  { id: '2', time: '14:02:28', code: 'ERR_088', desc: 'TEMPERATURA ZONA 2 CRITICA', type: 'ERR' },
  { id: '6', time: '13:58:22', code: 'ERR_102', desc: 'EMERGENZA PREMUTA - LINEA B', type: 'ERR' },
  { id: '9', time: '13:50:30', code: 'ERR_201', desc: 'ERRORE COMUNICAZIONE PLC', type: 'ERR' },
  { id: '1', time: '14:02:42', code: 'WRN_079', desc: 'PRESSIONE STAMPO FUORI SOGLIA', type: 'WRN' },
  { id: '3', time: '14:02:13', code: 'WRN_089', desc: 'VELOCITÀ NASTRO ANOMALA', type: 'WRN' },
  { id: '4', time: '14:01:43', code: 'WRN_086', desc: 'SENSORE POMPA NON RISPONDE', type: 'WRN' },
  { id: '5', time: '14:01:02', code: 'WRN_031', desc: 'TARATURA AUTOMATICA FALLITA', type: 'WRN' },
  { id: '7', time: '13:55:10', code: 'WRN_044', desc: 'LIVELLO LUBRIFICANTE BASSO', type: 'WRN' },
  { id: '8', time: '13:52:05', code: 'WRN_012', desc: 'FLUSSO RAFFREDDAMENTO RIDOTTO', type: 'WRN' },
  { id: '10', time: '13:48:15', code: 'WRN_055', desc: 'SOVRACCARICO MOTORE ESTRUSORE', type: 'WRN' },
];

// --- Components ---

const IndustrialSlider = ({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  unit = '%',
  isCorrectDesign = false
}: { 
  label: string; 
  value: number; 
  onChange: (val: number) => void; 
  min?: number; 
  max?: number; 
  step?: number;
  unit?: string;
  isCorrectDesign?: boolean;
}) => (
  <div className={isCorrectDesign ? "" : ""}>
    <div className={`flex justify-between items-end ${isCorrectDesign ? "mb-2" : "mb-1"}`}>
      <span className={`${isCorrectDesign ? "text-[15px]" : "text-[10px]"} font-bold text-black/60 uppercase tracking-wider`}>{label}</span>
      <span className={`${isCorrectDesign ? "text-2xl" : "text-sm"} font-bold text-hmi-toxic-green tracking-tighter`}>
        {value}{unit}
      </span>
    </div>
    <div className="flex items-center gap-3">
      {isCorrectDesign && (
        <button 
          onClick={() => onChange(Math.max(min, value - step))}
          className="w-12 h-12 border border-black/20 bg-hmi-steel-light flex items-center justify-center text-xl font-bold active:bg-black/10 active:translate-y-0.5 transition-all industrial-bevel"
        >
          -
        </button>
      )}
      <div className={`relative ${isCorrectDesign ? "h-12" : "h-6"} flex-1 flex items-center`}>
        <div className="absolute w-full h-[2px] industrial-inset" />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div 
          className={`absolute ${isCorrectDesign ? "h-6 w-3" : "h-4 w-2"} bg-[#94A3B8] industrial-bevel border-[1px] border-black/20 pointer-events-none`}
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - ${isCorrectDesign ? '6px' : '4px'})` }}
        >
          <div className="w-full h-full flex flex-col justify-center items-center gap-[1px]">
            <div className="w-[60%] h-[1px] bg-black/40" />
            <div className="w-[60%] h-[1px] bg-black/40" />
          </div>
        </div>
      </div>
      {isCorrectDesign && (
        <button 
          onClick={() => onChange(Math.min(max, value + step))}
          className="w-12 h-12 border border-black/20 bg-hmi-steel-light flex items-center justify-center text-xl font-bold active:bg-black/10 active:translate-y-0.5 transition-all industrial-bevel"
        >
          +
        </button>
      )}
    </div>
  </div>
);

const IndustrialToggle = ({ 
  label, 
  active, 
  onChange,
  isCorrectDesign = false 
}: { 
  label: string; 
  active: boolean; 
  onChange: () => void;
  isCorrectDesign?: boolean;
}) => (
  <div className={`flex items-center justify-between ${isCorrectDesign ? "p-3 h-[56px]" : "p-2 h-[36px]"} rounded bg-black/5 industrial-bevel industrial-gloss transition-all`}>
    <span className={`${isCorrectDesign ? "text-[15px]" : "text-[10px]"} font-bold text-black/70 uppercase`}>{label}</span>
    <div className="flex items-center gap-3">
      {/* LED */}
      <div className={`${isCorrectDesign ? "w-6 h-6" : "w-3 h-3"} rounded-full border border-black/50 ${active ? 'bg-hmi-toxic-green shadow-[0_0_10px_rgba(5,150,105,0.4)]' : 'bg-[#CBD5E1]'} transition-all`} />
      {/* Switch */}
      <button
        onClick={onChange}
        className={`relative ${isCorrectDesign ? "w-16 h-8 px-1" : "w-10 h-5 px-[2px]"} bg-[#E2E8F0] border border-black/10 flex items-center cursor-pointer transition-all`}
      >
        <motion.div
          animate={{ x: active ? (isCorrectDesign ? 32 : 20) : 0 }}
          className={`${isCorrectDesign ? "w-7 h-7" : "w-4 h-4"} industrial-bevel ${active ? 'bg-hmi-toxic-green-dim' : 'bg-[#94A3B8]'} transition-all`}
        />
      </button>
    </div>
  </div>
);

const IconButton = ({ active }: { active?: boolean }) => (
  <button className="p-1 border border-black/10 bg-[#E5E7EB] industrial-bevel hover:bg-[#D1D5DB] active:bg-[#CBD5E1]">
    <Settings size={12} className={active ? 'text-hmi-toxic-green' : 'text-black/60'} />
  </button>
);

export default function App() {
  const [speed, setSpeed] = useState(30);
  const [temp, setTemp] = useState(185);
  const [pressure, setPressure] = useState(0.9);
  const [injPressure, setInjPressure] = useState(74);
  const [cooling, setCooling] = useState(true);
  const [autoCalib, setAutoCalib] = useState(false);
  
  const [alarmFilter, setAlarmFilter] = useState<'TUTTI' | 'ERR' | 'WRN'>('TUTTI');
  
  const [showFab, setShowFab] = useState(false);
  const [isCorrectDesign, setIsCorrectDesign] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFab(true);
    }, 60000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSpeed(30);
    setTemp(185);
    setPressure(0.9);
    setInjPressure(74);
    setCooling(true);
    setAutoCalib(false);
    setAlarmFilter('TUTTI');
    setAlarmLog(INITIAL_ALARMS);
  }, [isCorrectDesign]);

  const [alarmLog, setAlarmLog] = useState<Alarm[]>(INITIAL_ALARMS);

  const filteredAlarms = alarmLog.filter(a => {
    if (alarmFilter === 'TUTTI') return true;
    return a.type === alarmFilter;
  });

  const displayedAlarms = isCorrectDesign ? filteredAlarms.slice(0, 3) : filteredAlarms;

  return (
    <div className="flex flex-col h-screen w-screen bg-hmi-carbone font-sans overflow-hidden select-none relative">
      {/* Announcement Bar */}
      <div 
        className="fixed top-0 left-0 w-full bg-[#1a73e8] text-white py-6 px-6 z-[9999] shadow-md font-inter min-h-[120px] flex items-center"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 w-full">
          <div className="flex-1">
            <p className="text-[14px] leading-snug font-bold mb-1">
              Istruzioni per interagire con l'interfaccia
            </p>
            <p className="text-[14px] leading-snug font-normal">
              Immagina di essere un operatore del settore manifatturiero e di dover utilizzare questa interfaccia di comando dei macchinari con un guanto. Modifica la velocità del nastro mettendola al 72% e rimuovi "Temperatura Zona 2 Critica" dal registro allarmi.
            </p>
          </div>
          
          <div className="w-[240px] flex-shrink-0 flex justify-end">
            <AnimatePresence>
              {showFab && (
                <motion.button
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: 1 
                  }}
                  transition={{ 
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    opacity: {
                      duration: 0.5,
                      ease: "linear"
                    }
                  }}
                  onClick={() => setIsCorrectDesign(!isCorrectDesign)}
                  className="px-6 py-2 bg-white text-[#1a73e8] font-bold text-xs rounded-sm shadow-[0_10px_25px_-5px_rgba(0,0,0,0.4)] hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {isCorrectDesign ? "Torna al design mal progettato" : "Vedi design migliorato"}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-[180px] sm:pt-[160px] md:pt-[150px]">
        {/* Header */}
        <header className="h-[50px] md:h-[60px] flex items-center justify-between px-4 border-b border-black/10 industrial-gloss flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <div className="w-[20px] h-[20px] border border-black/20 flex items-center justify-center">
                <Cpu size={14} className="text-slate-900" />
              </div>
            </div>
            <h1 className="text-xs md:text-sm font-bold tracking-tight uppercase text-slate-900">Parametri Linea B – Componenti in Gomma</h1>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-hmi-toxic-green tracking-widest uppercase">Sistema Attivo</span>
            <span className="text-[10px] font-bold text-hmi-amber tracking-tighter uppercase italic">Modalità Manutenzione</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 ml-4">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-hmi-toxic-green" />
              <div className="flex gap-[2px]">
                {[1, 2, 3].map(i => <div key={i} className="w-[3px] h-4 bg-hmi-toxic-green" />)}
              </div>
            </div>
            <div className="h-6 w-px bg-black/10" />
            <div className="text-[10px] font-mono text-black/40">13.05.2026 | 12:07</div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className={`flex-1 ${isCorrectDesign ? "p-4 overflow-hidden" : "p-3 overflow-y-auto"} flex flex-col ${isCorrectDesign ? "gap-4" : "gap-3"} min-h-0`}>
          <div className={`${isCorrectDesign ? "flex-1 min-h-0 flex flex-col gap-4" : "flex flex-col gap-3"}`}>

          {/* Top Row: Process Control and Alarms */}
          <div className={`${isCorrectDesign ? "flex flex-col gap-4 flex-1 min-h-0" : "grid grid-cols-1 gap-3"}`}>

            {/* Process Control Section */}
            <section className={`border border-hmi-steel-border/50 ${isCorrectDesign ? "p-4 pb-3 h-[calc(50%+27px)] shrink-0 overflow-hidden" : "p-2 md:p-3"} bg-hmi-steel/30 relative flex flex-col`}>
              <div className={`flex items-center justify-between ${isCorrectDesign ? "mb-3" : "mb-2"} border-b border-black/5 ${isCorrectDesign ? "pb-2" : "pb-1"}`}>
                <h2 className={`${isCorrectDesign ? "text-lg" : "text-[10px] md:text-[11px]"} font-bold text-black/50 uppercase flex items-center gap-2`}>
                  <Activity size={isCorrectDesign ? 20 : 12} />
                  Controllo Processo
                </h2>
              </div>
              
              <div className={isCorrectDesign ? "space-y-4" : "space-y-2 md:space-y-3"}>
                <IndustrialSlider label="Velocità Nastro (%)" value={speed} onChange={setSpeed} max={100} step={1} isCorrectDesign={isCorrectDesign} />
                <IndustrialSlider label="Temperatura Zona 2 – Vulcanizzazione" value={temp} onChange={setTemp} min={0} max={300} unit="° C" isCorrectDesign={isCorrectDesign} />
                <IndustrialSlider label="Pressione Iniezione (%)" value={injPressure} onChange={setInjPressure} max={100} step={1} isCorrectDesign={isCorrectDesign} />
              </div>
              
              <div className={`${isCorrectDesign ? "mt-3" : "mt-2"} flex flex-col gap-1`}>
                <div className="flex items-center gap-2">
                  <span className={`${isCorrectDesign ? "text-[14px]" : "text-[9px]"} font-bold text-black/60 uppercase`}>Offset Pressione Stampo</span>
                  <div className="flex-1 h-[1px] bg-black/5" />
                  <div className="flex items-center gap-2">
                    <div className={`${isCorrectDesign ? "w-24 h-12 text-sm" : "w-16 h-6 text-[11px]"} industrial-inset flex items-center justify-end px-3 font-bold text-slate-900 tabular-nums`}>
                      {pressure.toFixed(1)} bar
                    </div>
                    <button 
                      onClick={() => setPressure(p => parseFloat((Math.max(0, p - 0.1)).toFixed(1)))}
                      className={`${isCorrectDesign ? "w-12 h-12 text-xl" : "w-6 h-6 text-sm"} industrial-bevel bg-hmi-steel-light flex items-center justify-center font-bold active:bg-black/10 transition-all`}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => setPressure(p => parseFloat((p + 0.1).toFixed(1)))}
                      className={`${isCorrectDesign ? "w-12 h-12 text-xl" : "w-6 h-6 text-sm"} industrial-bevel bg-hmi-steel-light flex items-center justify-center font-bold active:bg-black/10 transition-all`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className={`flex items-center justify-between ${isCorrectDesign ? "mt-2" : "mt-1"}`}>
                  <div className={`flex ${isCorrectDesign ? "gap-4" : "gap-4"}`}>
                    <div className="flex flex-col">
                      <span className={`${isCorrectDesign ? "text-[12px]" : "text-[7px]"} text-black/40 uppercase font-bold`}>Portata Pompa</span>
                      <span className={`${isCorrectDesign ? "text-lg" : "text-[10px]"} text-hmi-toxic-green/80 font-mono`}>12.3 L/min</span>
                    </div>
                    <div className="flex flex-col">
                      <span className={`${isCorrectDesign ? "text-[12px]" : "text-[7px]"} text-black/40 uppercase font-bold`}>Cicli Completati</span>
                      <span className={`${isCorrectDesign ? "text-lg" : "text-[10px]"} text-hmi-toxic-green/80 font-mono`}>1.847</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`grid grid-cols-2 ${isCorrectDesign ? "gap-2 mt-3" : "gap-x-2 gap-y-1 mt-2"}`}>
                <IndustrialToggle label="Pompa Olio Idraulico" active={cooling} onChange={() => setCooling(!cooling)} isCorrectDesign={isCorrectDesign} />
                <IndustrialToggle label="Taratura Sensori" active={autoCalib} onChange={() => setAutoCalib(!autoCalib)} isCorrectDesign={isCorrectDesign} />
              </div>
            </section>

            {/* Alarm Log Section */}
            <section className="border border-hmi-steel-border/50 bg-hmi-steel/30 flex flex-col flex-1 min-h-0">
              <div className={`flex items-center justify-between ${isCorrectDesign ? "px-4 py-3" : "px-3 py-1"} border-b border-black/5 bg-black/5`}>
                <h2 className={`${isCorrectDesign ? "text-lg" : "text-[10px]"} font-bold text-black/50 uppercase flex items-center gap-2`}>
                  <Bell size={isCorrectDesign ? 20 : 10} />
                  Registro Allarmi
                </h2>
                <div className={`flex items-center ${isCorrectDesign ? "gap-4" : "gap-4"}`}>
                  <div className={`flex ${isCorrectDesign ? "gap-2" : "gap-1"}`}>
                    {(['TUTTI', 'ERR', 'WRN'] as const).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setAlarmFilter(tag)}
                        className={`${isCorrectDesign ? "px-5 py-2 text-[13px]" : "px-1.5 py-0.5 text-[7px]"} font-bold border industrial-bevel transition-all ${alarmFilter === tag ? 'bg-hmi-steel-light text-hmi-toxic-green border-hmi-toxic-green/50' : 'text-black/30 border-black/5'}`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <History size={isCorrectDesign ? 20 : 10} className="text-black/40" />
                </div>
              </div>
              
              <div className="overflow-y-auto flex-1 custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <tbody className="relative">
                    <AnimatePresence initial={false}>
                      {displayedAlarms.map((alarm) => (
                        <motion.tr 
                          key={alarm.id} 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ x: 100, opacity: 0 }}
                          className="border-b border-black/5 last:border-0 hover:bg-black/5 bg-hmi-steel/10"
                        >
                          <td className={`${isCorrectDesign ? "p-3 px-4 text-[15px]" : "p-0.5 px-2 text-[9px]"} font-bold text-hmi-amber opacity-80 tabular-nums align-top`}>{alarm.time}</td>
                          <td className={`${isCorrectDesign ? "p-3 text-[15px]" : "p-0.5 text-[9px]"} font-bold uppercase ${alarm.type === 'ERR' ? 'text-red-500' : 'text-hmi-amber'} align-top`}>{alarm.code}</td>
                          <td className={`${isCorrectDesign ? "p-3" : "p-0.5"} align-top`}>
                            <div className="flex flex-col gap-2">
                              <span className={`${isCorrectDesign ? "text-[15px]" : "text-[9px]"} font-bold uppercase ${alarm.type === 'ERR' ? 'text-red-500' : 'text-hmi-amber'} truncate max-w-[200px]`}>
                                {alarm.desc}
                              </span>
                              {isCorrectDesign && (
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                    className="px-4 py-2 border border-hmi-toxic-green/30 bg-hmi-toxic-green/5 text-hmi-toxic-green text-[13px] font-bold uppercase industrial-bevel hover:bg-hmi-toxic-green/10 transition-all flex items-center gap-2"
                                  >
                                    <div className="w-[6px] h-[6px] border-b-2 border-r-2 border-current rotate-45 mb-[1px]" />
                                    Risolvi
                                  </button>
                                  <button 
                                    onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                    className="px-4 py-2 border border-red-500/30 bg-red-500/5 text-red-500 text-[13px] font-bold uppercase industrial-bevel hover:bg-red-500/10 transition-all flex items-center gap-2"
                                  >
                                    <div className="relative w-[7px] h-[7px] flex items-center justify-center">
                                      <div className="absolute w-full h-[1.5px] bg-red-500 rotate-45" />
                                      <div className="absolute w-full h-[1.5px] bg-red-500 -rotate-45" />
                                    </div>
                                    Elimina
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                          {!isCorrectDesign && (
                            <td className="p-0.5 pr-2 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button 
                                  onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                  className="inline-flex items-center justify-center w-4 h-4 border border-black/5 hover:border-hmi-toxic-green/40 hover:bg-hmi-toxic-green/10 transition-colors"
                                >
                                  <div className="w-[5px] h-[5px] border-b-2 border-r-2 border-hmi-toxic-green rotate-45 mb-[1px]" />
                                </button>
                                <button 
                                  onClick={() => setAlarmLog(prev => prev.filter(a => a.id !== alarm.id))}
                                  className="inline-flex items-center justify-center w-4 h-4 border border-black/5 hover:border-red-500/40 hover:bg-red-500/10 transition-colors"
                                >
                                  <div className="relative w-[6px] h-[6px] flex items-center justify-center">
                                    <div className="absolute w-[6px] h-[1px] bg-red-500 rotate-45" />
                                    <div className="absolute w-[6px] h-[1px] bg-red-500 -rotate-45" />
                                  </div>
                                </button>
                              </div>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <div className={`${isCorrectDesign ? "p-3" : "p-2"} border-t border-black/10 bg-black/5`}>
                <div className={`flex items-center justify-between ${isCorrectDesign ? "text-[13px]" : "text-[8px]"} font-bold uppercase text-black/40`}>
                  <div className={`flex ${isCorrectDesign ? "gap-4" : "gap-3"}`}>
                    <span>Attivi: <span className="text-hmi-toxic-green">2</span></span>
                    <span>Non Letti: <span className="text-hmi-amber">3</span></span>
                    <span>Risolti: <span className="text-black/60">14</span></span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Screen Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay z-[50]">
        <div className="w-full h-full bg-[radial-gradient(circle,transparent_40%,black_100%)]" />
      </div>
      </div>
    </div>
  );
}

