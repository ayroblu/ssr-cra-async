import { apiUrl } from './config'

const prefix = '/api'
export function getMain(){
  return fetch(`${apiUrl}${prefix}`).then(r=>r.json())
}
