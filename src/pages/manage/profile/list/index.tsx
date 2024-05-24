// ** React Imports
import { useState, useEffect, forwardRef, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
// import format from 'date-fns/format'
// import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData, approveOrRejectProfile } from 'src/store/manageProfile'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'
import { manageProfileType } from 'src/types/manageProfileTypes'

// import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'

interface InvoiceStatusObj {
  [key: string]: {
    icon: string
    color: ThemeColor
  }
}

// interface CustomInputProps {
//   dates: Date[]
//   label: string
//   end: number | Date
//   start: number | Date
//   setDates?: (value: Date[]) => void
// }

interface CellType {
  row: manageProfileType
}

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  Pending: { color: 'warning', icon: 'mdi:progress-clock' },
  Approved: { color: 'success', icon: 'mdi:check' },
  Rejected: { color: 'error', icon: 'mdi:information-outline' }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    headerName: 'userName',
    field: 'username'
  },
  {
    flex: 0.1,
    headerName: 'Email',
    field: 'email',
    minWidth: 300
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'approval Status',
    renderCell: ({ row }: CellType) => {
      const { approvalStatusDisplayName } = row

      const color = invoiceStatusObj[approvalStatusDisplayName]
        ? invoiceStatusObj[approvalStatusDisplayName].color
        : 'primary'

      return (
        <CustomChip
          icon={<Icon icon={invoiceStatusObj[approvalStatusDisplayName].icon}></Icon>}
          color={color}
          label={approvalStatusDisplayName}
        />
      )
    }
  },
  {
    flex: 0.1,
    headerName: 'Send Date',
    field: 'sendDate',
    minWidth: 300,
    renderCell: ({ row }: CellType) => {
      const { sendDate } = row

      return (
        <Typography noWrap variant='caption'>
          {new Date(sendDate).toLocaleString()}
        </Typography>
      )
    }
  }
]

/* eslint-disable */
// const CustomInput = forwardRef((props: CustomInputProps, ref) => {
//   const startDate = props.start !== null ? format(props.start, 'MM/dd/yyyy') : ''
//   const endDate = props.end !== null ? ` - ${format(props.end, 'MM/dd/yyyy')}` : null

//   const value = `${startDate}${endDate !== null ? endDate : ''}`
//   props.start === null && props.dates.length && props.setDates ? props.setDates([]) : null
//   const updatedProps = { ...props }
//   delete updatedProps.setDates

//   return <TextField fullWidth inputRef={ref} {...updatedProps} label={props.label || ''} value={value} />
// })
/* eslint-enable */

const InvoiceList = () => {
  // ** State
  // const [dates, setDates] = useState<Date[]>([])
  const [statusValue, setStatusValue] = useState<string>('')
  const [sortValue, setSortValue] = useState('')
  const [approveOrRejectDialogOpen, setApproveOrRejectDialogOpen] = useState(false)
  const [selectedItem, SetselectedItem] = useState<any>({})
  const [rejectionComment, setRejectionComment] = useState('')

  // const [endDateRange, setEndDateRange] = useState<DateType>(null)

  // const [selectedRows, setSelectedRows] = useState<GridRowId[]>([])
  // const [startDateRange, setStartDateRange] = useState<DateType>(null)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.manageProfile)

  useEffect(() => {
    dispatch(
      fetchData({
        PageNumber: paginationModel.page,
        PageSize: paginationModel.pageSize,
        Sort: sortValue,
        'Filters.ApprovalStatus': statusValue,
        'Filters.UserAccountGuid': ''
      })
    )
  }, [dispatch, statusValue, sortValue, paginationModel])

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }
  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    const arrayresult = sortModel.map(item => {
      debugger
      if (item.sort == 'desc') {
        return '-' + item.field
      }

      return item.field
    })
    const result = arrayresult.join(' ')
    setSortValue(result)

    // Here you save the data you need from the sort model
    // setQueryOptions({ sortModel: [...sortModel] });
  }, [])

  // const handleOnChangeRange = (dates: any) => {
  //   const [start, end] = dates
  //   if (start !== null && end !== null) {
  //     setDates(dates)
  //   }
  //   setStartDateRange(start)
  //   setEndDateRange(end)
  // }
  const handleApproveOrRejectDialogOpen = (item: any) => {
    SetselectedItem(item)
    setApproveOrRejectDialogOpen(true)
  }
  const handleApproveOrRejectDialogClose = () => {
    SetselectedItem({})
    setApproveOrRejectDialogOpen(false)
  }
  const handleApproveOrReject = (decision: number) => {
    const data = {
      changeRequestGuid: selectedItem.globalId,
      decision,
      rejectionComment: rejectionComment
    }
    dispatch(approveOrRejectProfile(data)).then(() => {
      handleApproveOrRejectDialogClose()
    })
  }
  const columns: GridColDef[] = [
    ...defaultColumns,
    {
      flex: 0.1,
      minWidth: 130,
      sortable: false,
      field: 'actions',
      headerName: 'Actions',
      renderCell: ({ row }: CellType) => {
        const { approvalStatusDisplayName } = row

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='View'>
              <IconButton
                size='small'
                component={Link}
                sx={{ mr: 0.5 }}
                href={`/manage/profile/preview/${row.globalId}`}
              >
                <Icon icon='mdi:eye-outline' />
              </IconButton>
            </Tooltip>
            {approvalStatusDisplayName == 'Pending' && (
              <Tooltip title='Approve/Reject'>
                <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleApproveOrRejectDialogOpen(row)}>
                  <Icon icon='mdi:stamper' />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        )
      }
    }
  ]

  return (
    <DatePickerWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Filters' />
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='invoice-status-select'>Approval Status</InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label='Invoice Status'
                      onChange={handleStatusValue}
                      labelId='invoice-status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      <MenuItem value='0'>Draft</MenuItem>
                      <MenuItem value='1'>Pending</MenuItem>
                      <MenuItem value='2'>Approved</MenuItem>
                      <MenuItem value='3'>Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <DatePicker
                    isClearable
                    selectsRange
                    monthsShown={2}
                    endDate={endDateRange}
                    selected={startDateRange}
                    startDate={startDateRange}
                    shouldCloseOnSelect={false}
                    id='date-range-picker-months'
                    onChange={handleOnChangeRange}
                    customInput={
                      <CustomInput
                        dates={dates}
                        setDates={setDates}
                        label='Invoice Date'
                        end={endDateRange as number | Date}
                        start={startDateRange as number | Date}
                      />
                    }
                  />
                </Grid> */}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <DataGrid
              autoHeight
              pagination
              rows={store.data}
              columns={columns}
              getRowId={row => row.globalId}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              onSortModelChange={handleSortModelChange}
            />
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={approveOrRejectDialogOpen}
        onClose={handleApproveOrRejectDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Approve / Reject'}</DialogTitle>
        <DialogContent>
          <Typography>Approve Or Reject For User: {selectedItem.username}</Typography>
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
    </DatePickerWrapper>
  )
}
InvoiceList.acl = {
  action: 'read',
  subject: 'manage-profiles'
}
export default InvoiceList
