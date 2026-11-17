import type { CollectionConfig } from 'payload'

import { adminOnly, authenticatedOnly } from '../access'

/** Diagnósticos e análises geradas pelo assistente de Inteligência Artificial. */
export const Diagnosticos: CollectionConfig = {
  slug: 'diagnosticos',
  labels: { singular: 'Diagnóstico IA', plural: 'Diagnósticos IA' },
  admin: {
    useAsTitle: 'problemaDescrito',
    defaultColumns: ['problemaDescrito', 'area', 'urgencia', 'cliente', 'createdAt'],
  },
  access: {
    create: authenticatedOnly,
    read: authenticatedOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'cliente',
      type: 'relationship',
      relationTo: 'clientes',
      label: 'Cliente',
      required: true,
    },
    {
      name: 'area',
      type: 'select',
      label: 'Área do problema',
      required: true,
      options: [
        { label: 'Construção / Reparação', value: 'construcao' },
        { label: 'Design de Interiores / Remodelação', value: 'interiores' },
      ],
    },
    {
      name: 'problemaDescrito',
      type: 'textarea',
      label: 'Descrição fornecida pelo cliente',
      required: true,
    },
    {
      name: 'fotografias',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Fotografias do problema',
    },
    {
      name: 'urgencia',
      type: 'select',
      label: 'Nível de urgência avaliado',
      options: [
        { label: 'Baixa', value: 'low' },
        { label: 'Média', value: 'medium' },
        { label: 'Alta', value: 'high' },
      ],
    },
    {
      name: 'causasProvaveis',
      type: 'array',
      label: 'Causas prováveis identificadas pela IA',
      fields: [
        {
          name: 'descricao',
          type: 'text',
          label: 'Causa',
          required: true,
        },
      ],
    },
    {
      name: 'precoMinimo',
      type: 'number',
      label: 'Estimativa mínima de preço (€)',
    },
    {
      name: 'precoMaximo',
      type: 'number',
      label: 'Estimativa máxima de preço (€)',
    },
    {
      name: 'especialidadeRecomendada',
      type: 'text',
      label: 'Especialidade recomendada (ex: Eletricista, Canalizador)',
    },
  ],
}
