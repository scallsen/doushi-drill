import { useTranslation } from '../i18n/index.jsx'

export default function SelectionError({ visible }) {
  const { t } = useTranslation()
  if (!visible) return null
  return (
    <div style={{ color: '#F5C842', fontSize: 11, marginTop: 6 }}>
      {t('errors.select_at_least_one')}
    </div>
  )
}
