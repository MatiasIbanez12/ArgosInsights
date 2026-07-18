// Lee el Excel "Argos-Insights-Orden-Financiero.xlsx" (la plantilla oficial) y devuelve
// los datos listos para guardar en Supabase.
//
// Importante: los nombres de las hojas y columnas de acá tienen que coincidir EXACTO con
// los de la plantilla real. Si alguien cambia un encabezado en el Excel, hay que actualizar
// también estos nombres.
import * as XLSX from 'xlsx';

function fechaISO(valor: unknown): string | null {
  if (!valor) return null;
  if (valor instanceof Date) {
    const yyyy = valor.getFullYear();
    const mm = String(valor.getMonth() + 1).padStart(2, '0');
    const dd = String(valor.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return null;
}

function numero(valor: unknown): number {
  return typeof valor === 'number' ? valor : Number(valor) || 0;
}

function texto(valor: unknown): string | null {
  if (valor === undefined || valor === null || valor === '') return null;
  return String(valor).trim();
}

export type ParsedInvoice = {
  cliente_nombre: string;
  numero_factura: string | null;
  monto: number;
  fecha_emision: string;
  plazo_dias: number;
  fecha_real_pago: string | null;
};

export type ParsedCashFlow = {
  mes: string;
  saldo_inicial: number;
  cobros_esperados: number;
  otros_ingresos: number;
  egresos_fijos: number;
  egresos_variables: number;
};

export type ParsedDocumentCycle = {
  cliente_nombre: string;
  numero_oc: string | null;
  fecha_oc: string | null;
  fecha_hes: string | null;
  fecha_edp: string | null;
  fecha_factura: string | null;
  fecha_pago: string | null;
};

export function parseArgosExcel(base64: string) {
  const libro = XLSX.read(base64, { type: 'base64', cellDates: true });

  const hojaCobrar = libro.Sheets['Cuentas por Cobrar'];
  const hojaCaja = libro.Sheets['Flujo de Caja'];
  const hojaCiclo = libro.Sheets['Ciclo Documental'];

  if (!hojaCobrar || !hojaCaja || !hojaCiclo) {
    throw new Error(
      'El archivo no tiene las 3 hojas esperadas ("Cuentas por Cobrar", "Flujo de Caja", "Ciclo Documental"). ¿Es la plantilla de Argos Insights?'
    );
  }

  // range: 2 => empieza a leer en la fila 3 del Excel (índice 2), que es la fila de
  // encabezados ("Cliente", "N° Factura", ...). Todo lo de abajo se convierte en objetos
  // usando esos encabezados como claves.
  const filasCobrar = XLSX.utils.sheet_to_json<Record<string, unknown>>(hojaCobrar, { range: 2 });
  const filasCaja = XLSX.utils.sheet_to_json<Record<string, unknown>>(hojaCaja, { range: 2 });
  const filasCiclo = XLSX.utils.sheet_to_json<Record<string, unknown>>(hojaCiclo, { range: 2 });

  const invoices: ParsedInvoice[] = filasCobrar
    .filter((f) => texto(f['Cliente']))
    .map((f) => ({
      cliente_nombre: texto(f['Cliente'])!,
      numero_factura: texto(f['N° Factura']),
      monto: numero(f['Monto ($)']),
      fecha_emision: fechaISO(f['Fecha Emisión']) ?? new Date().toISOString().slice(0, 10),
      plazo_dias: numero(f['Plazo (días)']) || 30,
      fecha_real_pago: fechaISO(f['Fecha Real de Pago']),
    }));

  const cashFlow: ParsedCashFlow[] = filasCaja
    .filter((f) => fechaISO(f['Mes']))
    .map((f) => ({
      mes: fechaISO(f['Mes'])!,
      saldo_inicial: numero(f['Saldo Inicial']),
      cobros_esperados: numero(f['Cobros Esperados*']),
      otros_ingresos: numero(f['Otros Ingresos']),
      egresos_fijos: numero(f['Egresos Fijos']),
      egresos_variables: numero(f['Egresos Variables']),
    }));

  const documentCycle: ParsedDocumentCycle[] = filasCiclo
    .filter((f) => texto(f['Cliente']))
    .map((f) => ({
      cliente_nombre: texto(f['Cliente'])!,
      numero_oc: texto(f['N° OC']),
      fecha_oc: fechaISO(f['Fecha OC']),
      fecha_hes: fechaISO(f['Fecha HES']),
      fecha_edp: fechaISO(f['Fecha EDP']),
      fecha_factura: fechaISO(f['Fecha Factura']),
      fecha_pago: fechaISO(f['Fecha Pago']),
    }));

  return { invoices, cashFlow, documentCycle };
}
