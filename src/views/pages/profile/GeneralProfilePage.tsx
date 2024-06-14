import * as yup from 'yup'
import React, { useContext, useEffect, useState } from 'react'
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
  Radio,
  RadioGroup,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
  Divider
} from '@mui/material'
import apiUrl from 'src/configs/api'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import { GeneralProfile, PendingProfileData } from 'src/types/forms/profile'
import Icon from 'src/@core/components/icon'
import FileUplader from 'src/@core/components/file-uploader'
import toast from 'react-hot-toast'
import { ThemeColor } from 'src/@core/layouts/types'
import CustomChip from 'src/@core/components/mui/chip'
import { ProfileContext } from 'src/context/ProfileContext'

interface profileStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

// ** Vars
const profileStatusObj: profileStatusObj = {
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  Pending: { color: 'warning', icon: 'mdi:progress-clock' },
  Approved: { color: 'success', icon: 'mdi:check' },
  Rejected: { color: 'error', icon: 'mdi:information-outline' }
}

const schema = yup.object({
  entityType: yup.number(),
  phoneNumbers: yup
    .array()
    .required('Must supply at least one phone number')
    .of(yup.string().required('Phone number is required'))
    .min(1, 'Must supply at least one phone number'),
  countryGuid: yup.string().required('Country is a required field'),
  firstName: yup.string().when('entityType', {
    is: (value: number) => value == 2,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  lastName: yup.string().when('entityType', {
    is: (value: number) => value == 2,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  nationalCode: yup.string().when(['entityType', 'countryGuid'], {
    is: (value: [number, string]) => value[0] == 2 && value[1] == 'ac49eb27-d67a-4e5a-8f20-0be4aebcfef4',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  passportNumber: yup.string().when('countryGuid', {
    is: (value: string) => value != 'ac49eb27-d67a-4e5a-8f20-0be4aebcfef4',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  companyName: yup.string().when('entityType', {
    is: (value: number) => value == 1,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  ceoName: yup.string().when('entityType', {
    is: (value: number) => value == 1,
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  }),
  companyNationalId: yup.string().when(['entityType', 'countryGuid'], {
    is: (value: [number, string]) => value[0] == 1 && value[1] == 'ac49eb27-d67a-4e5a-8f20-0be4aebcfef4',
    then: schema => schema.required(),
    otherwise: schema => schema.notRequired()
  })
})

type Props = {
  defaultValue: GeneralProfile
  pendingProfile: PendingProfileData | null
  onSubmit: (data) => void
}

function GeneralProfilePage({ onSubmit, defaultValue, pendingProfile }: Props) {
  const { getData, setPendingProfileForm, pendingProfileForm } = useContext(ProfileContext)

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

    // return () => {

    //   const data = getValues()
    //   if (pendingProfileForm) {
    //     setPendingProfileForm({
    //       ...pendingProfileForm,
    //       generalProfile: { ...pendingProfileForm.generalProfile, ...data }
    //     })
    //   }
    // }
  }, [])

  const {
    getValues,
    watch,
    control,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({
    defaultValues: defaultValue,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })
  const { fields, append, remove } = useFieldArray({
    name: 'phoneNumbers',
    control
  })

  const submitForm = async (data: GeneralProfile) => {
    await setPendingProfileForm({
      ...pendingProfileForm,
      generalProfile: { ...pendingProfileForm!.generalProfile, ...data }
    })
    onSubmit(data)
  }
  const deleteImage = (id: string) => {
    axiosInterceptorInstance.delete(`/api/Profile/Attachment/Delete/${id}`).then(() => {
      toast.success('suucessfully deleted')
      getData()
    })
  }

  return (
    <Card>
      <CardHeader
        title={
          <>
            Your Profile
            {pendingProfile && pendingProfile.approvalStatusDisplayName && (
              <CustomChip
                sx={{ mx: 2 }}
                icon={<Icon icon={profileStatusObj[pendingProfile.approvalStatusDisplayName].icon}></Icon>}
                color={profileStatusObj[pendingProfile.approvalStatusDisplayName].color}
                label={pendingProfile.approvalStatusDisplayName}
              />
            )}
          </>
        }
      />
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
                  {watch('countryGuid') == 'ac49eb27-d67a-4e5a-8f20-0be4aebcfef4' && (
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
                        label='Contact Email'
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
              <Grid item xs={12}>
                <Button sx={{ mt: 2 }} variant='contained' type='button' onClick={() => append('')}>
                  Add Phone Number
                </Button>
                {fields.length == 0 && errors.phoneNumbers && (
                  <Typography color='red'>{errors.phoneNumbers.message || ''}</Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: theme => `${theme.spacing(3)} !important` }} />
              </Grid>
              {pendingProfile?.generalProfile != null && (
                <>
                  <Grid item xs={12} md={4}>
                    {pendingProfile && pendingProfile.profilePicUrl && (
                      <div>
                        {' '}
                        <img
                          alt='profilePicUrl'
                          style={{ maxWidth: '150px', maxHeight: '150px' }}
                          src={pendingProfile.profilePicUrl.downloadAbsoluteUrl}
                        />
                        <Icon
                          onClick={() => deleteImage(pendingProfile.profilePicUrl.attachmentGuid)}
                          icon='mdi:trash'
                          color='red'
                        />
                      </div>
                    )}
                    <FileUplader
                      onUploaded={() => {
                        getData()
                      }}
                      title='Profile Picture'
                      id='ProfilePic'
                      url='/api/Profile/Attachment/Add'
                      params={{ flag: 'ProfilePic', referenceEntityGuid: pendingProfile.changeRequestGuid }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {pendingProfile && pendingProfile.nationalCardScanUrl && (
                      <div>
                        {' '}
                        <img
                          style={{ maxWidth: '150px', maxHeight: '150px' }}
                          alt='NationalCard'
                          src={pendingProfile.nationalCardScanUrl.downloadAbsoluteUrl}
                        />
                        <Icon
                          onClick={() => deleteImage(pendingProfile.nationalCardScanUrl.attachmentGuid)}
                          icon='mdi:trash'
                          color='red'
                        />
                      </div>
                    )}
                    <FileUplader
                      onUploaded={() => {
                        getData()
                      }}
                      title='National Card Picture'
                      id='NationalCard'
                      url='/api/Profile/Attachment/Add'
                      params={{ flag: 'NationalCard', referenceEntityGuid: pendingProfile.changeRequestGuid }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    {pendingProfile && pendingProfile.passportScanUrl && (
                      <div>
                        {' '}
                        <img
                          style={{ maxWidth: '150px', maxHeight: '150px' }}
                          alt='Passport'
                          src={pendingProfile.passportScanUrl.downloadAbsoluteUrl}
                        />
                        <Icon
                          onClick={() => deleteImage(pendingProfile.passportScanUrl.attachmentGuid)}
                          icon='mdi:trash'
                          color='red'
                        />
                      </div>
                    )}
                    <FileUplader
                      onUploaded={() => {
                        getData()
                      }}
                      title='Passport Picture'
                      id='Passport'
                      url='/api/Profile/Attachment/Add'
                      params={{ flag: 'Passport', referenceEntityGuid: pendingProfile.changeRequestGuid }}
                    />
                  </Grid>
                </>
              )}

              <Button fullWidth size='large' type='submit' variant='contained' sx={{ my: 7 }}>
                Save
              </Button>
            </Grid>
          </form>
        </CardContent>
      )}
    </Card>
  )
}

export default GeneralProfilePage
