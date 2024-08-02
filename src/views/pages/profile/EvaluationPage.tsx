import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import { ProfileContext } from 'src/context/ProfileContext'
import apiUrl from 'src/configs/api'
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableCellBaseProps,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { styled } from '@mui/system'
import SelectCategories from './SelectCategories'
import { PendingProfileData } from 'src/types/forms/profile'

const EvaluationPage = () => {
  const { getData, pendingProfileForm } = useContext(ProfileContext)

  console.log(pendingProfileForm)
  const categories: (keyof PendingProfileData)[] = [
    'expertProfile',
    'buyerProfile',
    'salesRepProfile',
    'supplierProfile',
    'trusteeProfile'
  ]
  const handleEvaluate = () => {
    axiosInterceptorInstance
      .post(apiUrl.sendForEvaluation, { changeRequestGuid: pendingProfileForm!.changeRequestGuid })
      .then(() => {
        toast.success('Your new profile was successfully sent for evaluation!')
        getData()
      })
  }
  const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
    borderBottom: 0,
    padding: `${theme.spacing(1, 0)} !important`
  }))

  return (
    <>
      {pendingProfileForm == null && <h1> you dont have any profile to send </h1>}
      {pendingProfileForm != null && (
        <Card>
          <CardHeader title={`Your Changes For Evaluation : `} />
          {categories.map(el => (
            <>
              {pendingProfileForm[el] != null && (
                <CardContent key={el}>
                  <SelectCategories roleTitle={el} disabled={true}></SelectCategories>
                </CardContent>
              )}
            </>
          ))}

          {pendingProfileForm?.generalProfile != null && (
            <CardContent>
              <Typography variant='h6' sx={{ color: 'text.primary' }}>
                General Profile :
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    {Object.keys(pendingProfileForm?.generalProfile).map(key => (
                      <>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body1'>{key}</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body1'>{pendingProfileForm?.generalProfile[key]}</Typography>
                          </MUITableCell>
                        </TableRow>
                      </>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          )}
          <CardContent>
            <Typography variant='h6' sx={{ color: 'text.primary' }}>
              User Images :
            </Typography>
            <Grid container>
              {pendingProfileForm && pendingProfileForm.profilePicUrl && (
                <Grid item xs={12} md={4}>
                  <div>
                    <div>{'Profile Picture'}</div>
                    <img
                      alt='profilePicUrl'
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                      src={pendingProfileForm.profilePicUrl.downloadAbsoluteUrl}
                    />
                  </div>
                </Grid>
              )}
              {pendingProfileForm && pendingProfileForm.nationalCardScanUrl && (
                <Grid item xs={12} md={4}>
                  <div>
                    <div>{'NationalCard Scan'}</div>
                    <img
                      alt='nationalCardScanUrl'
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                      src={pendingProfileForm.nationalCardScanUrl.downloadAbsoluteUrl}
                    />
                  </div>
                </Grid>
              )}
              {pendingProfileForm && pendingProfileForm.passportScanUrl && (
                <Grid item xs={12} md={4}>
                  <div>
                    <div>{'Passport Scan'}</div>
                    <img
                      alt='passportScanUrl'
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                      src={pendingProfileForm.passportScanUrl.downloadAbsoluteUrl}
                    />
                  </div>
                </Grid>
              )}
              {pendingProfileForm && pendingProfileForm.registrationCertificateScanUrl && (
                <Grid item xs={12} md={4}>
                  <div>
                    <div>{'Registration Certificate Scan '}</div>
                    <img
                      alt='registrationCertificateScanUrl'
                      style={{ maxWidth: '150px', maxHeight: '150px' }}
                      src={pendingProfileForm.registrationCertificateScanUrl.downloadAbsoluteUrl}
                    />
                  </div>
                </Grid>
              )}
            </Grid>
          </CardContent>
          <CardActions>
            <Button fullWidth variant='contained' color='success' onClick={() => handleEvaluate()}>
              Send for Evaluation
            </Button>
          </CardActions>
        </Card>
      )}
    </>
  )
}

export default EvaluationPage
