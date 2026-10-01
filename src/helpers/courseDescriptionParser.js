// Plain-text course description from the Open edX overview HTML (<section class="about"><p>…).
// Returns '' when the overview is missing or has no .about section (it used to throw).
export const courseDescriptionParser = coursePage => {
    if (!coursePage?.overview) {
        return ''
    }
    const overviewFragment = new DOMParser().parseFromString(coursePage.overview, 'text/html')
    const [about] = overviewFragment.getElementsByClassName('about')
    if (!about) {
        return ''
    }
    return Array.from(about.getElementsByTagName('p'))
        .map(p => p.textContent.trim())
        .filter(Boolean)
        .join('\n')
}
