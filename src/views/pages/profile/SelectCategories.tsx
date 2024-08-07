import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'
import { ProfileContext } from 'src/context/ProfileContext'
import { ManageProductCategories } from 'src/types/manageProductCategories'

type Props = {
  roleTitle: string
  disabled?: boolean
}

function SelectCategories({ roleTitle, disabled = false }: Props) {
  const { setPendingProfileForm, pendingProfileForm } = useContext(ProfileContext)
  debugger
  const [productCategory, setProductCategory] = useState([])
  const [selectedValues, setSelectedValues] = useState(
    pendingProfileForm
      ? pendingProfileForm[roleTitle] != null
        ? pendingProfileForm[roleTitle].productCategories
        : []
      : []
  )
  useEffect(() => {
    async function getEnum() {
      axiosInterceptorInstance.get(apiUrl.getProductCategory).then(({ data }) => {
        setProductCategory(data.items)
      })
    }
    getEnum()
  }, [])

  const handleSaveProductCategories = (value: string[]) => {
    if (pendingProfileForm) {
      setPendingProfileForm({
        ...pendingProfileForm,
        [roleTitle]: { productCategories: [...value] }
      })
    }
  }
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
          handleSaveProductCategories(newValue.map(val => val.globalId))
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
      <CardHeader title={disabled ? `Your Selected ${roleTitle}` : `Select Your ${roleTitle} Categories : `} />
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

export default SelectCategories
