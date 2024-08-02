import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'
import { ManageProductCategories } from 'src/types/manageProductCategories'

type ServerData = {
  changeRequestGuid: string
  userAccountGuid: string
  approvalStatus: 0
  approvalStatusDisplayName: string
  createDate: string
  sendDate: string
  evaluationDate: string
  generalProfile: {
    entityType: 1
    firstName: string
    lastName: string
    companyName: string
    countryGuid: string
    nationalCode: string
    passportNumber: string
    companyNationalId: string
    phoneNumbers: string[]
    contactEmail: string
    websiteUrl: string
    ceoName: string
    address: string
  }
  buyerProfile: {
    productCategories: [string]
  }
  expertProfile: {
    productCategories: [string]
  }
  salesRepProfile: {
    productCategories: [string]
  }
  supplierProfile: {
    productCategories: [string]
  }
  trusteeProfile: {
    productCategories: [string]
  }
  profilePicUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  nationalCardScanUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  passportScanUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  registrationCertificateScanUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  username: string
  email: string
  entityDisplayName: string
}
type Props = {
  serverData: ServerData
  roleTitle: string
  disabled?: boolean
}

function ShowCategories({ serverData, roleTitle, disabled = false }: Props) {
  debugger
  const [productCategory, setProductCategory] = useState([])
  const [selectedValues, setSelectedValues] = useState(
    serverData ? (serverData[roleTitle] != null ? serverData[roleTitle].productCategories : []) : []
  )
  useEffect(() => {
    async function getEnum() {
      axiosInterceptorInstance.get(apiUrl.getProductCategory).then(({ data }) => {
        setProductCategory(data.items)
      })
    }
    getEnum()
  }, [])

  const renderAutocomplete = () => {
    debugger
    const currentValue: string[] = productCategory.filter((obj: ManageProductCategories) =>
      selectedValues.includes(obj.globalId)
    )

    return (
      <Autocomplete
        disabled={disabled}
        value={currentValue}
        multiple
        onChange={(event, newValue) => {
          setSelectedValues(newValue.map(val => val.globalId))
        }}
        options={productCategory}
        getOptionLabel={(option: any) => option.name}
        isOptionEqualToValue={(option, value) => option.globalId === value.globalId}
        renderInput={params => (
          <TextField
            {...params}
            label={`${roleTitle}`}
            InputProps={{
              ...params.InputProps
            }}
            placeholder={disabled ? `Your Selected ${roleTitle}` : `select your ${roleTitle}`}
          />
        )}
      ></Autocomplete>
    )
  }

  return (
    <Card>
      <CardHeader title={`Selected ${roleTitle}`} />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            {renderAutocomplete()}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ShowCategories
