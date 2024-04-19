// ** React Imports
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintPage from 'src/views/invoice/print/PrintPage'

const InvoicePrint = () => {
  return <PrintPage id='4987' />
}

InvoicePrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

InvoicePrint.setConfig = () => {
  return {
    mode: 'light'
  }
}
InvoicePrint.acl = {
  action: 'manage',
  subject: 'UserManagment'
}
export default InvoicePrint
