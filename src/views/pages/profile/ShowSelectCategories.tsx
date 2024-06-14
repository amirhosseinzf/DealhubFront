import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import React, { useContext } from 'react'
import { ProfileContext } from 'src/context/ProfileContext'

type Props = {
  roleTitle: string
}

function ShowSelectCategories({ roleTitle }: Props) {
  const { activeProfileForm } = useContext(ProfileContext)

  const rows = activeProfileForm
    ? activeProfileForm[roleTitle] != null
      ? activeProfileForm[roleTitle].productCategories
      : []
    : []

  return (
    <Card>
      <CardHeader title={`Your ${roleTitle} Categories : `} />
      <CardContent>
        <Grid container>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell>ProductCategory Name</TableCell>
                    <TableCell>Current Grade</TableCell>
                    <TableCell>Last GradeDate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => (
                    <TableRow key={row.productCategoryGuid} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component='th' scope='row'>
                        {row.productCategoryName}
                      </TableCell>
                      <TableCell component='th' scope='row'>
                        {row.currentGrade}
                      </TableCell>
                      <TableCell>
                        {row.lastGradeDate != null ? new Date(row.lastGradeDate).toLocaleString() : '--'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default ShowSelectCategories
