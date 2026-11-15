import { useEffect } from 'react'
import { usePreferences } from '../context/preferencesContext'

// official gov.br VLibras widget (avatar that signs the page text in Libras)
// https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras
const SCRIPT_SRC = 'https://vlibras.gov.br/app/vlibras-plugin.js'

export default function VLibrasWidget() {
  const { prefs } = usePreferences()

  useEffect(() => {
    const root = document.getElementById('vlibras-root')
    if (root) root.style.display = prefs.libras ? '' : 'none'
    if (!prefs.libras || document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => window.VLibras && new window.VLibras.Widget('https://vlibras.gov.br/app')
    document.body.appendChild(script)
  }, [prefs.libras])

  return (
    <div id="vlibras-root" vw="" className="enabled">
      <div vw-access-button="" className="active" />
      <div vw-plugin-wrapper="">
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  )
}
