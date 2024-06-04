import React, { useState } from 'react'
import Stepper from '@mui/material/Stepper'
import { styled } from '@mui/material/styles'
import StepLabel from '@mui/material/StepLabel'
import Typography from '@mui/material/Typography'
import MuiStep, { StepProps } from '@mui/material/Step'
import CardContent, { CardContentProps } from '@mui/material/CardContent'

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
import ActiveGeneralProfile from 'src/views/pages/profile/ActiveGeneralProfile'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { ActiveProfileData } from 'src/types/forms/profile'
import SelectCategories from './SelectCategories'

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

type Props = {
  serverData: ActiveProfileData | null
}

const MainActiveProfile = ({ serverData }: Props) => {
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

  //Handles
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
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <ActiveGeneralProfile defaultValue={serverData ? serverData.generalProfile : null} />
          </Box>
        )
      case 1:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories roleTitle={steps[1].title} />
          </Box>
        )
      case 2:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories roleTitle={steps[2].title} />
          </Box>
        )
      case 3:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories roleTitle={steps[3].title} />
          </Box>
        )
      case 4:
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <SelectCategories roleTitle={steps[4].title} />
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
        <Button
          variant='contained'
          disabled={stepCondition}
          color={stepCondition ? 'success' : 'primary'}
          {...(!stepCondition ? { endIcon: <Icon icon='mdi:arrow-right' /> } : {})}
          onClick={() => handleNext()}
        >
          {stepCondition ? 'Send for Evaluation' : 'Next'}
        </Button>
      </Box>
    )
  }
  const renderJobArea = () => {
    return (
      <Card sx={{ mb: 1 }}>
        <FormControl disabled component='fieldset' sx={{ m: 3 }} variant='standard'>
          <FormLabel component='legend'>Selected role(s) :</FormLabel>
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

export default MainActiveProfile
