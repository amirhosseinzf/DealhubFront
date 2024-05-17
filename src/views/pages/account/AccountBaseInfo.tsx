import * as yup from 'yup'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormControl,
  TextField,
  FormHelperText,
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Autocomplete,
  Box,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material'
import apiUrl from 'src/configs/api'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import { GeneralProfile } from 'src/types/forms/profile'
import Icon from 'src/@core/components/icon'

const schema = yup.object({
  entityType: yup.number(),
  phoneNumbers: yup
    .array()
    .required('Must have at least one phone number')
    .of(yup.string().required('Phone number is required'))
    .min(1, 'Must have at least one phone number'),
  contactEmail: yup.string().email(),
  countryGuid: yup.string().required('Country is a required field'),
  firstName: yup.string().when('entityType', {
    is: (value: any) => value == 2,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  lastName: yup.string().when('entityType', {
    is: (value: any) => value == 2,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  nationalCode: yup.string().when(['entityType', 'countryGuid'], {
    is: (value: any) => value[0] == 2 && value[1] == 'f27dc5b6-de42-44cf-8449-69cacb74e612',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  passportNumber: yup.string().when('countryGuid', {
    is: (value: any) => value != 'f27dc5b6-de42-44cf-8449-69cacb74e612',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  companyName: yup.string().when('entityType', {
    is: (value: any) => value == 1,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  ceoName: yup.string().when('entityType', {
    is: (value: any) => value == 1,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  companyNationalId: yup.string().when(['entityType', 'countryGuid'], {
    is: (value: any) => value[0] == 1 && value[1] == 'f27dc5b6-de42-44cf-8449-69cacb74e612',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  })
})

type Props = {
  defaultValue: GeneralProfile
  onSubmit: (value: GeneralProfile) => void
}

function AccountBaseInfo({ onSubmit }: Props) {
  const [countryData, setCountryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // const getEnum = () => {
  //   axiosInterceptorInstance.get(apiUrl.getCountry).then(({ data }) => {
  //     setCountryData(data.items)
  //   })
  // }

  useEffect(() => {
    async function getEnum() {
      axiosInterceptorInstance.get(apiUrl.getCountry).then(({ data }) => {
        setCountryData(data.items)
        setIsLoading(false)
      })
    }
    getEnum()
  }, [])

  const {
    watch,
    control,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: async () => {
      const { data } = await axiosInterceptorInstance.get(apiUrl.getCurrentProfile)
      if (data.pendingProfile == null) {
        return {
          entityType: 1,
          firstName: '',
          lastName: '',
          companyName: '',
          countryGuid: '',
          nationalCode: '',
          passportNumber: '',
          companyNationalId: '',
          phoneNumbers: [],
          contactEmail: '',
          websiteUrl: '',
          ceoName: '',
          address: ''
        }
      }

      return data.pendingProfile.generalProfile
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phoneNumbers'
  })

  const submitForm = (data: GeneralProfile) => {
    onSubmit(data)
  }

  return (
    <Card>
      <CardHeader title='Your Profile' />
      {isLoading && (
        <CardContent>
          <CircularProgress />
        </CardContent>
      )}
      {!isLoading && (
        <CardContent>
          <form noValidate autoComplete='off' onSubmit={handleSubmit(submitForm)}>
            <Grid container spacing={2}>
              <Grid item md={12}>
                <FormControl>
                  <FormLabel id='demo-row-radio-buttons-group-label'>you are ?</FormLabel>
                  <Controller
                    name='entityType'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <RadioGroup
                        value={value}
                        onChange={onChange}
                        row
                        aria-labelledby='demo-row-radio-buttons-group-label'
                        name='entityType'
                      >
                        <FormControlLabel value={1} control={<Radio />} label='Juridical' />
                        <FormControlLabel value={2} control={<Radio />} label='Natural' />
                      </RadioGroup>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='countryGuid'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => {
                      debugger
                      const currentValue: any = countryData.find((val: any) => val.globalId == value)

                      return (
                        <Autocomplete
                          value={currentValue}
                          onChange={(event, newValue) => {
                            onChange(newValue ? newValue.globalId : null)
                          }}
                          onBlur={onBlur}
                          getOptionLabel={(option: any) => option.name}
                          disablePortal
                          options={countryData}
                          renderOption={(props, option) => (
                            <Box component='li' sx={{ '& > img': { mr: 4, flexShrink: 0 } }} {...props}>
                              <img
                                alt=''
                                width='20'
                                loading='lazy'
                                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                              />
                              {option.name} ({option.code}) {option.dialCode}
                            </Box>
                          )}
                          renderInput={params => (
                            <TextField
                              {...params}
                              label='Country'
                              InputProps={{
                                ...params.InputProps
                              }}
                              placeholder='Search your country'
                              error={!!errors.countryGuid}
                              helperText={errors.countryGuid?.message}
                            />
                          )}
                        />
                      )
                    }}
                  />
                </FormControl>
              </Grid>
              {watch('entityType') == 2 && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='firstName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='first Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.firstName)}
                            placeholder='first Name'
                          />
                        )}
                      />
                      {errors.firstName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.firstName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='lastName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='last Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.lastName)}
                            placeholder='last Name'
                          />
                        )}
                      />
                      {errors.lastName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.lastName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  {watch('countryGuid') == 'f27dc5b6-de42-44cf-8449-69cacb74e612' && (
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth sx={{ mb: 4 }}>
                        <Controller
                          name='nationalCode'
                          control={control}
                          rules={{ required: true }}
                          render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                              label='national Code'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.nationalCode)}
                              placeholder='national Code'
                            />
                          )}
                        />
                        {errors.nationalCode && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.nationalCode.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='passportNumber'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Passport Number'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.passportNumber)}
                            placeholder='Passport Number'
                          />
                        )}
                      />
                      {errors.passportNumber && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.passportNumber.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}
              {watch('entityType') == 1 && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='companyName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='company Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.companyName)}
                            placeholder='company Name'
                          />
                        )}
                      />
                      {errors.companyName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.companyName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='companyNationalId'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='Company National Id'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.companyNationalId)}
                            placeholder='Company National Id'
                          />
                        )}
                      />
                      {errors.companyNationalId && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.companyNationalId.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='ceoName'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            label='CeoName'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.ceoName)}
                            placeholder='Ceo Name'
                          />
                        )}
                      />
                      {errors.ceoName && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.ceoName.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='contactEmail'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.contactEmail)}
                        placeholder='Email'
                      />
                    )}
                  />
                  {errors.contactEmail && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.contactEmail.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='websiteUrl'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Web Site'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.websiteUrl)}
                        placeholder='Web Site'
                      />
                    )}
                  />
                  {errors.websiteUrl && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.websiteUrl.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth sx={{ mb: 4 }}>
                  <Controller
                    name='address'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        label='Address'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.address)}
                        placeholder='Address'
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {fields.map((item, index) => (
                <Grid item xs={12} md={4} key={item.id}>
                  <TextField
                    label='PhoneNumber'
                    {...register(`phoneNumbers.${index}` as const)}
                    helperText='Enter Phone Number with Code'
                    placeholder='for example +989121234567'
                    defaultValue={item} // Make sure to set up the default value
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton
                            color='error'
                            aria-label='toggle password visibility'
                            onClick={() => remove(index)}
                            edge='end'
                          >
                            <Icon icon='mdi:delete-outline' />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    error={Boolean(errors.phoneNumbers?.[index])}
                  />
                  {errors.phoneNumbers?.[index] && (
                    <FormHelperText>{errors.phoneNumbers[index]?.message}</FormHelperText>
                  )}
                  {/* <Button variant='outlined' color='error' type='button' onClick={() => remove(index)}>
                    Remove
                  </Button> */}
                </Grid>
              ))}
              <Grid xs={12}>
                <Button sx={{ mt: 2 }} variant='contained' type='button' onClick={() => append('')}>
                  Add Phone Number
                </Button>
                {fields.length == 0 && errors.phoneNumbers && (
                  <Typography color='red'>{errors.phoneNumbers.message || ''}</Typography>
                )}
              </Grid>

              {/* <Grid item xs={12} md={4}>
              <Button variant='contained' component='label'>
                Upload File
              </Button>
              <input type='file' />
            </Grid> */}

              <Button fullWidth size='large' type='submit' variant='contained' sx={{ my: 7 }}>
                submit
              </Button>
            </Grid>
          </form>
        </CardContent>
      )}
    </Card>
  )
}

export default AccountBaseInfo