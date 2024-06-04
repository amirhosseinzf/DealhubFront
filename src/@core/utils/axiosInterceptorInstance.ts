import axios from 'axios'
import toast from 'react-hot-toast'

const axiosInterceptorInstance = axios.create({
  baseURL: 'https://localhost' // Replace with your API base URL
})

// Request interceptor
axiosInterceptorInstance.interceptors.request.use(
  config => {
    // Modify the request config here (add headers, authentication tokens)
    // const accessToken = JSON.parse(localStorage.getItem("token"));

    // If token is present, add it to request's Authorization Header
    // if (accessToken) {
    //   if (config.headers) config.headers.token = accessToken;
    // }

    return config
  },
  error => {
    // Handle request errors here
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInterceptorInstance.interceptors.response.use(
  response => {
    // Modify the response data here
    return response
  },
  error => {
    // Handle response errors here
    debugger
    if (error.response.status === 401 || error.response.status === 419) {
      alert('Your time is up')
      location.reload()
    } else if (error.response.status === 403) {
      toast.error(error.response.data.Messages[0], {
        duration: 6000,
        position: 'top-center'
      })
    } else if (error.response.status === 400) {
      let errorText = ''
      error.response.data.Messages.forEach((element: string) => {
        errorText += element
        errorText += '\n'
      })
      toast.error(errorText, {
        duration: 6000,
        position: 'top-center'
      })
    }

    return Promise.reject(error)
  }
)

export default axiosInterceptorInstance
