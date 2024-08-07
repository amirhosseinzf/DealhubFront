import { AbilityBuilder, Ability } from '@casl/ability'
import { UserRoles } from 'src/context/types'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (userRoles: [UserRoles], subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  if (userRoles.length) {
    userRoles.forEach(element => {
      if (element.code === 'admin') {
        can('manage', 'all')
      } else if (element.code === 'client') {
        can(['read'], 'acl-page')
      } else if (element.code === 'CreateProfile') {
        can(['read'], ['profile-info'])
      } else if (element.code === 'ManageProfiles') {
        can(['read'], ['manage-profiles'])
      } else if (element.code === 'Expert' || element.code === 'ProcessAdmin') {
        can(['read'], ['grade-controller'])
      } else {
        can(['read', 'create', 'update', 'delete'], subject)
      }
    })
  } else {
    can('read', 'verify-email')
  }

  return rules
}

export const buildAbilityFor = (userRoles: [UserRoles], subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(userRoles, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
