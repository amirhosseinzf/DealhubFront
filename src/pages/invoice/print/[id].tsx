// ** React Imports
import { ReactNode } from 'react'

// ** Next Import
import { GetStaticPaths, GetStaticProps, GetStaticPropsContext, InferGetStaticPropsType } from 'next/types'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import { InvoiceType } from 'src/types/invoiceTypes'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Components Imports
import PrintPage from 'src/views/invoice/print/PrintPage'

const InvoicePrint = ({ id }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <PrintPage id={id} />
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get('/invoice/invoices')
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
