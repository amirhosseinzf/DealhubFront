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
  approvalStatusDisplayName?: string
  profilePicUrl?: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  nationalCardScanUrl?: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  passportScanUrl?: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  registrationCertificateScanUrl?: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
}
