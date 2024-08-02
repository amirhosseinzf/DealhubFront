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
  InputLabel
} from '@mui/material'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'
import * as yup from 'yup'

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
  suggestedGrade: string
}

const schema = yup.object({
  suggestedGrade: yup.string().required(),
  comment: yup.string().required()
})

const ChangeGrid = () => {
  const [currentGrade, setCurrentGrade] = useState<any>(null)
  const router = useRouter()
  const id = router.query.id
  const fetchData = async () => {
    const serverData = await axiosInterceptorInstance.get(`/api/Grade/CurrentGrades/${id}`)
    setCurrentGrade(serverData.data)
  }
  useEffect(() => {
    if (id) fetchData()
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
      .post(`/api/Grade/PlaceSuggestion`, {
        tradeEntityProductCategoryGuid: id,
        suggestedGrade: Number(data.suggestedGrade),
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
        <CardHeader title=' Suggestion Grade' />
        {currentGrade != null && (
          <CardContent>
            <Typography>
              <strong>Current Grade :</strong>
              {currentGrade.currentGradeDisplayName}
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
                      name='suggestedGrade'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <>
                          <InputLabel id='controlled-open-select-label'>Suggested Grade</InputLabel>
                          <Select
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={Boolean(errors.suggestedGrade)}
                            label='Suggested Grade'
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
                    />
                    {errors.name && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.suggestedGrade.message}</FormHelperText>
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
