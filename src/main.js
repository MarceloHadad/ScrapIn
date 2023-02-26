if (!companies) var companies = []
if (!recruiters) var recruiters = []
if (!jobs) var jobs = []

var hirersCards = document.querySelectorAll("div.hirer-card__container") // to get hirer info
var entityCards = document.querySelectorAll("div.entity-result") // to get entities info
var companyCards = document.querySelectorAll("div.job-card-container") // to get company info
var jobsDetails = document.querySelectorAll("div.jobs-details__main-content") // to get both job and hirer info

var oldCompaniesLength = companies.length
var oldRecruitersLength = recruiters.length
var oldJobsLength = jobs.length

companies.sort((a, b) => a.name > b.name)
recruiters.sort((a, b) => a.name > b.name)
jobs.sort((a, b) => a.title > b.title)

for (let i = 0; i < companyCards.length; i++) {
    let curCompany = companyCards[i]

    let comProfileUrl = curCompany.querySelector("a.app-aware-link") ? curCompany.querySelector("a.app-aware-link").href : curCompany.querySelector("a.job-card-container__company-name").href

    if (!comProfileUrl.includes("/company/")) continue

    let comName = curCompany.querySelector("a.app-aware-link").innerText

    let comDescription = ""

    let curCompanyObj = new Company(comName, comProfileUrl, comDescription)

    if (!companies.some(x => JSON.stringify(x) === JSON.stringify(curCompanyObj))) companies.push(curCompanyObj)
}

for (let i = 0; i < hirersCards.length; i++) {
    let curHirer = hirersCards[i]

    let recProfileUrl = curHirer.querySelector("a.app-aware-link").href

    if (!recProfileUrl.includes("/in/")) continue // it's not a person profile

    let recName = curHirer.querySelector("span.jobs-poster__name").innerText
    let recDescription = curHirer.querySelector("div.hirer-card__hirer-job-title").innerText
    let recConnDegree = curHirer.querySelector("div.hirer-card__connection-degree-container").innerText
    let recRequestStatus = ""

    let curHirerObj = new Recruiter(recName, recProfileUrl, recDescription, recConnDegree, recRequestStatus)

    if (!recruiters.some(x => JSON.stringify(x) === JSON.stringify(curHirerObj))) recruiters.push(curHirerObj)
}

for (let i = 0; i < jobsDetails.length; i++) {
    let curJob = jobsDetails[i]

    let jobTitle = curJob.querySelector("a.ember-view").innerText
    let jobUrl = curJob.querySelector("a").href
    let jobCompany = curJob.querySelector("span.jobs-unified-top-card__company-name").innerText
    let jobLocation = curJob.querySelector("span.jobs-unified-top-card__bullet").innerText
    let jobWorkplaceType = curJob.querySelector("span.jobs-unified-top-card__workplace-type") ? curJob.querySelector("span.jobs-unified-top-card__workplace-type").innerText : ""
    let jobDescription = curJob.querySelector("div.jobs-description__content").innerText
    let jobInsight = curJob.querySelector("div.mt1") ? curJob.querySelector("div.mt1").innerText : ""
    let jobLevel = curJob.querySelector("li.jobs-unified-top-card__job-insight").innerText.split(" · ") ? curJob.querySelector("li.jobs-unified-top-card__job-insight").innerText.split(" · ")[1] : ""

    let curJobObj = new Job(jobTitle, jobUrl, jobCompany, jobLocation, jobWorkplaceType, jobDescription, jobInsight, jobLevel)

    if (!jobs.some(x => JSON.stringify(x) === JSON.stringify(curJobObj))) jobs.push(curJobObj)
}

for (let i = 0; i < entityCards.length; i++) {
    let curItem = entityCards[i]

    let curUrl = curItem.querySelector("a.app-aware-link").href

    if (curUrl.includes("/in/")) {

        let recDivContent = curItem.querySelector("div.t-roman").innerText.split("\n")

        let recName = recDivContent.length >= 1 ? recDivContent[0] : ""
        let recProfileUrl = curUrl
        let recDescription = curItem.querySelector("div.entity-result__primary-subtitle").innerText
        let recConnDegree = recDivContent.length >= 4 ? recDivContent[3] : ""
        let recRequestStatus = curItem.querySelector("span.artdeco-button__text") ? curItem.querySelector("span.artdeco-button__text").innerText : ""

        let curRecruiter = new Recruiter(recName, recProfileUrl, recDescription, recConnDegree, recRequestStatus)

        if (!recruiters.some(x => JSON.stringify(x) === JSON.stringify(curRecruiter))) recruiters.push(curRecruiter)
        continue
    }

    if (curUrl.includes("/company")) {
        let recDivContent = curItem.querySelector("div.t-roman").innerText.split("\n")

        let comName = recDivContent.length >= 1 ? recDivContent[0] : ""
        let comProfileUrl = curUrl
        let comDescription = curItem.querySelector("div.entity-result__primary-subtitle").innerText

        let curCompany = new Company(comName, curUrl, comDescription)

        if (!companies.some(x => JSON.stringify(x) === JSON.stringify(curCompany))) companies.push(curCompany)
        continue
    }

    if (curUrl.includes("/jobs/")) {
        let jobTitle = curItem.querySelector("span.entity-result__title-line").innerText
        let jobUrl = curUrl
        let jobCompany = curItem.querySelector("div.entity-result__primary-subtitle").innerText
        let secondarySubtitle = curItem.querySelector("div.entity-result__secondary-subtitle").innerText.split("(")
        let jobLocation = secondarySubtitle[0]
        let jobWorkplaceType = secondarySubtitle.length >=2 ? secondarySubtitle[1].replace(")", "") : ""
        let jobDescription = ""
        let jobInsight = ""

        let curJobObj = new Job(jobTitle, jobUrl, jobCompany, jobLocation, jobWorkplaceType, jobDescription, jobInsight)

        if (!jobs.some(x => JSON.stringify(x) === JSON.stringify(curJobObj))) jobs.push(curJobObj)
        continue
    }
}

var companiesLengthDiff = companies.length - oldCompaniesLength
var recruitersLengthDiff = recruiters.length - oldRecruitersLength
var jobsLengthDiff = jobs.length - oldJobsLength

var textToAlert = ""

if (companiesLengthDiff > 0) {
    textToAlert += (companiesLengthDiff > 1) ? `${companiesLengthDiff} companies added!\n` : `${companiesLengthDiff} company added!\n`
    console.log(companies)
}

if (recruitersLengthDiff > 0) {
    textToAlert += (recruitersLengthDiff > 1) ? `${recruitersLengthDiff} recruiters added!\n` : `${recruitersLengthDiff} recruiter added!\n`
    console.log(recruiters)
}

if (jobsLengthDiff > 0) {
    textToAlert +=(jobsLengthDiff > 1) ? `${jobsLengthDiff} jobs added!\n` : `${jobsLengthDiff} job added!\n`
    console.log(jobs)
}

if(textToAlert.length > 0) alert(textToAlert)