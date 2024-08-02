// ** React Imports
import { useState, useEffect, useCallback } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { DataGrid, GridColDef, GridSortModel } from '@mui/x-data-grid'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
// import format from 'date-fns/format'
// import DatePicker from 'react-datepicker'

// ** Store & Actions Imports
import { useDispatch, useSelector } from 'react-redux'
import { fetchData } from 'src/store/manageGrade'

// ** Types Imports
import { RootState, AppDispatch } from 'src/store'

// import { DateType } from 'src/types/forms/reactDatepickerTypes'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Rating
} from '@mui/material'
import { ManageProductCategories } from 'src/types/manageProductCategories'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'

interface CellType {
  row: any
}

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    headerName: 'Entity name',
    field: 'entityDisplayName'
  },
  {
    flex: 0.1,
    headerName: 'Specialization',
    field: 'specializationDisplayName'
  },
  {
    flex: 0.1,
    headerName: 'Product category',
    field: 'productCategoryName',
    minWidth: 100
  },
  {
    flex: 0.1,
    headerName: 'Current grade',
    field: 'currentGradeDisplayName',
    minWidth: 100,
    renderCell: ({ row }: CellType) => {
      const { currentGradeDisplayName, currentGrade } = row

      return (
        <>
          {currentGrade && (
            <>
              <Rating name='hover-feedback' value={currentGrade / 20} max={4} precision={0.5} size='medium' readOnly />
              <Box sx={{ ml: 2 }}>{currentGradeDisplayName}</Box>
            </>
          )}
          {!currentGrade && <CustomChip color='info' label={currentGradeDisplayName} />}
        </>
      )
    }
  },
  {
    flex: 0.1,
    headerName: 'Last Grade Date',
    field: 'lastGradeDate',
    minWidth: 300,
    renderCell: ({ row }: CellType) => {
      const { lastGradeDate } = row

      return (
        <Typography noWrap variant='caption'>
          {lastGradeDate ? new Date(lastGradeDate).toLocaleString() : '----'}
        </Typography>
      )
    }
  }
]

const GridList = () => {
  const auth = useAuth()
  const hasRole = (role: string) => {
    return auth.user?.userRoles.some(value => value.code == role)
  }

  // ** State
  const [sortValue, setSortValue] = useState('')
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedItem, SetselectedItem] = useState<any>({})
  const [tradeItems, setTradeItems] = useState([])
  const [tradeSelected, setTradeSelected] = useState('')
  const [productCategoriesItems, setProductCategoriesItems] = useState([])
  const [productCategorySelected, setProductCategorySelected] = useState('')
  const [gradeHistory, setGradeHistory] = useState([])

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.manageGrid)
  const fetchTrade = () => {
    axiosInterceptorInstance.get('/api/TradeEntity/GetList').then(({ data }) => {
      setTradeItems(data.items)
    })
  }
  const fetchProductCategories = () => {
    axiosInterceptorInstance.get('/api/ProductCategory/GetList').then(({ data }) => {
      setProductCategoriesItems(data.items)
    })
  }
  useEffect(() => {
    dispatch(
      fetchData({
        PageNumber: paginationModel.page + 1,
        PageSize: paginationModel.pageSize,
        Sort: sortValue,
        'Filters.TradeEntityGuid': tradeSelected,
        'Filters.ProductCategoryGuid': productCategorySelected
      })
    )
  }, [dispatch, tradeSelected, sortValue, paginationModel, productCategorySelected])
  useEffect(() => {
    fetchTrade()
    fetchProductCategories()
  }, [])

  const handleTradeValue = (e: any, value: any) => {
    setTradeSelected(value ? value.globalId : '')
  }
  const handleProductCategoryValue = (e: any, value: any) => {
    setProductCategorySelected(value ? value.globalId : '')
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

  const handleHistoryDialogOpen = (item: any) => {
    axiosInterceptorInstance
      .get('/api/Grade/GetGradeHistory', {
        params: { TradeEntityProductCategoryGuid: item.tradeEntityProductCategoryGuid }
      })
      .then(({ data }) => {
        setGradeHistory(data)
      })
    SetselectedItem(item)
    setHistoryDialogOpen(true)
  }
  const handleHistoryDialogClose = () => {
    SetselectedItem({})
    setGradeHistory([])
    setHistoryDialogOpen(false)
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
            <Tooltip title='View History'>
              <IconButton size='small' onClick={() => handleHistoryDialogOpen(row)}>
                <Icon icon='mdi:history' />
              </IconButton>
            </Tooltip>
            {hasRole('Expert') && (
              <Tooltip title='Place Suggestion'>
                <IconButton
                  size='small'
                  sx={{ mr: 0.5 }}
                  component={Link}
                  href={`/manage/grade/place-suggestion/${row.tradeEntityProductCategoryGuid}`}
                >
                  <Icon icon='mdi:cube-outline' />
                </IconButton>
              </Tooltip>
            )}
            {hasRole('ProcessAdmin') && (
              <Tooltip title='Change Grade'>
                <IconButton
                  size='small'
                  sx={{ mr: 0.5 }}
                  component={Link}
                  href={`/manage/grade/change-grade/${row.tradeEntityProductCategoryGuid}`}
                >
                  <Icon icon='mdi:star' />
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
                  <Autocomplete
                    fullWidth
                    options={productCategoriesItems}
                    getOptionLabel={(option: any) => option.name}
                    onChange={handleProductCategoryValue}
                    renderInput={params => <TextField {...params} label='Product Category' />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    options={tradeItems}
                    getOptionLabel={(option: any) => option.displayName}
                    onChange={handleTradeValue}
                    renderInput={params => <TextField {...params} label='Trade' />}
                  />
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
              paginationMode='server'
              rowCount={store.totalCount}
              rows={store.data}
              columns={columns}
              getRowId={row => row.tradeEntityProductCategoryGuid}
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
        maxWidth='lg'
        open={historyDialogOpen}
        onClose={handleHistoryDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'View History'}</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>Entity name :</strong> {selectedItem.entityDisplayName}
          </Typography>
          <Typography>
            {' '}
            <strong>Product category :</strong> {selectedItem.productCategoryName}
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Event Description</TableCell>
                  <TableCell>Comment</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gradeHistory.map((row: any, index: number) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th' scope='row'>
                      {row.eventDate ? new Date(row.eventDate).toLocaleString() : '----'}
                    </TableCell>
                    <TableCell>{row.eventDescription}</TableCell>
                    <TableCell>{row.comment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {gradeHistory.length == 0 && <p>No History</p>}
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleHistoryDialogClose}>close</Button>
        </DialogActions>
      </Dialog>
    </DatePickerWrapper>
  )
}
GridList.acl = {
  action: 'read',
  subject: 'grade-controller'
}
export default GridList
