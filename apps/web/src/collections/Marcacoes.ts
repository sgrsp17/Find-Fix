import type { CollectionConfig } from 'payload'

import { adminOnly, authenticatedOnly, marcacaoParticipant } from '../access'

/** Marcações e Agendamentos de serviços entre Clientes e Profissionais. */
export const Marcacoes: CollectionConfig = {
  slug: 'marcacoes',
  labels: { singular: 'Marcação', plural: 'Marcações' },
  admin: {
    useAsTitle: 'servico',
    defaultColumns: ['servico', 'data', 'hora', 'cliente', 'profissional', 'estado'],
  },
  access: {
    create: authenticatedOnly,
    read: marcacaoParticipant,
    update: marcacaoParticipant,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'servico',
      type: 'text',
      label: 'Serviço a realizar',
      required: true,
    },
    {
      name: 'estado',
      type: 'select',
      label: 'Estado da marcação',
      required: true,
      defaultValue: 'pendente',
      options: [
        { label: 'Pendente', value: 'pendente' },
        { label: 'Confirmada', value: 'confirmada' },
        { label: 'Concluída', value: 'concluida' },
        { label: 'Cancelada', value: 'cancelada' },
      ],
    },
    {
      name: 'cliente',
      type: 'relationship',
      relationTo: 'clientes',
      label: 'Cliente',
      required: true,
    },
    {
      name: 'profissional',
      type: 'relationship',
      relationTo: 'profissionais',
      label: 'Profissional / Especialista',
      required: true,
    },
    {
      name: 'data',
      type: 'date',
      label: 'Data da marcação',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'hora',
      type: 'text',
      label: 'Hora (ex: 14:00)',
      required: true,
    },
    {
      name: 'localidade',
      type: 'text',
      label: 'Localidade',
      required: true,
    },
    {
      name: 'morada',
      type: 'text',
      label: 'Morada (Rua, número, andar)',
    },
    {
      name: 'descricao',
      type: 'textarea',
      label: 'Descrição do problema ou trabalho',
    },
    {
      name: 'notas',
      type: 'textarea',
      label: 'Notas adicionais / Informações úteis para a visita',
    },
    {
      name: 'precoPrevisto',
      type: 'number',
      label: 'Preço / Orçamento previsto (€)',
      min: 0,
    },
    {
      name: 'fotografias',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Fotografias do problema / local',
    },
  ],
}
