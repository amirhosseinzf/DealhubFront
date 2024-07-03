import {
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableRow,
  Divider,
  TableContainer,
  TableCell,
  TableCellBaseProps,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'
import { Box, BoxProps, styled } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import Icon from 'src/@core/components/icon'
import { ThemeColor } from 'src/@core/layouts/types'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { approveOrRejectProfile } from 'src/store/manageProfile'

type ServerData = {
  changeRequestGuid: string
  userAccountGuid: string
  approvalStatus: 0
  approvalStatusDisplayName: string
  createDate: string
  sendDate: string
  evaluationDate: string
  generalProfile: {
    entityType: 1
    firstName: string
    lastName: string
    companyName: string
    countryGuid: string
    nationalCode: string
    passportNumber: string
    companyNationalId: string
    phoneNumbers: string[]
    contactEmail: string
    websiteUrl: string
    ceoName: string
    address: string
  }
  buyerProfile: {
    productCategories: [string]
  }
  expertProfile: {
    productCategories: [string]
  }
  salesRepProfile: {
    productCategories: [string]
  }
  supplierProfile: {
    productCategories: [string]
  }
  trusteeProfile: {
    productCategories: [string]
  }
  profilePicUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  nationalCardScanUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  passportScanUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  registrationCertificateScanUrl: {
    attachmentGuid: string
    downloadRelativeUrl: string
    downloadAbsoluteUrl: string
  }
  username: string
  email: string
  entityDisplayName: string
}
interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}
type Props = {
  id: string | null
}

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  Pending: { color: 'warning', icon: 'mdi:progress-clock' },
  Approved: { color: 'success', icon: 'mdi:check' },
  Rejected: { color: 'error', icon: 'mdi:information-outline' }
}
const MUITableCell = styled(TableCell)<TableCellBaseProps>(({ theme }) => ({
  borderBottom: 0,
  padding: `${theme.spacing(1, 0)} !important`
}))
const CalcWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:not(:last-of-type)': {
    marginBottom: theme.spacing(2)
  }
}))
function Preview({ id }: Props) {
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()
  const [approveOrRejectDialogOpen, setApproveOrRejectDialogOpen] = useState(false)
  const [rejectionComment, setRejectionComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [serverData, setServerData] = useState<ServerData | null>(null)

  const handleApproveOrRejectDialogOpen = () => {
    setApproveOrRejectDialogOpen(true)
  }
  const handleApproveOrRejectDialogClose = () => {
    setApproveOrRejectDialogOpen(false)
  }
  const handleApproveOrReject = (decision: number) => {
    const data = {
      changeRequestGuid: id,
      decision,
      rejectionComment: rejectionComment
    }
    dispatch(approveOrRejectProfile(data)).then(() => {
      handleApproveOrRejectDialogClose()
      router.back()
    })
  }

  const getPreviewData = () => {
    axiosInterceptorInstance
      .get(`/api/Profile/ChangeRequest/${id}`)
      .then(({ data }) => {
        setServerData(data)
      })
      .finally(() => setIsLoading(false))
  }
  useEffect(() => {
    getPreviewData()
  }, [])

  return (
    <>
      {isLoading && <div>Loading</div>}
      {!isLoading && serverData == null && <div>Data Not Fetch</div>}
      {!isLoading && (
        <div>
          <Button variant='outlined' sx={{ margin: '10px' }} onClick={() => router.back()}>
            Back
          </Button>
          {serverData!.approvalStatusDisplayName == 'Pending' && (
            <Button variant='contained' sx={{ margin: '10px' }} onClick={() => handleApproveOrRejectDialogOpen()}>
              Approve/Reject
            </Button>
          )}
          <Card>
            <CardContent>
              <Grid container>
                <Grid item sm={6} xs={12} sx={{ mb: { sm: 0, xs: 4 } }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 6, display: 'flex', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ ml: 2, fontWeight: 700, lineHeight: 1.2 }}>
                        Status :
                      </Typography>
                      <CustomChip
                        icon={
                          <Icon
                            icon={
                              serverData?.approvalStatusDisplayName
                                ? invoiceStatusObj[serverData?.approvalStatusDisplayName].icon
                                : ''
                            }
                          ></Icon>
                        }
                        color={
                          serverData?.approvalStatusDisplayName
                            ? invoiceStatusObj[serverData?.approvalStatusDisplayName].color
                            : 'default'
                        }
                        label={serverData?.approvalStatusDisplayName}
                      />
                    </Box>
                    <Box>
                      <Typography variant='body1'>
                        <strong> UserName :</strong>
                        {serverData?.username}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant='body1'>
                        <strong> Email :</strong>
                        {serverData?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' } }}>
                    <Table sx={{ maxWidth: '400px' }}>
                      <TableBody>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='h6'>User Profile</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='h6'>{serverData?.entityDisplayName}</Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body2'>Send Date:</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body2'>
                              {new Date(serverData?.sendDate || '').toLocaleString()}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                        <TableRow>
                          <MUITableCell>
                            <Typography variant='body2'>Create Date:</Typography>
                          </MUITableCell>
                          <MUITableCell>
                            <Typography variant='body2'>
                              {new Date(serverData?.createDate || '').toLocaleString()}
                            </Typography>
                          </MUITableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>

            <Divider
              sx={{ mt: theme => `${theme.spacing(6.5)} !important`, mb: theme => `${theme.spacing(2.5)} !important` }}
            />

            <CardContent>
              <Typography variant='h6' sx={{ color: 'text.primary' }}>
                General Profile :
              </Typography>
              <TableContainer>
                <Table>
                  {serverData?.generalProfile && (
                    <TableBody>
                      {Object.keys(serverData?.generalProfile).map(key => (
                        <>
                          <TableRow>
                            <MUITableCell>
                              <Typography variant='body1'>{key}</Typography>
                            </MUITableCell>
                            <MUITableCell>
                              <Typography variant='body1'>{serverData?.generalProfile[key]}</Typography>
                            </MUITableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </CardContent>

            <CardContent sx={{ pt: 8 }}>
              <Grid container></Grid>
            </CardContent>

            <Divider sx={{ mt: theme => `${theme.spacing(4.5)} !important`, mb: '0 !important' }} />

            <CardContent>
              <Typography variant='h6' sx={{ color: 'text.primary' }}>
                User Images :
              </Typography>
              <Grid container>
                {serverData && serverData.profilePicUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'Profile Picture'}</div>
                      <img
                        alt='profilePicUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={serverData.profilePicUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
                {serverData && serverData.nationalCardScanUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'NationalCard Scan'}</div>
                      <img
                        alt='nationalCardScanUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={serverData.nationalCardScanUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
                {serverData && serverData.passportScanUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'Passport Scan'}</div>
                      <img
                        alt='passportScanUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={serverData.passportScanUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
                {serverData && serverData.registrationCertificateScanUrl && (
                  <Grid item xs={12} md={4}>
                    <div>
                      <div>{'Registration Certificate Scan '}</div>
                      <img
                        alt='registrationCertificateScanUrl'
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        src={serverData.registrationCertificateScanUrl.downloadAbsoluteUrl}
                      />
                    </div>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
          <Dialog
            open={approveOrRejectDialogOpen}
            onClose={handleApproveOrRejectDialogClose}
            aria-labelledby='alert-dialog-title'
            aria-describedby='alert-dialog-description'
          >
            <DialogTitle id='alert-dialog-title'>{'Approve / Reject'}</DialogTitle>
            <DialogContent>
              <Typography>Approve Or Reject</Typography>
              <TextField
                value={rejectionComment}
                onChange={event => setRejectionComment(event.target.value)}
                style={{ marginTop: '10px' }}
                fullWidth
                rows={5}
                multiline
                label='Description'
                type='textarea'
                variant='outlined'
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleApproveOrRejectDialogClose}>close</Button>
              <Button color='error' variant='outlined' onClick={() => handleApproveOrReject(2)}>
                Reject
              </Button>
              <Button color='success' variant='contained' onClick={() => handleApproveOrReject(1)} autoFocus>
                Approve
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </>
  )
}

export default Preview
