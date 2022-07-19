export const courseDescriptionParser = coursePage => {
    let descriptionText = ""

    const overviewFragment = new DOMParser().parseFromString(coursePage.overview, 'text/html')
    const about = overviewFragment.getElementsByClassName('about')[0].getElementsByTagName('p')
    for (let i = 0; i < about.length; i++) {
        descriptionText += about[i].innerHTML
        descriptionText += "\n"
    }

    return descriptionText
}