export type GeneralProfile = {
  entityType: 1 | 2
  firstName: string
  lastName: string
  companyName: string
  countryGuid: string
  nationalCode: string
  passportNumber: string
  companyNationalId: string
  phoneNumbers: string[]
  contactEmail?: string
  websiteUrl?: string
  ceoName: string
  address?: string
}
