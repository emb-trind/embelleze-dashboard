import Redis from 'ioredis';


const REDIS_URL = process.env.REDIS_URL || '';

// Singleton
let redis: Redis | null = null;

if (REDIS_URL) {
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: false,
      lazyConnect: false,
    });

    redis.on('error', (err) => {
      console.error('[Dash-Redis] Erro de conexão (silenciado):', err.message);
    });

    redis.on('connect', () => console.log('[Dash-Redis] Conectado com sucesso.'));
  } catch (error) {
    console.error('[Dash-Redis] Falha ao inicializar cliente:', error);
    redis = null;
  }
}

export interface DiaStats {
  data: string;       // '2026-05-16'
  label: string;      // 'Seg 16/05'
  count: number;
  percent: number;    // relativo ao pico da semana
}

export interface LocationStats {
  rotasTotais: number;
  rotasHoje: number;
  rotasOntem: number;
  variacaoDia: number;       // % em relação a ontem (+12, -5…)
  mediaSemanal: number;
  topBairros: { bairro: string; count: number; percent: number }[];
  gpsAceito: number;
  gpsNegado: number;
  taxaAceiteGps: number;     // 0-100
  tendencia7d: DiaStats[];   // últimos 7 dias para bar chart
}

const DIAS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function dateKey(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().split('T')[0];
}

function diaLabel(isoDate: string): string {
  const [, , day] = isoDate.split('-');
  const d = new Date(isoDate + 'T12:00:00Z');
  return `${DIAS_PT[d.getUTCDay()]} ${day}`;
}

export async function getLocationStats(): Promise<LocationStats> {
  const empty: LocationStats = {
    rotasTotais: 0, rotasHoje: 0, rotasOntem: 0,
    variacaoDia: 0, mediaSemanal: 0,
    topBairros: [], gpsAceito: 0, gpsNegado: 0,
    taxaAceiteGps: 0, tendencia7d: [],
  };

  if (!redis) return empty;

  try {
    // Datas dos últimos 7 dias (hoje = offset 0)
    const datas = Array.from({ length: 7 }, (_, i) => dateKey(6 - i)); // mais antigo → hoje

    const pipeline = redis.pipeline();
    pipeline.get('location:intents:count');
    datas.forEach(d => pipeline.get(`location:intents:${d}`));
    pipeline.hgetall('location:intents:neighborhoods');
    pipeline.hgetall('location:intents:permissions');

    const results = await pipeline.exec();
    if (!results) return empty;

    const rotasTotais   = Number(results[0][1]) || 0;
    const countsPorDia  = datas.map((d, i) => ({ data: d, count: Number(results[i + 1][1]) || 0 }));
    const bairrosHash   = (results[8][1] as Record<string, string>) || {};
    const permsHash     = (results[9][1] as Record<string, string>) || {};

    const rotasHoje   = countsPorDia[6].count;
    const rotasOntem  = countsPorDia[5].count;
    const variacaoDia = rotasOntem > 0
      ? Math.round(((rotasHoje - rotasOntem) / rotasOntem) * 100)
      : rotasHoje > 0 ? 100 : 0;

    const soma7d       = countsPorDia.reduce((s, d) => s + d.count, 0);
    const mediaSemanal = Math.round(soma7d / 7);
    const pico7d       = Math.max(...countsPorDia.map(d => d.count), 1);

    const tendencia7d: DiaStats[] = countsPorDia.map(d => ({
      data:    d.data,
      label:   diaLabel(d.data),
      count:   d.count,
      percent: Math.round((d.count / pico7d) * 100),
    }));

    // Top bairros com % relativa ao maior
    const bairrosArr = Object.entries(bairrosHash)
      .map(([bairro, c]) => ({ bairro, count: Number(c) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const picoBairro = Math.max(...bairrosArr.map(b => b.count), 1);
    const topBairros = bairrosArr.map(b => ({
      ...b,
      percent: Math.round((b.count / picoBairro) * 100),
    }));

    const gpsAceito = Number(permsHash['granted']) || 0;
    const gpsNegado = Number(permsHash['denied']) || 0;
    const totalGps  = gpsAceito + gpsNegado;
    const taxaAceiteGps = totalGps > 0 ? Math.round((gpsAceito / totalGps) * 100) : 0;

    return {
      rotasTotais, rotasHoje, rotasOntem,
      variacaoDia, mediaSemanal,
      topBairros, gpsAceito, gpsNegado,
      taxaAceiteGps, tendencia7d,
    };
  } catch (err) {
    console.error('[Dash-Redis] Erro ao buscar stats:', err);
    return empty;
  }
}
