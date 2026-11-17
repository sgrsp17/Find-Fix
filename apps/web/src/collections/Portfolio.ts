import type { CollectionConfig } from 'payload'

import { authenticatedOnly, equipaOrProfissionalOwner } from '../access'

/** Portfólio de projetos realizados pelos Profissionais. */
export const Portfolio: CollectionConfig = {
  slug: 'portfolio',
  labels: { singular: 'Projeto do Portfólio', plural: 'Portfólio' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: [
      'titulo',
      'profissional',
      'servicoEspecialidade',
      'localidade',
      'dataConclusao',
    ],
  },
  access: {
    read: () => true, // Visível no perfil público do profissional
    create: authenticatedOnly,
    update: equipaOrProfissionalOwner,
    delete: equipaOrProfissionalOwner,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      label: 'Título do trabalho',
      required: true,
    },
    {
      name: 'profissional',
      type: 'relationship',
      relationTo: 'profissionais',
      label: 'Profissional',
      required: true,
    },
    {
      name: 'servicoEspecialidade',
      type: 'text',
      label: 'Serviço / Especialidade realizada',
      required: true,
    },
    {
      name: 'descricao',
      type: 'textarea',
      label: 'Descrição do trabalho e resultado final',
    },
    {
      name: 'localidade',
      type: 'text',
      label: 'Localidade',
    },
    {
      name: 'dataConclusao',
      type: 'date',
      label: 'Data de conclusão',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'fotografias',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Fotografias do projeto',
    },
  ],
}
