if (!companies) var companies = []
if (!recruiters) var recruiters = []
if (!jobs) var jobs = []

// links selectors
var urlSelector = "a.app-aware-link"
var jobUrlSelector = "a.ember-view"
var jobCompanyUrlSelector = ".job-card-container__company-name"

// entity selectors
var entitySelector = "div.entity-result"
var curEntityTitleSelector = ".entity-result__title-line" // title|jobs, name|products, name|companies, name, connDegree|people
var entitySubtitleSelector = ".entity-result__primary-subtitle" // company|jobs, category|products, category|companies, title|people
var entitySecondarySubtitleSelector = ".entity-result__secondary-subtitle" // location and workplace type|jobs, owner|products, followers|people, location|people
var entitySummarySelector = ".entity-result__summary" // description|products, description|companies, description|groups
var entityButtonActionSelector = ".artdeco-button"

// job details selectors
var jobDetailsSelector = "div.jobs-details__main-content"
var jobDetailsTitleSelector = ".jobs-unified-top-card__job-title"
var jobCompanySelector = ".jobs-unified-top-card__company-name"
var jobLocationSelector = ".jobs-unified-top-card__bullet"
var jobWorkplaceTypeSelector = ".jobs-unified-top-card__workplace-type"
var jobDescriptionSelector = ".jobs-description__container"
var jobInsightSelector = "div.mt1"
var jobLevelSelector = "li.jobs-unified-top-card__job-insight"

// job selectors
var jobSelector = "div.job-card-container"
var jobTitleSelector = "a.job-card-list__title"
var companyNameSelector = ".job-card-container__company-name"
var jobMetadataSelector = ".job-card-container__metadata-item"
var jobWorkplaceTypeMetadataSelector = ".job-card-container__metadata-item--workplace-type"

// hirer selectors
var hirerSelector = "div.hirer-card__container"
var hirerNameSelector = ".jobs-poster__name"
var hirerJobTitleSelector = ".hirer-card__hirer-job-title"
var hirerConnDegreeSelector = ".hirer-card__connection-degree"

var hirersCards = document.querySelectorAll(hirerSelector) // to get hirer info
var entitiesCards = document.querySelectorAll(entitySelector) // to get entities info
var jobsCards = document.querySelectorAll(jobSelector) // to get both job and company infos
var jobsDetails = document.querySelectorAll(jobDetailsSelector) // to get both job and hirer info

var oldCompaniesLength = companies.length
var oldRecruitersLength = recruiters.length
var oldJobsLength = jobs.length

companies.sort((a, b) => a.name > b.name)
recruiters.sort((a, b) => a.name > b.name)
jobs.sort((a, b) => a.title > b.title)

getJobs()
getEntities()
getHirers()
getJobsDetails()

checkAndPrintResult()

function getUrl(curItem, isJob = false, isJobCompany = false) {
    if (isJob) return curItem.querySelector(jobUrlSelector).href
    if (isJobCompany) return curItem.querySelector(jobCompanyUrlSelector) ? curItem.querySelector(jobCompanyUrlSelector).href : curItem.querySelector(urlSelector).href

    return curItem.querySelector(urlSelector).href
}

function getJobs() {
    for (let i = 0; i < jobsCards.length; i++) {
        let curJob = jobsCards[i]

        let curComProfileUrl = getUrl(curJob, false, true)
        let curJobUrl = getUrl(curJob, true)

        if (!curComProfileUrl || !curJobUrl) {
            console.log(`[ERROR] There is no URL for ${curJob}`)
            continue
        }

        if (curComProfileUrl.includes("/company/")) {

            let comName = curJob.querySelector(jobCompanyUrlSelector) ? curJob.querySelector(jobCompanyUrlSelector).innerText : curJob.querySelector(urlSelector).innerText
            let comDescription = ""

            let curCompanyObj = new Company(comName, curComProfileUrl, comDescription)

            if (!companies.some(x => JSON.stringify(x) === JSON.stringify(curCompanyObj))) companies.push(curCompanyObj)
        }

        if (curJobUrl.includes("/jobs/")) {
            let curJobMetadata = curJob.querySelector(jobMetadataSelector).innerText.split("(")

            let jobTitle = curJob.querySelector(jobTitleSelector).innerText
            let jobUrl = curJobUrl
            let jobCompany = curJob.querySelector(companyNameSelector) ? curJob.querySelector(companyNameSelector).innerText : curJob.querySelector(urlSelector).innerText
            let jobLocation = curJobMetadata[0]
            let jobWorkplaceType = curJobMetadata.length > 1 ? curJobMetadata[1].replace(")", "") : curJob.querySelector(jobWorkplaceTypeMetadataSelector) ? curJob.querySelector(jobWorkplaceTypeMetadataSelector).innerText : ""
            let jobDescription = ""
            let jobInsight = ""
            let jobLevel = ""

            let curJobObj = new Job(jobTitle, jobUrl, jobCompany, jobLocation, jobWorkplaceType, jobDescription, jobInsight, jobLevel)

            if (!jobs.some(x => JSON.stringify(x) === JSON.stringify(curJobObj))) jobs.push(curJobObj)
        }
    }
}

