import type { Access } from 'payload'

type Perfil = 'suporte' | 'admin'

const isEquipa = (user: { collection?: string } | null | undefined) => user?.collection === 'equipa'

/** Utilizador da equipa (suporte ou admin). */
export const equipaOnly: Access = ({ req: { user } }) => isEquipa(user)

/** Só o admin técnico da equipa. */
export const adminOnly: Access = ({ req: { user } }) =>
  isEquipa(user) && (user as { perfil?: Perfil } | null)?.perfil === 'admin'

/** A equipa vê tudo; um cliente/profissional só vê o próprio registo. */
export const equipaOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isEquipa(user)) return true
  return { id: { equals: user.id } }
}
