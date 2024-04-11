// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// import DatePicker from 'react-multi-date-picker'
// import persian from 'react-date-object/calendars/persian'
// import persian_fa from 'react-date-object/locales/persian_fa'
// import { TextField } from '@mui/material'

const SecondPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Create Awesome 🙌'></CardHeader>
          <CardContent>
            {/* <DatePicker
              render={(value: string, openCalendar: any) => (
                <TextField
                  size='small'
                  value={value}
                  onClick={() => openCalendar()}
                  sx={{ width: { sm: '250px', xs: '170px' }, '& .MuiInputBase-input': { color: 'text.secondary' } }}
                />
              )}
              calendar={persian}
              locale={persian_fa}
            /> */}
            <Typography sx={{ mb: 2 }}>This is your second page.</Typography>
            <Typography>
              Chocolate sesame snaps pie carrot cake pastry pie lollipop muffin. Carrot cake dragée chupa chups jujubes.
              Macaroon liquorice cookie wafer tart marzipan bonbon. Gingerbread jelly-o dragée chocolate.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SecondPage
