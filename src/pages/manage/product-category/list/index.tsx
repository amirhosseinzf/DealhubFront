// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
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
import { fetchData, approveOrRejectProfile } from 'src/store/manageProductCategories'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'
import { ThemeColor } from 'src/@core/layouts/types'

// import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip } from '@mui/material'
import { ManageProductCategories } from 'src/types/manageProductCategories'

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
  row: ManageProductCategories
}

// ** Vars
const invoiceStatusObj: InvoiceStatusObj = {
  Draft: { color: 'primary', icon: 'mdi:content-save-outline' },
  Pending: { color: 'warning', icon: 'mdi:progress-clock' },
  Active: { color: 'success', icon: 'mdi:check' },
  Disabled: { color: 'error', icon: 'mdi:information-outline' }
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    headerName: 'Name',
    field: 'name'
  },
  {
    flex: 0.1,
    headerName: 'Display Order',
    field: 'Display Order',
    minWidth: 100
  },
  {
    flex: 0.1,
    headerName: 'IsDefault',
    field: 'isDefault',
    minWidth: 100,
    renderCell: ({ row }: CellType) => {
      const { isDefault } = row

      return <Icon color={isDefault ? 'success' : 'error'} icon={isDefault ? 'mdi:check' : 'mdi:close'}></Icon>
    }
  },
  {
    flex: 0.1,
    minWidth: 80,
    field: 'status',

    renderCell: ({ row }: CellType) => {
      const { status } = row

      const color = invoiceStatusObj[status] ? invoiceStatusObj[status].color : 'primary'

      return <CustomChip icon={<Icon icon={invoiceStatusObj[status].icon}></Icon>} color={color} label={status} />
    }
  },
  {
    flex: 0.1,
    headerName: 'Last Modify Date',
    field: 'lastModifyDate',
    minWidth: 300,
    renderCell: ({ row }: CellType) => {
      const { lastModifyDate } = row

      return (
        <Typography noWrap variant='caption'>
          {new Date(lastModifyDate).toLocaleString()}
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

const ProductCategoryList = () => {
  // ** State
  const [statusValue, setStatusValue] = useState<string>('')
  const [nameContainsValue, setNameContainsValue] = useState<string>('')
  const [sortValue, setSortValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, SetselectedItem] = useState<any>({})
  const [rejectionComment, setRejectionComment] = useState('')

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.manageProductCategories)

  useEffect(() => {
    dispatch(
      fetchData({
        PageNumber: paginationModel.page,
        PageSize: paginationModel.pageSize,
        Sort: sortValue,
        'Filters.Status': statusValue,
        'Filters.NameContains': nameContainsValue
      })
    )
  }, [dispatch, statusValue, sortValue, paginationModel, nameContainsValue])

  const handleStatusValue = (e: SelectChangeEvent) => {
    setStatusValue(e.target.value)
  }
  const handleNameContainsValue = (e: any) => {
    setNameContainsValue(e.target.value)
  }
  const handleSortModelChange = useCallback((sortModel: GridSortModel) => {
    const arrayresult = sortModel.map(item => {
      if (item.sort == 'desc') {
        return '-' + item.field
      }

      return item.field
    })
    const result = arrayresult.join(' ')
    setSortValue(result)
  }, [])

  const handleDeleteDialogOpen = (item: any) => {
    SetselectedItem(item)
    setDeleteDialogOpen(true)
  }
  const handleDeleteDialogClose = () => {
    SetselectedItem({})
    setDeleteDialogOpen(false)
  }
  const handleApproveOrReject = (decision: number) => {
    const data = {
      changeRequestGuid: selectedItem.globalId,
      decision,
      rejectionComment: rejectionComment
    }
    dispatch(approveOrRejectProfile(data)).then(() => {
      handleDeleteDialogClose()
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
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title='Edit'>
              <IconButton
                size='small'
                component={Link}
                sx={{ mr: 0.5 }}
                href={`/manage/product-category/Edit/${row.globalId}`}
              >
                <Icon icon='mdi:pencil-box-outline' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Delete'>
              <IconButton size='small' sx={{ mr: 0.5 }} onClick={() => handleDeleteDialogOpen(row)}>
                <Icon icon='mdi:delete-outline' />
              </IconButton>
            </Tooltip>
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
                    <InputLabel id='invoice-status-select'>Name</InputLabel>

                    <TextField label='Name' onChange={handleNameContainsValue}></TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id='status-select'>Status</InputLabel>

                    <Select
                      fullWidth
                      value={statusValue}
                      sx={{ mr: 4, mb: 2 }}
                      label='Status'
                      onChange={handleStatusValue}
                      labelId='status-select'
                    >
                      <MenuItem value=''>none</MenuItem>
                      <MenuItem value='0'>Draft</MenuItem>
                      <MenuItem value='1'>Active</MenuItem>
                      <MenuItem value='2'>Disabled</MenuItem>
                      <MenuItem value='3'>Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
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
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
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
          <Button onClick={handleDeleteDialogClose}>close</Button>
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
ProductCategoryList.acl = {
  action: 'read',
  subject: 'manage-profiles'
}
export default ProductCategoryList
