import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LocalidadSelect } from '@/components/ciudadano/localidad-select'

const OPTIONS = ['Rosario', 'Santa Fe', 'Rafaela', 'Reconquista']

describe('LocalidadSelect', () => {
  it('renderiza el input con placeholder', () => {
    render(
      <LocalidadSelect
        name="localidad"
        value=""
        onChange={() => {}}
        options={OPTIONS}
        placeholder="Buscá tu localidad"
      />
    )
    expect(screen.getByPlaceholderText('Buscá tu localidad')).toBeInTheDocument()
  })

  it('muestra las opciones al hacer foco', () => {
    render(
      <LocalidadSelect
        name="localidad"
        value=""
        onChange={() => {}}
        options={OPTIONS}
      />
    )
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    expect(screen.getByText('Rosario')).toBeInTheDocument()
    expect(screen.getByText('Santa Fe')).toBeInTheDocument()
  })

  it('filtra las opciones al escribir', () => {
    render(
      <LocalidadSelect
        name="localidad"
        value=""
        onChange={() => {}}
        options={OPTIONS}
      />
    )
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'rosa' } })
    expect(screen.getByText('Rosario')).toBeInTheDocument()
    expect(screen.queryByText('Rafaela')).not.toBeInTheDocument()
  })

  it('llama a onChange con el valor correcto al seleccionar', () => {
    const handleChange = vi.fn()
    render(
      <LocalidadSelect
        name="localidad"
        value=""
        onChange={handleChange}
        options={OPTIONS}
      />
    )
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    const option = screen.getByText('Rosario')
    fireEvent.mouseDown(option)
    expect(handleChange).toHaveBeenCalledWith('Rosario')
  })

  it('el input hidden tiene el value correcto', () => {
    render(
      <LocalidadSelect
        name="localidad"
        value="Rosario"
        onChange={() => {}}
        options={OPTIONS}
      />
    )
    const hidden = document.querySelector('input[type="hidden"][name="localidad"]')
    expect(hidden).toHaveValue('Rosario')
  })

  it('muestra "Sin resultados" cuando no hay coincidencias', () => {
    render(
      <LocalidadSelect
        name="localidad"
        value=""
        onChange={() => {}}
        options={OPTIONS}
      />
    )
    const input = screen.getByRole('combobox')
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'xyz123' } })
    expect(screen.getByText('Sin resultados')).toBeInTheDocument()
  })
})
