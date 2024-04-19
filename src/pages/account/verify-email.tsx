import { Grid, Card, CardHeader, CardContent, Typography } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useSearchParams } from 'next/navigation'

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
    axios
      .post(authConfig.sendEmailVerfiyEndpoint, { userAccountGuid: user?.globalId })
      .then(() => {
        debugger
        setVerifyCode(true)
      })
      .catch(err => {
        alert(err)
      })
      .finally(() => setLoadingBtn(false))
  }
  function VerifyEmail() {
    axios
      .post(authConfig.verifyEmailEndpoint, {
        userAccountGuid: searchParams.get('user'),
        emailVerificationCode: searchParams.get('code')
      })
      .then(({ data }) => {
        debugger
        setVerifyMessage('Your Email : ' + data.email + ' Verfied in ' + new Date(data.emailVerifyDate))
      })
      .catch(err => {
        debugger
        setVerifyMessage(err.response.data.Message)
      })
  }
  debugger
  if (searchParams.get('code')) {
    return (
      <Grid item xs={12}>
        <Card>
          <CardHeader title='verify Email'></CardHeader>
          <CardContent>{verifyMessage}</CardContent>
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
