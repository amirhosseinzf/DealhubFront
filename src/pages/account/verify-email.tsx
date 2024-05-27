import { Grid, Card, CardHeader, CardContent, Typography, Button } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import React, { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'

type Props = {}

function VerifyEmail({}: Props) {
  const { user } = useAuth()
  const searchParams = useSearchParams()

  const [verifyCode, setVerifyCode] = useState(false)
  const [verifyMessage, setVerifyMessage] = useState('')
  const [loadingBtn, setLoadingBtn] = useState(false)
  useEffect(() => {
    if (searchParams.get('code')) {
      VerifyEmail()
    }
  }, [searchParams])

  function sendEmailVerifaction() {
    setLoadingBtn(true)
    axiosInterceptorInstance
      .post(authConfig.sendEmailVerfiyEndpoint, { userAccountGuid: user?.globalId })
      .then(() => {
        setVerifyCode(true)
      })
      .catch(err => {
        alert(err)
      })
      .finally(() => setLoadingBtn(false))
  }
  function VerifyEmail() {
    axiosInterceptorInstance
      .post(authConfig.verifyEmailEndpoint, {
        userAccountGuid: searchParams.get('user'),
        emailVerificationCode: searchParams.get('code')
      })
      .then(({ data }) => {
        setVerifyMessage('Your Email : ' + data.email + ' Verfied in ' + new Date(data.emailVerifyDate))
      })
      .catch(err => {
        setVerifyMessage(err.response.data.Message)
      })
  }

  if (searchParams.get('code')) {
    return (
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Email verification successful!'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>Your account is now active.</Typography>
            <Typography sx={{ mb: 2 }}>Please create a profile to proceed!</Typography>

            <Button variant='contained' href='/'>
              Create a profile
            </Button>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Grid container spacing={6}>
      {!verifyCode && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Your account has been created successfully!'></CardHeader>
            <CardContent>
              <Typography sx={{ mb: 2 }}>Please activate your account!</Typography>
              <Typography>To activate your account, please verify your email address.</Typography>
              <LoadingButton
                sx={{ mt: 4 }}
                loading={loadingBtn}
                onClick={() => sendEmailVerifaction()}
                variant='outlined'
              >
                Send Email Verification
              </LoadingButton>
            </CardContent>
          </Card>
        </Grid>
      )}
      {verifyCode && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='A verification link was sent to your email'></CardHeader>
            <CardContent>
              <Typography sx={{ mb: 2 }}>
                Please check your email and follow the instructions to activate your account.
              </Typography>
              <Typography variant='subtitle2' sx={{ mb: 2 }}>
                If you didn't receive the activation email, please check your spam folder.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}
VerifyEmail.acl = {
  action: 'read',
  subject: 'verify-email'
}

export default VerifyEmail
