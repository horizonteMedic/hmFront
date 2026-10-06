// Opciones de presentación de un medicamento, agrupadas por vía de administración (para el autocompletado).
export const PRESENTACIONES_OPTIONS = [
  {
    group: '💊 Sólidas',
    items: ['Tableta / comprimido', 'Cápsula', 'Gragea', 'Polvo', 'Granulado', 'Pastilla', 'Tableta masticable', 'Tableta sublingual', 'Tableta efervescente']
  },
  {
    group: '🧴 Líquidas',
    items: ['Jarabe', 'Solución oral', 'Suspensión', 'Gotas', 'Emulsión', 'Elixir']
  },
  {
    group: '💉 Inyectables',
    items: ['Ampolla', 'Vial / frasco ampolla', 'Jeringa prellenada', 'Solución inyectable', 'Suspensión inyectable']
  },
  {
    group: '🧴 Uso tópico (piel)',
    items: ['Crema', 'Pomada', 'Ungüento', 'Gel', 'Loción', 'Pasta', 'Spray']
  },
  {
    group: '👁️ Otras vías',
    items: [
      'Oftálmica: gotas o solución ocular',
      'Ótica: gotas para los oídos',
      'Nasal: gotas o spray nasal',
      'Rectal: supositorio o enema',
      'Vaginal: óvulo, crema o gel vaginal',
      'Inhalatoria: inhalador, aerosol o nebulización',
      'Transdérmica: parche'
    ]
  }
];
