import { yupResolver } from '@hookform/resolvers/yup'
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import * as yup from 'yup'

type Props = {}
type ProductCategoryType = {
  globalId: string
  status: string
  lastModifyDate: string
  name: string
  displayOrder: number
  isDefault: boolean
}

const schema = yup.object({
  name: yup.string().required()
})

const ProductCategoryAdd = (props: Props) => {
  const router = useRouter()
  const id = router.query.id
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: async () => (await axiosInterceptorInstance.get(`/api/ProductCategory/${id}`)).data,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const submitForm = async (data: ProductCategoryType) => {
    axiosInterceptorInstance.put(`/api/ProductCategory/Edit`, { globalId: data.globalId, command: data }).then(() => {
      toast.success('suucessfully deleted')
      router.back()
    })
  }

  return (
    <>
      <Button sx={{ margin: '10px' }} onClick={() => router.back()} variant='contained' color='primary'>
        back
      </Button>
      <Card>
        <CardHeader title='Edit Product Category' />
        <CardContent>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(submitForm)}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Name'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.name)}
                        placeholder='Name'
                      />
                    )}
                  />
                  {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='displayOrder'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        type='number'
                        label='Display Order'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.displayOrder)}
                        placeholder='Display Order'
                      />
                    )}
                  />
                  {errors.displayOrder && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.displayOrder.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Controller
                      name='isDefault'
                      control={control}
                      defaultValue={false}
                      render={({ field: { value, onChange } }) => (
                        <Checkbox checked={value} onChange={e => onChange(e.target.checked)} color='primary' />
                      )}
                    />
                  }
                  label='Is Default'
                />
              </Grid>
            </Grid>
            <Button type='submit' variant='contained' color='primary'>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
ProductCategoryAdd.acl = {
  action: 'read',
  subject: 'manage-profiles'
}
export default ProductCategoryAdd
