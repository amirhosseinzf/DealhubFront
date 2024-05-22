import LoadingButton from '@mui/lab/LoadingButton'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  Typography
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React, { ChangeEvent, useRef, useState } from 'react'
import {
  Cropper,
  CropperPreview,
  CropperState,
  CropperImage,
  CropperTransitions,
  CropperPreviewRef,
  CropperRef
} from 'react-advanced-cropper'

interface PreviewState {
  state: CropperState | null
  image: CropperImage | null
  transitions: CropperTransitions | null
  loading?: false
  loaded?: false
}
import 'react-advanced-cropper/dist/style.css'
import toast from 'react-hot-toast'
import Icon from 'src/@core/components/icon'
import axiosInterceptorInstance from 'src/@core/utils/axiosInterceptorInstance'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />
})

interface Image {
  type?: string
  src: string
}
type Props = {
  id: string
  title: string
  url: string
  params: Params
}
type Params = {
  referenceEntityGuid: string
  flag: string
  description?: string
}

const FileUplader = ({ id, title, url, params }: Props) => {
  const previewRef = useRef<CropperPreviewRef>(null)
  const cropperRef = useRef<CropperRef>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [loadingBtn, setloadingBtn] = useState(false)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<Image | null>(null)
  const onUpload = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }
  const onLoadImage = (event: ChangeEvent<HTMLInputElement>) => {
    // Reference to the DOM input element
    const { files } = event.target

    // Ensure that you have a file before attempting to read it
    if (files && files[0]) {
      // Create the blob link to the file to optimize performance:
      const blob = URL.createObjectURL(files[0])

      setImage({
        src: blob,
        type: files[0].type
      })
    }

    event.target.value = ''
  }
  const onUpdate = () => {
    previewRef.current?.refresh()
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setImage(null)
    setOpen(false)
  }
  const onUploadToServer = () => {
    debugger
    setloadingBtn(true)
    const canvas = cropperRef.current?.getCanvas()
    if (canvas) {
      const form = new FormData()

      canvas.toBlob(blob => {
        if (blob) {
          form.append('file', blob, 'cropImage.png')
          axiosInterceptorInstance
            .post(url, form, { params })
            .then(() => {
              toast.success('successfully uploaded')
            })
            .finally(() => setloadingBtn(false))
        }
      }, 'image/png')
    }
  }

  return (
    <>
      <Button variant='outlined' onClick={handleClickOpen}>
        <Icon style={{ marginRight: '10px' }} icon='mdi:cloud-upload-outline' /> {title}
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle>
          Select Your Picture:
          <Button onClick={onUpload} sx={{ float: 'right', marginLeft: '10px' }} variant='outlined'>
            Select Image
            <input hidden ref={inputRef} type='file' accept='image/*' onChange={onLoadImage} />
          </Button>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-slide-description'>
            <Grid container>
              <Grid item xs={6}>
                <Cropper
                  ref={cropperRef}
                  className='cropper'
                  stencilProps={{}}
                  src={image && image.src}
                  onUpdate={onUpdate}
                />
              </Grid>

              {image && (
                <Grid item xs={6}>
                  <Typography sx={{ textAlign: 'center' }}>preview:</Typography>
                  <CropperPreview style={{ maxWidth: 150, maxHeight: 150 }} ref={previewRef} cropper={cropperRef} />
                </Grid>
              )}
            </Grid>
          </DialogContentText>
        </DialogContent>
        {image && (
          <DialogActions>
            <Button onClick={handleClose}>close</Button>
            <LoadingButton
              onClick={onUploadToServer}
              loading={loadingBtn}
              loadingIndicator='Loading…'
              variant='outlined'
            >
              Upload
            </LoadingButton>
          </DialogActions>
        )}
      </Dialog>
    </>
  )
}

export default FileUplader