function getHirers() {
    for (let i = 0; i < hirersCards.length; i++) {
        let curHirer = hirersCards[i]

        let recProfileUrl = getUrl(curHirer)

        if (!recProfileUrl.includes("/in/")) continue // it's not a person profile

        let recName = curHirer.querySelector(hirerNameSelector).innerText
        let recJobTitle = curHirer.querySelector(hirerJobTitleSelector).innerText
        let recConnDegree = curHirer.querySelector(hirerConnDegreeSelector).innerText
        let recRequestStatus = ""

        let curHirerObj = new Recruiter(recName, recProfileUrl, recJobTitle, recConnDegree, recRequestStatus)

        if (!recruiters.some(x => JSON.stringify(x) === JSON.stringify(curHirerObj))) recruiters.push(curHirerObj)
    }
}

function getJobsDetails() {
    for (let i = 0; i < jobsDetails.length; i++) {
        let curJob = jobsDetails[i]

        let jobTitle = curJob.querySelector(jobDetailsTitleSelector).innerText
        let jobUrl = getUrl(curJob, true)
        let jobCompany = curJob.querySelector(jobCompanySelector).innerText
        let jobLocation = curJob.querySelector(jobLocationSelector).innerText
        let jobWorkplaceType = curJob.querySelector(jobWorkplaceTypeSelector) ? curJob.querySelector(jobWorkplaceTypeSelector).innerText : ""
        let jobDescription = curJob.querySelector(jobDescriptionSelector).innerText
        let jobInsight = curJob.querySelector(jobInsightSelector) ? curJob.querySelector(jobInsightSelector).innerText : ""
        let jobLevel = curJob.querySelector(jobLevelSelector).innerText.split(" · ") > 1 ? curJob.querySelector(jobLevelSelector).innerText.split(" · ")[1] : ""

        let curJobObj = new Job(jobTitle, jobUrl, jobCompany, jobLocation, jobWorkplaceType, jobDescription, jobInsight, jobLevel)

        if (!jobs.some(x => JSON.stringify(x) === JSON.stringify(curJobObj))) jobs.push(curJobObj)
    }
}

function getEntities() {
    for (let i = 0; i < entitiesCards.length; i++) {
        let curEntity = entitiesCards[i]

        let curUrl = getUrl(curEntity)

        if (curUrl.includes("/in/")) {
            let curEntityTitle = curEntity.querySelector(curEntityTitleSelector).innerText.split("\n")

            let recName = curEntityTitle[0]
            let recProfileUrl = curUrl
            let recJobTitle = curEntity.querySelector(entitySubtitleSelector).innerText
            let recConnDegree = curEntityTitle.length >= 4 ? curEntityTitle[3] : ""
            let recRequestStatus = curEntity.querySelector(entityButtonActionSelector).innerText

            let curRecruiter = new Recruiter(recName, recProfileUrl, recJobTitle, recConnDegree, recRequestStatus)

            if (!recruiters.some(x => JSON.stringify(x) === JSON.stringify(curRecruiter))) recruiters.push(curRecruiter)
            continue
        }

        if (curUrl.includes("/company/")) {
            let curEntityTitle = curEntity.querySelector(curEntityTitleSelector).innerText.split("\n")

            let comName = curEntityTitle[0]
            let comProfileUrl = curUrl
            let comDescription = curEntity.querySelector(entitySummarySelector) ? curEntity.querySelector(entitySummarySelector).innerText : ""

            let curCompany = new Company(comName, comProfileUrl, comDescription)

            if (!companies.some(x => JSON.stringify(x) === JSON.stringify(curCompany))) companies.push(curCompany)
            continue
        }

        if (curUrl.includes("/jobs/")) {
            let curEntitySecondarySubtitle = curEntity.querySelector(entitySecondarySubtitleSelector).innerText.split("(")

            let jobTitle = curEntity.querySelector(curEntityTitleSelector).innerText
            let jobUrl = curUrl
            let jobCompany = curEntity.querySelector(entitySubtitleSelector).innerText
            let jobLocation = curEntitySecondarySubtitle[0]
            let jobWorkplaceType = curEntitySecondarySubtitle.length > 1 ? curEntitySecondarySubtitle[1].replace(")", "") : ""
            let jobDescription = ""
            let jobInsight = ""

            let curJobObj = new Job(jobTitle, jobUrl, jobCompany, jobLocation, jobWorkplaceType, jobDescription, jobInsight)

            if (!jobs.some(x => JSON.stringify(x) === JSON.stringify(curJobObj))) jobs.push(curJobObj)
            continue
        }
    }
}

function checkAndPrintResult() {

    var textToAlert = ""
    var companiesLengthDiff = companies.length - oldCompaniesLength
    var recruitersLengthDiff = recruiters.length - oldRecruitersLength
    var jobsLengthDiff = jobs.length - oldJobsLength

    if (companiesLengthDiff > 0) {
        textToAlert += (companiesLengthDiff > 1) ? `${companiesLengthDiff} companies added!\n` : `${companiesLengthDiff} company added!\n`
        console.log(companies)
    }

    if (recruitersLengthDiff > 0) {
        textToAlert += (recruitersLengthDiff > 1) ? `${recruitersLengthDiff} recruiters added!\n` : `${recruitersLengthDiff} recruiter added!\n`
        console.log(recruiters)
    }

    if (jobsLengthDiff > 0) {
        textToAlert += (jobsLengthDiff > 1) ? `${jobsLengthDiff} jobs added!\n` : `${jobsLengthDiff} job added!\n`
        console.log(jobs)
    }

    if (textToAlert.length > 0) alert(textToAlert)
}