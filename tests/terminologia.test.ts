import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

// Archivos y carpetas a excluir (valores internos del sistema, no UI)
const EXCLUIR_PATHS = [
  'node_modules',
  '.next',
  '.git',
  '__tests__',
  'tests',
  'lib/supabase/types.ts', // archivo generado
  'supabase/migrations',   // SQL interno
]

// Palabras que NO deben aparecer en la UI
const PALABRAS_PROHIBIDAS = ['reclamo', 'Reclamo', 'RECLAMO', 'equipo municipal', 'Equipo Municipal']

// Palabras que SÍ pueden aparecer (valores internos de DB, rutas, identificadores de código)
// Los tests ignoran: type: 'reclamo', enum('reclamo'), -- reclamo (SQL), slugs de ruta
// (mis-reclamos, nuevo-reclamo) e identificadores PascalCase (NuevoReclamoForm)
const PATRONES_PERMITIDOS = [
  /type.*['"`]reclamo['"`]/,      // valor enum de DB
  /enum.*reclamo/i,                // definición de enum
  /\/\/ .*reclamo/i,               // comentarios de código
  /\* .*reclamo/i,                 // comentarios JSDoc
  /reclamo.*as const/,             // constantes internas
  /'reclamo'/,                     // string literal interno
  /"reclamo"/,                     // string literal interno
  /`reclamo`/,                     // template literal interno
  /-reclamo|reclamo-/i,            // slugs de ruta y nombres de archivo (mis-reclamos, nuevo-reclamo)
  /(\w+Reclamo\w*|\w*Reclamo\w+)/, // identificadores PascalCase (NuevoReclamoForm, MisReclamosPage)
  /\breclamo\s*:/i,                // clave de objeto/mapa interno (reclamo: 'Pedido')
]

function getTextFiles(dir: string): string[] {
  const files: string[] = []
  try {
    const entries = readdirSync(dir)
    for (const entry of entries) {
      const fullPath = join(dir, entry)
      if (EXCLUIR_PATHS.some(excluir => fullPath.includes(excluir))) continue
      const stat = statSync(fullPath)
      if (stat.isDirectory()) {
        files.push(...getTextFiles(fullPath))
      } else if (/\.(tsx|ts|html)$/.test(entry)) {
        files.push(fullPath)
      }
    }
  } catch {}
  return files
}

describe('Terminología — sin "reclamo" en la UI', () => {
  const archivos = getTextFiles(process.cwd())

  it('se encontraron archivos para analizar', () => {
    expect(archivos.length).toBeGreaterThan(10)
  })

  for (const archivo of archivos) {
    it(`${archivo.replace(process.cwd(), '')} no contiene "reclamo" en texto visible`, () => {
      const contenido = readFileSync(archivo, 'utf-8')
      const lineas = contenido.split('\n')

      for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i]

        for (const palabra of PALABRAS_PROHIBIDAS) {
          if (!linea.includes(palabra)) continue

          // Verificar si es un patrón permitido (valor interno, no UI)
          const esPermitido = PATRONES_PERMITIDOS.some(patron => patron.test(linea))
          if (esPermitido) continue

          // Si llegamos acá, es texto visible en la UI
          expect.fail(
            `"${palabra}" encontrado en ${archivo.replace(process.cwd(), '')}:${i + 1}\n  → ${linea.trim()}`
          )
        }
      }
    })
  }
})

// El vecino nunca debe ver la palabra "resuelto": 'resuelto' es un acto interno del
// equipo y en las pantallas del ciudadano se presenta como "En gestión" (ver
// lib/utils/estado-ciudadano.ts). Solo se permite en comentarios y valores internos.
const PATRONES_RESUELTO_PERMITIDOS = [
  /^\s*(\/\/|\*|\/\*)/, // comentarios de código
  /'resuelto'/, // valor interno de DB
  /"resuelto"/,
  /`resuelto`/,
]

describe('Terminología — sin "resuelto" en las pantallas del ciudadano', () => {
  const carpetas = [join(process.cwd(), 'app', 'ciudadano'), join(process.cwd(), 'components', 'ciudadano')]
  const archivos = carpetas.flatMap(getTextFiles)

  it('se encontraron archivos del ciudadano para analizar', () => {
    expect(archivos.length).toBeGreaterThan(3)
  })

  for (const archivo of archivos) {
    it(`${archivo.replace(process.cwd(), '')} no muestra "resuelto" al vecino`, () => {
      const lineas = readFileSync(archivo, 'utf-8').split('\n')

      for (let i = 0; i < lineas.length; i++) {
        const linea = lineas[i]
        if (!/resuelt/i.test(linea)) continue
        if (PATRONES_RESUELTO_PERMITIDOS.some((patron) => patron.test(linea))) continue

        expect.fail(
          `"resuelto" visible en ${archivo.replace(process.cwd(), '')}:${i + 1}\n  → ${linea.trim()}`
        )
      }
    })
  }
})
