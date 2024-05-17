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
          <CardHeader title='verify Email'></CardHeader>
          <CardContent>
            {verifyMessage}{' '}
            <Button variant='contained' href='/'>
              show my profile
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
            <CardHeader title='Your account has been Created 🚀 😘'></CardHeader>
            <CardContent>
              <Typography sx={{ mb: 2 }}>Active Your Account.</Typography>
              <Typography>
                For activate your account please verify your email.{' '}
                <LoadingButton loading={loadingBtn} onClick={() => sendEmailVerifaction()} variant='outlined'>
                  Send Email Verifation
                </LoadingButton>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
      {verifyCode && (
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Hooooraaaa Your verify code sent to your email 🙌 '></CardHeader>
            <CardContent>Please check your email and active your account </CardContent>
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
