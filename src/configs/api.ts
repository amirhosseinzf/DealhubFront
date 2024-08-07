const apiUrl = 'https://localhost'
export default {
  profileAttachment: `${apiUrl}/api/Profile/Attachment/Add`,
  getCountry: `${apiUrl}/api/Country/GetList`,
  getProductCategory: `${apiUrl}/api/ProductCategory/GetList`,
  getGrid: `${apiUrl}/api/Grade/CurrentGrades/GetList`,
  getCurrentProfile: `${apiUrl}/api/Profile/GetCurrent`,
  CreateOrEditProfile: `${apiUrl}/api/Profile/CreateOrEdit`,
  getChangesRequest: `${apiUrl}/api/Profile/ChangeRequest/GetList`,
  sendForEvaluation: `${apiUrl}/api/Profile/SendForEvaluation`
}
