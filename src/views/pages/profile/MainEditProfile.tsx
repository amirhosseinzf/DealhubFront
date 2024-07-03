import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Stepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import apiUrl from 'src/configs/api'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'
import GeneralProfilePage from 'src/views/pages/profile/GeneralProfilePage'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { PendingProfileData } from 'src/types/forms/profile'
import SelectCategories from './SelectCategories'
import { ProfileContext } from 'src/context/ProfileContext'
import EvaluationPage from './EvaluationPage'

const Step = styled(MuiStep)<StepProps>(({ theme }) => ({
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(4)
  },
  '& .MuiStepLabel-root': {
    padding: 0
  }
}))

const StepperHeaderContainer = styled(CardContent)<CardContentProps>(({ theme }) => ({
  minWidth: 300,
  borderRight: `1px solid ${theme.palette.divider}`,
  [theme.breakpoints.down('lg')]: {
    borderRight: 0,
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}))
const generalProfileEmpty = {
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
type Props = {
  serverData: PendingProfileData | null
}

const MainEditProfile = ({ serverData }: Props) => {
  const { getData, pendingProfileForm } = useContext(ProfileContext)

  // UseStates
  const [steps, setsteps] = useState([
    {
      title: 'General Profile',
      subtitle: 'Your Name/Email'
    }
  ])
  const [state, setState] = useState({
    buyerProfile: serverData ? serverData.buyerProfile != null : false,
    expertProfile: serverData ? serverData.expertProfile != null : false,
    salesRepProfile: serverData ? serverData.salesRepProfile != null : false,
    supplierProfile: serverData ? serverData.supplierProfile != null : false,
    trusteeProfile: serverData ? serverData.trusteeProfile != null : false
  })
  const [activeStep, setActiveStep] = useState<number>(0)

  useEffect(() => {
    const temp = state

    for (const prop in temp) {
      const val: boolean = temp[prop]
      if (val)
        setsteps(prevState => [
          ...prevState,
          {
            title: prop,
            subtitle: prop
          }
        ])
    }
  }, [])

  //Handles

  const submitForms = (data: PendingProfileData | null = null) => {
    if (data != null) {
      axiosInterceptorInstance
        .post(apiUrl.CreateOrEditProfile, {
          ...pendingProfileForm,
          generalProfile: { ...pendingProfileForm!.generalProfile, ...data }
        })
        .then(() => {
          toast.success('successfully saved')

          getData()
        })
    } else {
      axiosInterceptorInstance.post(apiUrl.CreateOrEditProfile, { ...pendingProfileForm }).then(() => {
        toast.success('successfully saved')

        getData()
      })
    }
  }

  // Handle Stepper
  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }
  const handlePrev = () => {
    if (activeStep !== 0) {
      setActiveStep(activeStep - 1)
    }
  }
  const getStepContent = (step: number) => {
    if (step == 99) {
      return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <EvaluationPage />
        </Box>
      )
    } else if (step > steps.length - 1) {
      step = steps.length - 1
      setActiveStep(step)
    }
    switch (step) {
      case 0:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <GeneralProfilePage
              onNeedRefresh={() => {
                getData()
              }}
              defaultValue={serverData ? serverData.generalProfile : generalProfileEmpty}
              pendingProfile={serverData}
              onSubmit={data => submitForms(data)}
            />
          </Box>
        )

      case 1:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories key={'step1'} roleTitle={steps[1].title} />
          </Box>
        )
      case 2:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories key={'step2'} roleTitle={steps[2].title} />
          </Box>
        )
      case 3:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories key={'step3'} roleTitle={steps[3].title} />
          </Box>
        )
      case 4:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories key={'step4'} roleTitle={steps[4].title} />
          </Box>
        )
      case 5:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories key={'step5'} roleTitle={steps[5].title} />
          </Box>
        )
      default:
        return null
    }
  }
  const renderContent = () => {
    return getStepContent(activeStep)
  }

  const renderFooter = () => {
    const stepCondition = activeStep === steps.length - 1

    return (
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          color='secondary'
          variant='outlined'
          onClick={handlePrev}
          disabled={activeStep === 0}
          startIcon={<Icon icon='mdi:arrow-left' />}
        >
          Previous
        </Button>
        <div>
          {activeStep != 0 && activeStep != 99 && (
            <Button sx={{ mx: 2 }} variant='outlined' color='primary' onClick={() => submitForms()}>
              Save Changes
            </Button>
          )}
          {stepCondition && (
            <Button
              variant='contained'
              color='primary'
              {...(!stepCondition ? { endIcon: <Icon icon='mdi:arrow-right' /> } : {})}
              onClick={() => setActiveStep(99)}
            >
              send For Evaluation
            </Button>
          )}
          {!stepCondition && activeStep != 99 && (
            <Button
              variant='contained'
              disabled={stepCondition}
              color='primary'
              {...(!stepCondition ? { endIcon: <Icon icon='mdi:arrow-right' /> } : {})}
              onClick={() => handleNext()}
            >
              Next
            </Button>
          )}
        </div>
      </Box>
    )
  }
  const renderJobArea = () => {
    return (
      <Card sx={{ mb: 1 }}>
        <FormControl component='fieldset' sx={{ m: 3 }} variant='standard'>
          <FormLabel component='legend'>Select your role(s) :</FormLabel>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={buyerProfile} onChange={handleChange} name='buyerProfile' />}
              label='Buyer'
            />
            <FormControlLabel
              control={<Checkbox checked={expertProfile} onChange={handleChange} name='expertProfile' />}
              label='Expert'
            />
            <FormControlLabel
              control={<Checkbox checked={salesRepProfile} onChange={handleChange} name='salesRepProfile' />}
              label='Sales Rep'
            />
            <FormControlLabel
              control={<Checkbox checked={supplierProfile} onChange={handleChange} name='supplierProfile' />}
              label='Supplier'
            />
            <FormControlLabel
              control={<Checkbox checked={trusteeProfile} onChange={handleChange} name='trusteeProfile' />}
              label='Trustee'
            />
          </FormGroup>
        </FormControl>
      </Card>
    )
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const title = event.target.name
    setState({
      ...state,
      [title]: event.target.checked
    })

    if (event.target.checked) {
      const item = steps.find(item => item.title === title)
      if (!item) {
        setsteps(val => [
          ...val,
          {
            subtitle: title,
            title: title
          }
        ])
      }
    } else {
      setsteps(steps.filter(item => item.title !== title))
    }
  }
  const { buyerProfile, expertProfile, salesRepProfile, supplierProfile, trusteeProfile } = state

  return (
    <>
      {renderJobArea()}
      <Card sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
        <StepperHeaderContainer>
          <StepperWrapper sx={{ height: '100%', '& .MuiStepLabel-label': { cursor: 'pointer' } }}>
            <Stepper connector={<></>} activeStep={activeStep} orientation='vertical'>
              {steps.map((step, index) => {
                return (
                  <Step
                    key={index}
                    onClick={() => setActiveStep(index)}
                    sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
                  >
                    <StepLabel StepIconComponent={StepperCustomDot}>
                      <div className='step-label'>
                        <Typography className='step-number'>{`0${index + 1}`}</Typography>
                        <div>
                          <Typography className='step-title'>{step.title}</Typography>
                          <Typography className='step-subtitle'>{step.subtitle}</Typography>
                        </div>
                      </div>
                    </StepLabel>
                  </Step>
                )
              })}
              <Step
                key={'evaluate'}
                onClick={() => setActiveStep(99)}
                sx={{ '&.Mui-completed + svg': { color: 'primary.main' } }}
              >
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <Typography className='step-number'>{`0${steps.length + 1}`}</Typography>
                    <div>
                      <Typography className='step-title'>Evaluation</Typography>
                      <Typography className='step-subtitle'>Send For Evaluation</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            </Stepper>
          </StepperWrapper>
        </StepperHeaderContainer>
        <CardContent sx={{ width: '100%' }}>
          {renderContent()}
          {renderFooter()}
        </CardContent>
      </Card>
    </>
  )
}

export default MainEditProfile
