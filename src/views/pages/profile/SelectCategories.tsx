import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'
import { ProfileContext } from 'src/context/ProfileContext'
import { ManageProductCategories } from 'src/types/manageProductCategories'

type Props = {
  roleTitle: string
}

function SelectCategories({ roleTitle }: Props) {
  const { setPendingProfileForm, pendingProfileForm } = useContext(ProfileContext)

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
    const currentValue: string[] = productCategory.filter((obj: ManageProductCategories) =>
      selectedValues.includes(obj.globalId)
    )

    return (
      <Autocomplete
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
            placeholder={`select your ${roleTitle}`}
          />
        )}
      ></Autocomplete>
    )
  }

  return (
    <Card>
      <CardHeader title={`Select Your ${roleTitle} Categories : `} />
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
