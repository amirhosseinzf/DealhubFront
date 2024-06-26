// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Types
import { InvoiceType } from 'src/types/invoiceTypes'

// ** Demo Components Imports
import Edit from 'src/views/invoice/edit/Edit'

// ** Styled Component
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'

const InvoiceEdit = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <DatePickerWrapper sx={{ '& .react-datepicker-wrapper': { width: 'auto' } }}>
      <Edit id={id} />
    </DatePickerWrapper>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axiosInterceptorInstance.get('/invoice/invoices')
  const data: InvoiceType[] = await res.data.allData

  const paths = data.map((item: InvoiceType) => ({
    params: { id: `${item.id}` }
  }))

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = ({ params }: GetStaticPropsContext) => {
  return {
    props: {
      id: params?.id
    }
  }
}
InvoiceEdit.acl = {
  action: 'manage',
  subject: 'UserManagment'
}
export default InvoiceEdit
