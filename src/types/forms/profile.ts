export type GeneralProfile = {
  entityType: 1 | 2
  firstName: string
  lastName: string
  companyName: string
  countryGuid: string
  nationalCode: string
  passportNumber: string
  companyNationalId: string
  phoneNumbers?: string[]
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
export type ActiveProfileData = {
  generalProfile: {
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
  expertProfile: {
    productCategories: [
      {
        productCategoryGuid: string
        productCategoryName: string
        currentGrade: number
        lastGradeDate: string
      }
    ]
  }
  buyerProfile: {
    productCategories: [
      {
        productCategoryGuid: string
        productCategoryName: string
        currentGrade: number
        lastGradeDate: string
      }
    ]
  }
  supplierProfile: {
    productCategories: [
      {
        productCategoryGuid: string
        productCategoryName: string
        currentGrade: number
        lastGradeDate: string
      }
    ]
  }
  trusteeProfile: {
    productCategories: [
      {
        productCategoryGuid: string
        productCategoryName: string
        currentGrade: number
        lastGradeDate: string
      }
    ]
  }
  salesRepProfile: {
    productCategories: [
      {
        productCategoryGuid: string
        productCategoryName: string
        currentGrade: number
        lastGradeDate: string
      }
    ]
  }
}
export type PendingProfileData = {
  changeRequestGuid?: string
  userAccountGuid?: string
  approvalStatus?: 1 | 2 | 3 | 4
  approvalStatusDisplayName?: string
  rejectionReason?: string
  createDate?: string
  sendDate?: string
  evaluationDate?: string
  generalProfile: {
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
  buyerProfile?: {
    productCategories: string[]
  }
  expertProfile?: {
    productCategories: string[]
  }
  salesRepProfile?: {
    productCategories: string[]
  }
  supplierProfile?: {
    productCategories: string[]
  }
  trusteeProfile?: {
    productCategories: string[]
  }
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
export type ProfileValuesType = {
  loadingForm: boolean
  setLoadingForm: (value: boolean) => void
  getData: () => void
  activeProfileForm: ActiveProfileData | null
  pendingProfileForm: PendingProfileData | null
  setActiveProfileForm: (value: ActiveProfileData | null) => void
  setPendingProfileForm: (value: PendingProfileData | null) => void
}
export type ServerData = {
  activeProfile: ActiveProfileData | null
  pendingProfile: PendingProfileData | null
}
