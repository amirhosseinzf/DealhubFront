import * as yup from 'yup'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  FormControl,
  TextField,
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
  CircularProgress
} from '@mui/material'
import apiUrl from 'src/configs/api'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import { GeneralProfile } from 'src/types/forms/profile'

const schema = yup.object({})

type Props = {
  defaultValue: GeneralProfile
}

function ActiveAccountBaseInfo({ defaultValue }: Props) {
  const [countryData, setCountryData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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
    register,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })
  const { fields } = useFieldArray({
    control,
    name: 'phoneNumbers'
  })
  if (defaultValue == null) {
    return <div>"You don't have any active profile"</div>
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
          <form noValidate autoComplete='off'>
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
                        <FormControlLabel disabled value={1} control={<Radio />} label='Juridical' />
                        <FormControlLabel disabled value={2} control={<Radio />} label='Natural' />
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
                          disabled
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
                            disabled
                            label='first Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.firstName)}
                            placeholder='first Name'
                          />
                        )}
                      />
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
                            disabled
                            label='last Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.lastName)}
                            placeholder='last Name'
                          />
                        )}
                      />
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
                              disabled
                              label='national Code'
                              value={value}
                              onBlur={onBlur}
                              onChange={onChange}
                              error={Boolean(errors.nationalCode)}
                              placeholder='national Code'
                            />
                          )}
                        />
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
                            disabled
                            label='Passport Number'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.passportNumber)}
                            placeholder='Passport Number'
                          />
                        )}
                      />
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
                            disabled
                            label='company Name'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.companyName)}
                            placeholder='company Name'
                          />
                        )}
                      />
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
                            disabled
                            label='Company National Id'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.companyNationalId)}
                            placeholder='Company National Id'
                          />
                        )}
                      />
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
                            disabled
                            label='CeoName'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                            error={Boolean(errors.ceoName)}
                            placeholder='Ceo Name'
                          />
                        )}
                      />
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
                        disabled
                        label='Email'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.contactEmail)}
                        placeholder='Email'
                      />
                    )}
                  />
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
                        disabled
                        label='Web Site'
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.websiteUrl)}
                        placeholder='Web Site'
                      />
                    )}
                  />
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
                        disabled
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
                    disabled
                    label='PhoneNumber'
                    {...register(`phoneNumbers.${index}` as const)}
                    helperText='Enter Phone Number with Code'
                    placeholder='for example +989121234567'
                    defaultValue={item}
                  />
                </Grid>
              ))}
              <Grid container>
                {defaultValue && defaultValue.profilePicUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'Profile Picture'}</div>
                      <img
                        alt='profilePicUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={defaultValue.profilePicUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
                {defaultValue && defaultValue.nationalCardScanUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'NationalCard Scan'}</div>
                      <img
                        alt='nationalCardScanUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={defaultValue.nationalCardScanUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
                {defaultValue && defaultValue.passportScanUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'Passport Scan'}</div>
                      <img
                        alt='passportScanUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={defaultValue.passportScanUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
                {defaultValue && defaultValue.registrationCertificateScanUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'Registration Certificate Scan '}</div>
                      <img
                        alt='registrationCertificateScanUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={defaultValue.registrationCertificateScanUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </form>
        </CardContent>
      )}
    </Card>
  )
}

export default ActiveAccountBaseInfo
