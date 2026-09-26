export interface ConteoPorEstado {
  estado: string
  cantidad: number
}

// Fusiona el conteo de 'cerrado' dentro de 'resuelto' para los gráficos de estados.
// La DB sigue guardando ambos estados por separado; esto es solo presentación.
export function agruparCerradoConResuelto(datos: ConteoPorEstado[]): ConteoPorEstado[] {
  const cerrado = datos.find((d) => d.estado === 'cerrado')
  const tieneResuelto = datos.some((d) => d.estado === 'resuelto')

  const sinCerrado = datos
    .filter((d) => d.estado !== 'cerrado')
    .map((d) =>
      d.estado === 'resuelto' && cerrado ? { ...d, cantidad: d.cantidad + cerrado.cantidad } : d
    )

  if (cerrado && !tieneResuelto) {
    return [...sinCerrado, { estado: 'resuelto', cantidad: cerrado.cantidad }]
  }

  return sinCerrado
}
