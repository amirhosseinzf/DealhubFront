// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

import apiUrl from 'src/configs/api'

import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import { ActiveProfileData, PendingProfileData, ProfileValuesType } from 'src/types/forms/profile'

// ** Types

// ** Defaults
const defaultProvider: ProfileValuesType = {
  loadingForm: true,
  setLoadingForm: () => Boolean,
  activeProfileForm: null,
  pendingProfileForm: null,
  setActiveProfileForm: () => null,
  setPendingProfileForm: () => null,
  getData: () => null
}

const ProfileContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const ProfileProvider = ({ children }: Props) => {
  // ** States
  const [activeProfileForm, setActiveProfileForm] = useState<ActiveProfileData | null>(null)
  const [pendingProfileForm, setPendingProfileForm] = useState<PendingProfileData | null>(null)
  const [loadingForm, setLoadingForm] = useState<boolean>(defaultProvider.loadingForm)

  // ** Hooks
  const getData = async (): Promise<void> => {
    await axiosInterceptorInstance
      .get(apiUrl.getCurrentProfile)
      .then(async ({ data }) => {
        setLoadingForm(false)
        setActiveProfileForm(data.activeProfile)
        setPendingProfileForm(data.pendingProfile)
      })
      .finally(() => {
        setLoadingForm(false)
      })
  }

  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const values = {
    activeProfileForm,
    pendingProfileForm,
    loadingForm,
    setLoadingForm,
    setActiveProfileForm,
    setPendingProfileForm,
    getData
  }

  return <ProfileContext.Provider value={values}>{children}</ProfileContext.Provider>
}

export { ProfileContext, ProfileProvider }
