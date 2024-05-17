// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'

import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'

import apiUrl from 'src/configs/api'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import StepperCustomDot from 'src/views/forms/form-wizard/StepperCustomDot'

// ** Step Components
import AccountBaseInfo from 'src/views/pages/account/AccountBaseInfo'

// ** Styled Components
import StepperWrapper from 'src/@core/styles/mui/stepper'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import toast from 'react-hot-toast'

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

const Info = () => {
  // ** States
  const [steps, setsteps] = useState([
    {
      title: 'Personal Details',
      subtitle: 'Your Name/Email'
    }
  ])
  const [state, setState] = useState({
    buyerProfile: false,
    expertProfile: false,
    salesRepProfile: false,
    supplierProfile: false,
    trusteeProfile: false
  })
  const [activeStep, setActiveStep] = useState<number>(0)

  // Get Current User Profile

  const submitForms = (value: any) => {
    const sendData = {
      generalProfile: value,
      buyerProfile: null,
      expertProfile: null,
      salesRepProfile: null,
      supplierProfile: null,
      trusteeProfile: null
    }
    axiosInterceptorInstance.post(apiUrl.CreateOrEditProfile, sendData).then(() => {
      toast.success('successfully sumbmited')
    })
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
    switch (step) {
      case 0:
        return <AccountBaseInfo onSubmit={val => submitForms(val)} />
      case 1:
        return <></>
      case 2:
        return <></>
      case 3:
        return <></>
      case 4:
        return <></>
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
        <Button
          variant='contained'
          color={stepCondition ? 'success' : 'primary'}
          {...(!stepCondition ? { endIcon: <Icon icon='mdi:arrow-right' /> } : {})}
          onClick={() => (stepCondition ? alert('Evaluated..!!') : handleNext())}
        >
          {stepCondition ? 'Evaluate' : 'Next'}
        </Button>
      </Box>
    )
  }
  const renderJobArea = () => {
    return (
      <Card sx={{ mb: 1 }}>
        <FormControl required error={error} component='fieldset' sx={{ m: 3 }} variant='standard'>
          <FormLabel component='legend'>Job Area</FormLabel>
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
          <FormHelperText>You must pick atleast one option</FormHelperText>
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
  const error =
    [buyerProfile, expertProfile, salesRepProfile, supplierProfile, trusteeProfile].filter(v => v).length < 1

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
            </Stepper>
          </StepperWrapper>
        </StepperHeaderContainer>
        <div>
          <CardContent>
            {renderContent()}
            {renderFooter()}
          </CardContent>
        </div>
      </Card>
    </>
  )
}
Info.acl = {
  action: 'read',
  subject: 'profile-info'
}
export default Info
