import { describe, it, expect } from 'vitest'
import {
  BARRIOS_CAPITAL,
  LOCALIDADES_PROVINCIA,
  LOCALIDADES_POR_DEPARTAMENTO,
  getDepartamento,
} from '@/lib/constants/localidades'

describe('BARRIOS_CAPITAL', () => {
  it('tiene al menos 10 barrios', () => {
    expect(BARRIOS_CAPITAL.length).toBeGreaterThanOrEqual(10)
  })

  it('no tiene duplicados', () => {
    const unicos = new Set(BARRIOS_CAPITAL)
    expect(unicos.size).toBe(BARRIOS_CAPITAL.length)
  })

  it('no contiene nombres de departamentos de provincia', () => {
    // "San Lorenzo" es una coincidencia real: existe como barrio de Santa Fe
    // Capital y, por separado, como departamento de la provincia (cerca de
    // Rosario). No es un error de datos — se excluye explícitamente acá.
    const COINCIDENCIAS_CONOCIDAS = ['San Lorenzo']
    const departamentos = Object.keys(LOCALIDADES_POR_DEPARTAMENTO)
    for (const barrio of BARRIOS_CAPITAL) {
      if (COINCIDENCIAS_CONOCIDAS.includes(barrio)) continue
      expect(departamentos).not.toContain(barrio)
    }
  })
})

describe('LOCALIDADES_PROVINCIA', () => {
  it('tiene más de 200 localidades', () => {
    expect(LOCALIDADES_PROVINCIA.length).toBeGreaterThan(200)
  })

  it('incluye Rosario', () => {
    expect(LOCALIDADES_PROVINCIA).toContain('Rosario')
  })

  it('incluye Rafaela', () => {
    expect(LOCALIDADES_PROVINCIA).toContain('Rafaela')
  })

  it('incluye Reconquista', () => {
    expect(LOCALIDADES_PROVINCIA).toContain('Reconquista')
  })

  it('incluye Santa Fe', () => {
    expect(LOCALIDADES_PROVINCIA).toContain('Santa Fe')
  })

  it('no tiene duplicados', () => {
    const unicos = new Set(LOCALIDADES_PROVINCIA)
    expect(unicos.size).toBe(LOCALIDADES_PROVINCIA.length)
  })

  it('está ordenado alfabéticamente', () => {
    const ordenado = [...LOCALIDADES_PROVINCIA].sort((a, b) => a.localeCompare(b, 'es'))
    expect(LOCALIDADES_PROVINCIA).toEqual(ordenado)
  })
})

describe('LOCALIDADES_POR_DEPARTAMENTO', () => {
  it('tiene 19 departamentos', () => {
    expect(Object.keys(LOCALIDADES_POR_DEPARTAMENTO).length).toBe(19)
  })

  it('el departamento La Capital incluye Santa Fe', () => {
    expect(LOCALIDADES_POR_DEPARTAMENTO['La Capital']).toContain('Santa Fe')
  })

  it('el departamento Rosario incluye Rosario', () => {
    expect(LOCALIDADES_POR_DEPARTAMENTO['Rosario']).toContain('Rosario')
  })

  it('ningún departamento tiene array vacío', () => {
    for (const [depto, localidades] of Object.entries(LOCALIDADES_POR_DEPARTAMENTO)) {
      expect(localidades.length, `${depto} no tiene localidades`).toBeGreaterThan(0)
    }
  })
})

describe('getDepartamento', () => {
  it('retorna el departamento correcto para Rosario', () => {
    expect(getDepartamento('Rosario')).toBe('Rosario')
  })

  it('retorna el departamento correcto para Rafaela', () => {
    expect(getDepartamento('Rafaela')).toBe('Castellanos')
  })

  it('retorna el departamento correcto para Reconquista', () => {
    expect(getDepartamento('Reconquista')).toBe('General Obligado')
  })

  it('retorna el departamento correcto para Santa Fe', () => {
    expect(getDepartamento('Santa Fe')).toBe('La Capital')
  })

  it('retorna null para una localidad que no existe', () => {
    expect(getDepartamento('Ciudad Inexistente')).toBeNull()
  })

  it('es case-insensitive', () => {
    expect(getDepartamento('rosario')).toBe('Rosario')
    expect(getDepartamento('RAFAELA')).toBe('Castellanos')
  })
})
