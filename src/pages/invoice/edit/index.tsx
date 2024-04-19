// ** Demo Components Imports
import Edit from 'src/views/invoice/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const InvoiceEdit = () => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id='4987' />
    </DatePickerWrapper>
  )
}
InvoiceEdit.acl = {
  action: 'manage',
  subject: 'UserManagment'
}
export default InvoiceEdit
