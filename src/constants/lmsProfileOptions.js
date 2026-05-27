const currentYear = new Date().getFullYear()

export const EDUCATION_LEVEL_OPTIONS = [
    { value: '', label: 'Выбрать уровень образования' },
    { value: 'p', label: 'Учёная степень' },
    { value: 'm', label: 'Магистратура или специалитет' },
    { value: 'b', label: 'Степень бакалавра' },
    { value: 'a', label: 'Незаконченное высшее образование' },
    { value: 'hs', label: 'Среднее' },
    { value: 'jhs', label: 'Незаконченное среднее' },
    { value: 'el', label: 'Начальное' },
    { value: 'none', label: 'Нет формального образования' },
    { value: 'other', label: 'Другое образование' },
]

export const GENDER_OPTIONS = [
    { value: '', label: 'Выбрать пол' },
    { value: 'm', label: 'Мужской' },
    { value: 'f', label: 'Женский' },
    { value: 'o', label: 'Другое' },
]

export const YEAR_OF_BIRTH_OPTIONS = [
    { value: '', label: 'Выбрать год рождения' },
    ...Array.from({ length: currentYear - 1900 + 1 }, (_, i) => {
        const year = currentYear - i
        return { value: year, label: String(year) }
    }),
]

export const COUNTRY_OPTIONS = [
    { value: '', label: 'Выбрать страну' },
    { value: 'RU', label: 'Россия' },
    { value: 'BY', label: 'Беларусь' },
    { value: 'KZ', label: 'Казахстан' },
    { value: 'UA', label: 'Украина' },
    { value: 'UZ', label: 'Узбекистан' },
    { value: 'AM', label: 'Армения' },
    { value: 'AZ', label: 'Азербайджан' },
    { value: 'GE', label: 'Грузия' },
    { value: 'KG', label: 'Киргизия' },
    { value: 'MD', label: 'Молдова' },
    { value: 'TJ', label: 'Таджикистан' },
    { value: 'TM', label: 'Туркменистан' },
    { value: 'IN', label: 'Индия' },
    { value: 'CN', label: 'Китай' },
    { value: 'US', label: 'США' },
    { value: 'DE', label: 'Германия' },
    { value: 'FR', label: 'Франция' },
    { value: 'GB', label: 'Великобритания' },
    { value: 'TR', label: 'Турция' },
    { value: 'IL', label: 'Израиль' },
    { value: 'AE', label: 'ОАЭ' },
    { value: 'OTHER', label: 'Другое' },
]

export const SPOKEN_LANGUAGE_OPTIONS = [
    { value: '', label: 'Выбрать язык' },
    { value: 'ru', label: 'Русский' },
    { value: 'en', label: 'Английский' },
    { value: 'or', label: 'Oriya' },
    { value: 'hi', label: 'Хинди' },
    { value: 'zh-cn', label: 'Китайский' },
    { value: 'de', label: 'Немецкий' },
    { value: 'fr', label: 'Французский' },
    { value: 'es', label: 'Испанский' },
    { value: 'ar', label: 'Арабский' },
    { value: 'tr', label: 'Турецкий' },
    { value: 'kk', label: 'Казахский' },
    { value: 'uk', label: 'Украинский' },
    { value: 'uz', label: 'Узбекский' },
    { value: 'other', label: 'Другое' },
]
