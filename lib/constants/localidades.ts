// Barrios/zonas de Santa Fe Capital
export const BARRIOS_CAPITAL: string[] = [
  'Barrio Norte',
  'Barrio Sur',
  'Barrio Este',
  'Barrio Oeste',
  'Candioti Norte',
  'Candioti Sur',
  'Centro',
  'Chalet',
  'El Pozo',
  'Guadalupe',
  'La Guardia',
  'Las Flores',
  'Mayoraz',
  'Parque del Sur',
  'Parque Garay',
  'Parque Juan de Garay',
  'Rivadavia',
  'San Agustín',
  'San Lorenzo',
  'Santa Rosa de Lima',
  'Sindicatos',
  'Villa del Parque',
  'Villa Hipódromo',
  'Villa Oculta',
]

// Localidades por departamento (fuente oficial provincia de Santa Fe)
export const LOCALIDADES_POR_DEPARTAMENTO: Record<string, string[]> = {
  '9 de Julio': ['Esteban Rams', 'G. Perez de Denis', 'Gato Colorado', 'Juan de Garay', 'Logroño', 'Montefiore', 'Pozo Borrado', 'San Bernardo', 'Santa Margarita', 'Tostado', 'Villa Minetti'],
  'Belgrano': ['Armstrong', 'Bouquet', 'Las Parejas', 'Las Rosas', 'Montes de Oca', 'Tortugas'],
  'Caseros': ['Arequito', 'Arteaga', 'Berabevú', 'Bigand', 'Casilda', 'Chabás', 'Chañar Ladeado', 'Godeken', 'Los Molinos', 'Los Quirquinchos', 'San José de la Esquina', 'Sanford', 'Villada'],
  'Castellanos': ['Aldao', 'Angélica', 'Ataliva', 'Aurelia', 'Bauer y Sigel', 'Bella Italia', 'Bicha', 'Bigand', 'Castellanos', 'Clucellas', 'Colonia Cello', 'Colonia Iturraspe', 'Colonia Margarita', 'Colonia Maua', 'Colonia Raquel', 'Coronel Fraga', 'Egusquiza', 'Esmeralda', 'Estación Clucellas', 'Eusebia', 'Eustolia', 'Fidela', 'Frontera', 'Galisteo', 'Garibaldi', 'Hugentobler', 'Humberto Primo', 'Josefina', 'Lehmann', 'Maria Juana', 'Presidente Roca', 'Pueblo Marini', 'Rafaela', 'Ramona', 'Saguier', 'San Antonio', 'San Vicente', 'Santa Clara de Saguier', 'Sunchales', 'Susana', 'Tacural', 'Tacurales', 'Vila', 'Villa San Jose', 'Virginia', 'Zenón Pereyra'],
  'Constitución': ['Alcorta', 'Bombal', 'Cañada Rica', 'Cepeda', 'Emp. Villa Constitución', 'General Gelly', 'Godoy', 'Juan B. Molina', 'Juncal', 'La Vanguardia', 'Máximo Paz', 'Pavón', 'Pavón Arriba', 'Peyrano', 'Rueda', 'Santa Teresa', 'Sargento Cabral', 'Theobald', 'Villa Constitución'],
  'Garay': ['Cayastá', 'Colonia Mascías', 'Helvecia', 'Saladero M. Cabal', 'Santa Rosa de Calchines'],
  'General López': ['Aarón Castellanos', 'Amenabar', 'Cafferatta', 'Carmen', 'Carreras', 'Cañada del Ucle', 'Chapuy', 'Chovet', 'Christophersen', 'Diego de Alvear', 'Elortondo', 'Firmat', 'Hughes', 'La Chispa', 'Labordeboy', 'Lazzarino', 'Maggiolo', 'Maria Teresa', 'Melincué', 'Miguel Torres', 'Murphy', 'Rufino', 'San Eduardo', 'San Fco. de Santa Fe', 'San Gregorio', 'Sancti Spiritu', 'Santa Isabel', 'Teodelina', 'Venado Tuerto', 'Villa Cañas', 'Wheelwright'],
  'General Obligado': ['Arroyo Ceibal', 'Avellaneda', 'Berna', 'Campo Hardy', 'El Arazá', 'El Rabón', 'El Sombrerito', 'Florencia', 'Guadalupe Norte', 'Ing. Chanourdie', 'La Sarita', 'Lanteri', 'Las Garzas', 'Las Toscas', 'Los Laureles', 'Malabrigo', 'Nicanor E. Molinas', 'Reconquista', 'San Antonio de Obligado', 'Tacuarendí', 'Villa Ana', 'Villa Guillermina', 'Villa Ocampo'],
  'Iriondo': ['Bustinza', 'Carrizales', 'Cañada de Gomez', 'Clason', 'Correa', 'Lucio V. Lopez', 'Oliveros', 'Pueblo Andino', 'Salto Grande', 'Serodino', 'Totoras', 'Villa Eloísa'],
  'La Capital': ['Arroyo Aguiar', 'Arroyo Leyes', 'Cabal', 'Campo Andino', 'Candioti', 'Emilia', 'Laguna Paiva', 'Llambi Campbell', 'Monte Vera', 'Nelson', 'Recreo', 'San Jose del Rincón', 'Santa Fe', 'Santo Tome', 'Sauce Viejo'],
  'Las Colonias': ['Cavour', 'Colonia Rivadavia', 'Colonia San Jose', 'Cululú', 'Elisa', 'Empalme San Carlos', 'Esperanza', 'Felicia', 'Franck', 'Grutly', 'Hipatia', 'Humboldt', 'Ituzaingo', 'Jacinto L. Arauz', 'La Pelada', 'Las Tunas', 'Maria Luisa', 'Matilde', 'Nuevo Torino', 'Pilar', 'Progreso', 'Providencia', 'Pujato Norte', 'Sa Pereira', 'San Agustin', 'San Carlos Centro', 'San Carlos Norte', 'San Carlos Sud', 'San Jeronimo del Sauce', 'San Jerónimo Norte', 'San Mariano', 'Santa Clara de B. Vista', 'Santa María Centro', 'Santa María Norte', 'Santo Domingo', 'Sarmiento', 'Soutomayor'],
  'Rosario': ['Acebal', 'Albarellos', 'Alvarez', 'Alvear', 'Arminda', 'Arroyo Seco', 'Carmen del Sauce', 'Coronel Bogado', 'Coronel Dominguez', 'Fighiera', 'Funes', 'Gdero. Baigorria', 'General Lagos', 'Ibarlucea', 'Perez', 'Piñero', 'Pueblo Esther', 'Pueblo Muñoz', 'Rosario', 'Soldini', 'Uranga', 'Villa Amelia', 'Villa Gdor. Galvez', 'Zavalla'],
  'San Cristóbal': ['Aguara Grande', 'Ambrosetti', 'Arrufó', 'Capivara', 'Ceres', 'Col. Dos Rosas y La Legua', 'Colonia Ana', 'Colonia Bossi', 'Colonia La Cabral', 'Colonia Rosa', 'Constanza', 'Curupaytí', 'Hersilia', 'Huanqueros', 'La Clara', 'La Lucila', 'La Rubia', 'Las Avispas', 'Las Palmeras', 'Moises Ville', 'Monigotes', 'Monte Oscuridad', 'Palacios', 'Portugalete', 'San Cristobal', 'San Guillermo', 'Santurce', 'Soledad', 'Suardi', 'Villa Saralegui', 'Villa Trinidad', 'Ñanducita'],
  'San Javier': ['Alejandra', 'Cacique Ariacaiquín', 'Colonia Durán', 'Colonia Teresa', 'La Brava', 'Romang', 'San Javier'],
  'San Jerónimo': ['Arocena', 'Barrancas', 'Bernardo de Irigoyen', 'Campo Piaggio', 'Casalegno', 'Centeno', 'Coronda', 'Desvío Arijón', 'Diaz', 'Gaboto', 'Gessler', 'Gálvez', 'Irigoyen', 'Larrechea', 'Loma Alta', 'Lopez', 'Maciel', 'Monje', 'San Eugenio', 'San Fabián', 'San Genaro'],
  'San Justo': ['Angeloni', 'Cayastacito', 'Colonia Dolores', 'Colonia Esther', 'Colonia Silva', 'Gdor. Crespo', 'La Camila', 'La Criolla', 'La Penca y Caraguata', 'Marcelino Escalada', 'Naré', 'Pedro Gomez Cello', 'Ramayón', 'San Bernardo', 'San Justo', 'San Martín Norte', 'Vera y Pintado', 'Videla'],
  'San Lorenzo': ['Aldao', 'Capitán Bermudez', 'Carcarañá', 'Coronel Arnold', 'Fray Luis Beltrán', 'Fuentes', 'Luis Palacios', 'Puerto General San Martin', 'Pujato', 'Ricardone', 'Roldán', 'San Jerónimo Sur', 'San Lorenzo', 'Timbúes', 'Villa Mugueta'],
  'San Martín': ['Carlos Pellegrini', 'Casas', 'Castelar', 'Cañada Rosquín', 'Colonia Belgrano', 'Crispi', 'El Trébol', 'Landeta', 'Las Bandurrias', 'Las Petacas', 'Los Cardos', 'Maria Susana', 'Piamonte', 'San Jorge', 'San Martín de las Escobas', 'Sastre', 'Traill'],
  'Vera': ['Calchaquí', 'Cañada Ombú', 'Fortín Olmos', 'Garabato', 'Golondrina', 'Intiyaco', 'La Gallareta', 'Los Amores', 'Los Tábanos', 'Margarita', 'Tartagal', 'Toba', 'Vera'],
}

// Array plano de todas las localidades de la provincia (sin Santa Fe Capital)
// Para el selector de localidad cuando el usuario no es de capital
export const LOCALIDADES_PROVINCIA: string[] = Object.values(LOCALIDADES_POR_DEPARTAMENTO)
  .flat()
  .filter((loc, index, arr) => arr.indexOf(loc) === index) // deduplicar
  .sort((a, b) => a.localeCompare(b, 'es'))

// Array plano con todas las localidades de la provincia (para combobox de búsqueda general)
export const TODAS_LAS_LOCALIDADES: string[] = LOCALIDADES_PROVINCIA

// Para el formulario de perfil y nueva consulta:
// Si localidad_tipo = 'capital' → usar BARRIOS_CAPITAL
// Si localidad_tipo = 'provincia' → usar LOCALIDADES_PROVINCIA
// Para detectar el departamento de una localidad:
export function getDepartamento(localidad: string): string | null {
  for (const [depto, localidades] of Object.entries(LOCALIDADES_POR_DEPARTAMENTO)) {
    if (localidades.some((l) => l.toLowerCase() === localidad.toLowerCase())) {
      return depto
    }
  }
  return null
}
