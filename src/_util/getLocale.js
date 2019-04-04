export function getComponentLocale(props, context, componentName, getDefaultLocale) {
  let locale = {}
  if (context && context.contextLocale && context.contextLocale[componentName]) {
    locale = context.contextLocale[componentName]
  } else {
    const defaultLocale = getDefaultLocale()
    locale = defaultLocale.default || defaultLocale
  }
  let result = Object.assign({}, locale)
  if (props.locale) {
    result = Object.assign({}, result, props.locale)
    if (props.locale.lang) {
      result.lang = Object.assign({}, locale.lang, props.locale.lang)
    }
  }
  return result
}
export function getLocaleCode(context) {
  const localeCode = context.contextLocale && context.contextLocale.locale
  // Had use LocaleProvide but didn't set locale
  if (context.contextLocale && context.contextLocale.exist && !localeCode) {
    return 'zh-cn'
  }
  return localeCode
}
