import axios from 'axios'
import i18n from '../i18n'

// all calls go to the backend (docs: http://localhost:5000/scalar)
const API_URL = `${import.meta.env.VITE_API_URL ?? ''}/api`
const lang = () => i18n.resolvedLanguage ?? 'en'

export const api = axios.create({ baseURL: API_URL, timeout: 15000 })

// send the current language on every request
api.interceptors.request.use((config) => {
  config.params = { ...config.params, lang: lang() }
  return config
})

const get = (url, params) => api.get(url, { params }).then((r) => r.data)
const post = (url, body) => api.post(url, body).then((r) => r.data)

export const getHealth = () => get('/health')

// probes - filters: destination, status, type, search
export const getProbes = (filters) => get('/probes', filters)
export const getProbe = (id) => get(`/probes/${id}`)
export const getProbeHardware = (id) => get(`/probes/${id}/hardware`)

// missions
export const getMissions = (destination) => get('/missions', { destination })
export const getEnvironments = () => get('/missions/environments')

// hardware (game parts)
export const getHardware = (category) => get('/hardware', { category })
export const getHardwareByCategory = () => get('/hardware/by-category')

// simulation
// components = { Power: "mmrtg", Thermal: "rhu", ... }
export const simulate = (probeId, components, targetDays) => post('/simulation', { probeId, components, targetDays })
export const simulateOriginal = (probeId) => get(`/simulation/${probeId}/original`)

// libras (VLibras only takes Portuguese, the backend handles that)
export const translateToLibras = (text) => post('/libras/translate', { text })
export const translateProbeToLibras = (id) => get(`/libras/probes/${id}`)

// audio narration (blind users). *Url can go straight into <audio src>
export const probeAudioUrl = (id, rate = 0) => `${API_URL}/audio/probes/${id}?rate=${rate}&lang=${lang()}`
export const getProbeNarration = (id) => get(`/audio/probes/${id}/text`)
export const getSimulationNarration = (req) => post('/audio/simulation/text', req)
const audioBlob = (url, body) => api.post(url, body, { responseType: 'blob' }).then((r) => URL.createObjectURL(r.data))
// these return a blob: url
export const speakText = (text, rate = 0) => audioBlob('/audio/speak', { text, rate })
export const simulationAudio = (req) => audioBlob('/audio/simulation', req)

// fallback when the backend returns 502: use the browser voice
export const speakInBrowser = (text) => {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = { en: 'en-US', pt: 'pt-BR', es: 'es-ES', fr: 'fr-FR' }[lang()] ?? 'en-US'
  window.speechSynthesis.speak(utterance)
  return true
}
