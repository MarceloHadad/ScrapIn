class Company {
    constructor(name, profileUrl, description) {
        this.name = name
        this.profileUrl = profileUrl
        this.description = description
    }
}

class Recruiter {
    constructor(name, profileUrl, jobTitle, connDegree, requestStatus) {
        this.name = name
        this.profileUrl = profileUrl
        this.jobTitle = jobTitle
        this.connDegree = connDegree
        this.requestStatus = requestStatus
    }
}

class Job {
    constructor(title, jobUrl, company, location, workplaceType, description, insight, level) {
        this.title = title
        this.jobUrl = jobUrl
        this.company = company
        this.location = location
        this.workplaceType = workplaceType
        this.description = description
        this.insight = insight
        this.level = level
    }
}