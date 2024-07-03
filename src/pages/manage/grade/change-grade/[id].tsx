import { yupResolver } from '@hookform/resolvers/yup'
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Rating,
  Box
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import * as yup from 'yup'

const labels: { [index: string]: string } = {
  0.5: 'A',
  1: 'B',
  1.5: 'C',
  2: 'D',
  2.5: 'E',
  3: 'F',
  3.5: 'G',
  4: 'H'
}
function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`
}
const gradeOptions = [
  { lablel: 'A', value: 10 },
  { lablel: 'B', value: 20 },
  { lablel: 'C', value: 30 },
  { lablel: 'D', value: 40 },
  { lablel: 'E', value: 50 },
  { lablel: 'F', value: 60 },
  { lablel: 'G', value: 70 },
  { lablel: 'H', value: 80 }
]
type GradeType = {
  comment: string
  newGrade: string
}

const schema = yup.object({
  newGrade: yup.string().required(),
  comment: yup.string().required()
})

const ChangeGrid = () => {
  const [currentGrade, setCurrentGrade] = useState<any>(null)
  const [hover, setHover] = useState(-1)

  const router = useRouter()
  const id = router.query.id
  const fetchData = async () => {
    const serverData = await axiosInterceptorInstance.get(`/api/Grade/CurrentGrades/${id}`)
    setCurrentGrade(serverData.data)
  }
  useEffect(() => {
    fetchData()
  }, [id])

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  const submitForm = async (data: GradeType) => {
    axiosInterceptorInstance
      .post(`/api/Grade/SetGrade `, {
        tradeEntityProductCategoryGuid: id,
        newGrade: Number(data.newGrade),
        comment: data.comment
      })
      .then(() => {
        toast.success('suucessfully set grade')
        router.back()
      })
  }

  return (
    <>
      <Button sx={{ margin: '10px' }} onClick={() => router.back()} variant='contained' color='primary'>
        back
      </Button>
      <Card>
        <CardHeader title=' Change Grade' />
        {currentGrade != null && (
          <CardContent>
            <Typography sx={{ display: 'flex' }}>
              <strong>Current Grade :</strong>
              {currentGrade.currentGrade && (
                <>
                  <Rating
                    name='hover-feedback'
                    value={currentGrade.currentGrade / 20}
                    max={4}
                    precision={0.5}
                    size='large'
                    readOnly
                  />
                  <Box sx={{ ml: 2 }}>{currentGrade.currentGradeDisplayName}</Box>
                </>
              )}
              {!currentGrade.currentGrade && currentGrade.currentGradeDisplayName}
            </Typography>
            <Typography>
              <strong>Last Grade Date : </strong>
              {currentGrade.lastGradeDate ? new Date(currentGrade.lastGradeDate).toLocaleString() : '----'}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <form noValidate autoComplete='off' onSubmit={handleSubmit(submitForm)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='newGrade'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => {
                        console.log(value)
                        const rateValue = value / 20

                        return (
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <Box sx={{ ml: 2 }}>New Grade : </Box>
                            <Rating
                              name='hover-feedback'
                              value={rateValue}
                              max={4}
                              precision={0.5}
                              size='large'
                              getLabelText={getLabelText}
                              onChange={(event, newValue) => {
                                if (newValue && newValue != -1) {
                                  event.target.value = newValue * 20
                                  onChange(event)
                                }
                              }}
                              onChangeActive={(event, newHover) => {
                                setHover(newHover)
                              }}
                            />
                            {rateValue !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rateValue]}</Box>}
                          </Box>
                        )
                      }}
                    />

                    {/* <Controller
                      name='newGrade'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <>
                          <InputLabel id='controlled-open-select-label'>New Grade</InputLabel>
                          <Select
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={Boolean(errors.newGrade)}
                            label='New Grade'
                            labelId='controlled-open-select-label'
                          >
                            {gradeOptions.map(item => (
                              <MenuItem key={item.value} value={item.value}>
                                {item.lablel}
                              </MenuItem>
                            ))}
                          </Select>
                        </>
                      )}
                    /> */}
                    {errors.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.newGrade.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='comment'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <TextField
                          type='textarea'
                          multiline
                          rows={5}
                          label='Comment'
                          value={value}
                          onBlur={onBlur}
                          onChange={onChange}
                          error={Boolean(errors.comment)}
                          placeholder='Comment'
                        />
                      )}
                    />
                    {errors.comment && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.comment.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
              <Button type='submit' variant='contained' color='primary'>
                Submit
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
    </>
  )
}
ChangeGrid.acl = {
  action: 'read',
  subject: 'grade-controller'
}
export default ChangeGrid
