// ** Demo Components Imports
import Preview from 'src/views/invoice/preview/Preview'

const InvoicePreview = () => {
  return <Preview id='4987' />
}
InvoicePreview.acl = {
  action: 'manage',
  subject: 'UserManagment'
}
export default InvoicePreview
