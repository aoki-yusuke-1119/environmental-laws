import { atom } from 'jotai'

export type CurrentUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
  username?: string
} | null

export const currentUserAtom = atom<CurrentUser>(null)
