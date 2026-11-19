import type { Access, FieldAccess, Where } from 'payload'

type Perfil = 'suporte' | 'admin'

const isEquipa = (user: { collection?: string } | null | undefined) => user?.collection === 'equipa'

/** Utilizador da equipa (suporte ou admin). */
export const equipaOnly: Access = ({ req: { user } }) => isEquipa(user)

/** Só o admin técnico da equipa. */
export const adminOnly: Access = ({ req: { user } }) =>
  isEquipa(user) && (user as { perfil?: Perfil } | null)?.perfil === 'admin'

/** Só o admin técnico da equipa (para permissões a nível de campo individual). */
export const adminOnlyField: FieldAccess = ({ req: { user } }) =>
  isEquipa(user) && (user as { perfil?: Perfil } | null)?.perfil === 'admin'

/** Qualquer utilizador com sessão iniciada (equipa, cliente ou profissional). */
export const authenticatedOnly: Access = ({ req: { user } }) => Boolean(user)

/** A equipa vê tudo; um cliente/profissional só vê o próprio registo. */
export const equipaOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isEquipa(user)) return true
  return { id: { equals: user.id } }
}

/** Permite acesso ao dono do documento (campo profissional) ou à equipa. */
export const equipaOrProfissionalOwner: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isEquipa(user)) return true
  if (user.collection === 'profissionais') {
    return { profissional: { equals: user.id } }
  }
  return false
}

/** Acesso para marcações: a equipa vê tudo, o cliente e o profissional vêem as suas próprias marcações. */
export const marcacaoParticipant: Access = ({ req: { user } }): boolean | Where => {
  if (!user) return false
  if (isEquipa(user)) return true
  if (user.collection === 'clientes') {
    return { cliente: { equals: user.id } }
  }
  if (user.collection === 'profissionais') {
    return { profissional: { equals: user.id } }
  }
  return false
}
