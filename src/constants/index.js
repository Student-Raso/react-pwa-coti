const dateFormat = 'DD/MM/YYYY'
const dateUSFormat = 'YYYY-MM-DD'

const localTimeZone = "America/Hermosillo"
const NON_DIGIT = "/[^d]/g"

const timeFormat12 = 'h:mm a'
const timeFormat24 = 'HH:mm:ss'

const TIPO_PROJECTO_FIREBASE = "firebase"
const TIPO_PROJECTO_JWT = "jwt"

const stateOptions = [
  {
    value: 1,
    label: 'Planeación'
  },
  {
    value: 2,
    label: "En Proceso"
  },
  {
    value: 3,
    label: 'Finalizado'
  }
]

const tipoUsuarios = {
    ADMIN: 0,
    DESARROLLADOR: 1,
    USUARIO: 2
  }

export {
  dateFormat,
  dateUSFormat,
  localTimeZone,
  NON_DIGIT,
  timeFormat12,
  timeFormat24,
  TIPO_PROJECTO_FIREBASE,
  TIPO_PROJECTO_JWT,
  stateOptions,
  tipoUsuarios
}