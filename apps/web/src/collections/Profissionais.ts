import type { CollectionConfig } from 'payload'

import { adminOnly, adminOnlyField, equipaOrSelf } from '../access'

/** Profissionais / Especialistas: entram pela app (JWT) e têm perfil público na plataforma. */
export const Profissionais: CollectionConfig = {
  slug: 'profissionais',
  labels: { singular: 'Profissional', plural: 'Profissionais' },
  admin: { useAsTitle: 'nome' },
  auth: { tokenExpiration: 60 * 60 * 24 * 7 },
  access: {
    admin: () => false,
    create: () => true, // registo aberto
    read: () => true, // clientes podem consultar profissionais e ver o perfil público
    update: equipaOrSelf,
    delete: adminOnly,
  },
  fields: [
    // -------------------------------------------------------------------------
    // Informações Pessoais
    // -------------------------------------------------------------------------
    {
      name: 'nome',
      type: 'text',
      label: 'Nome completo',
      required: true,
    },
    {
      name: 'telemovel',
      type: 'text',
      label: 'Telemóvel',
    },
    {
      name: 'dataNascimento',
      type: 'date',
      label: 'Data de nascimento',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'nacionalidade',
      type: 'text',
      label: 'Nacionalidade',
      defaultValue: 'Portugal',
    },
    {
      name: 'localizacao',
      type: 'text',
      label: 'Localização principal (ex: Lisboa)',
    },
    {
      name: 'fotoPerfil',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografia de perfil',
    },

    // -------------------------------------------------------------------------
    // Informações do Negócio e Atividade
    // -------------------------------------------------------------------------
    {
      name: 'titular',
      type: 'text',
      label: 'Titular do negócio / Nome fiscal',
    },
    {
      name: 'nif',
      type: 'text',
      label: 'NIF / NIPC',
    },
    {
      name: 'emailProfissional',
      type: 'email',
      label: 'Email profissional',
    },
    {
      name: 'areaTrabalho',
      type: 'select',
      label: 'Área de trabalho',
      options: [
        { label: 'Construção', value: 'construcao' },
        { label: 'Design de Interiores', value: 'design_interiores' },
      ],
    },
    {
      name: 'especialidade',
      type: 'text',
      label: 'Especialidade principal (ex: Eletricista, Canalizador, Designer)',
    },
    {
      name: 'competencias',
      type: 'array',
      label: 'Competências e tags de serviços',
      fields: [
        {
          name: 'nome',
          type: 'text',
          label: 'Competência',
          required: true,
        },
      ],
    },
    {
      name: 'raioDeslocacaoKm',
      type: 'number',
      label: 'Raio de deslocação (km)',
      min: 1,
      defaultValue: 20,
    },
    {
      name: 'areaServico',
      type: 'text',
      label: 'Zonas / Área de serviço (ex: Lisboa, Oeiras, Amadora)',
    },
    {
      name: 'morada',
      type: 'text',
      label: 'Morada comercial / Rua',
    },
    {
      name: 'numeroAndar',
      type: 'text',
      label: 'Número do andar (opcional)',
    },
    {
      name: 'numeroPorta',
      type: 'text',
      label: 'Número da porta (opcional)',
    },
    {
      name: 'codigoPostal',
      type: 'text',
      label: 'Código postal',
    },
    {
      name: 'documentos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Documentos e certidões da empresa',
    },
    {
      name: 'verificado',
      type: 'checkbox',
      label: 'Profissional verificado pela equipa',
      defaultValue: false,
      access: {
        update: adminOnlyField, // Só admins da equipa podem validar a documentação
      },
    },

    // -------------------------------------------------------------------------
    // Estatísticas e Classificação
    // -------------------------------------------------------------------------
    {
      name: 'classificacaoMedia',
      type: 'number',
      label: 'Classificação média (1 a 5)',
      min: 0,
      max: 5,
      defaultValue: 5,
      admin: {
        step: 0.1,
      },
    },
    {
      name: 'totalAvaliacoes',
      type: 'number',
      label: 'Total de avaliações',
      defaultValue: 0,
      min: 0,
    },
  ],
}
