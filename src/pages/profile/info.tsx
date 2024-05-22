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
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

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
import ActiveAccountBaseInfo from 'src/views/pages/account/ActiveAccountBaseInfo'

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
const Info = () => {
  // ** States
  const [tabBaseInfo, settabBaseInfo] = useState('1')
  const [steps, setsteps] = useState([
    {
      title: 'General Profile',
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
  const [isLoading, setIsLoading] = useState(true)
  const [serverData, setserverData] = useState<any>(null)

  // Get Current User Profile

  useEffect(() => {
    getData()
  }, [])
  const getData = async () => {
    setIsLoading(true)
    const { data } = await axiosInterceptorInstance.get(apiUrl.getCurrentProfile)
    setserverData(data)
    setIsLoading(false)
  }
  const handleEvaluate = () => {
    axiosInterceptorInstance
      .post(apiUrl.sendForEvaluation, { changeRequestGuid: serverData.pendingProfile.changeRequestGuid })
      .then(() => {
        alert('success send')
      })
  }
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
        return (
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tabBaseInfo}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={tabHandleChange} aria-label='lab API tabs example'>
                  <Tab label='pendding Profile' value='1' />
                  <Tab label='Active Profile' value='2' />
                </TabList>
              </Box>
              <TabPanel value='1'>
                <AccountBaseInfo
                  defaultValue={
                    serverData!.pendingProfile ? serverData.pendingProfile.generalProfile : generalProfileEmpty
                  }
                  pendingProfile={serverData!.pendingProfile}
                  onSubmit={val => submitForms(val)}
                />
              </TabPanel>
              <TabPanel value='2'>
                <ActiveAccountBaseInfo
                  defaultValue={serverData!.activeProfile ? serverData.activeProfile.generalProfile : null}
                />
              </TabPanel>
            </TabContext>
          </Box>
        )

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
          onClick={() => (stepCondition ? handleEvaluate() : handleNext())}
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
  const tabHandleChange = (event: React.SyntheticEvent, newValue: string) => {
    settabBaseInfo(newValue)
  }

  return (
    <>
      {isLoading && <div>Loading</div>}
      {!isLoading && (
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
      )}
    </>
  )
}
Info.acl = {
  action: 'read',
  subject: 'profile-info'
}
export default Info
