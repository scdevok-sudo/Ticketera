import { describe, it, expect } from 'vitest'
import { agruparCerradoConResuelto } from '@/lib/utils/agrupar-cerrado-resuelto'

describe('agruparCerradoConResuelto', () => {
  it('suma cerrado dentro de resuelto y elimina la entrada de cerrado', () => {
    const datos = [
      { estado: 'nuevo', cantidad: 2 },
      { estado: 'resuelto', cantidad: 5 },
      { estado: 'cerrado', cantidad: 3 },
    ]

    const resultado = agruparCerradoConResuelto(datos)

    expect(resultado).toEqual([
      { estado: 'nuevo', cantidad: 2 },
      { estado: 'resuelto', cantidad: 8 },
    ])
  })

  it('no modifica los datos si no hay entrada para cerrado', () => {
    const datos = [
      { estado: 'nuevo', cantidad: 2 },
      { estado: 'resuelto', cantidad: 5 },
    ]

    const resultado = agruparCerradoConResuelto(datos)

    expect(resultado).toEqual(datos)
  })

  it('crea una entrada resuelto con el count de cerrado si no hay resuelto', () => {
    const datos = [
      { estado: 'nuevo', cantidad: 2 },
      { estado: 'cerrado', cantidad: 3 },
    ]

    const resultado = agruparCerradoConResuelto(datos)

    expect(resultado).toEqual([
      { estado: 'nuevo', cantidad: 2 },
      { estado: 'resuelto', cantidad: 3 },
    ])
  })

  it('no modifica los datos si no hay ni resuelto ni cerrado', () => {
    const datos = [
      { estado: 'nuevo', cantidad: 2 },
      { estado: 'en_revision', cantidad: 4 },
    ]

    const resultado = agruparCerradoConResuelto(datos)

    expect(resultado).toEqual(datos)
  })
})
