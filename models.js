class Company {
    constructor(name, profileUrl, description) {
        this.name = name
        this.profileUrl = profileUrl
        this.description = description
    }
}

class Recruiter {
    constructor(name, profileUrl, description, connDegree, requestStatus) {
        this.name = name
        this.profileUrl = profileUrl
        this.description = description
        this.connDegree = connDegree
        this.requestStatus = requestStatus
    }
}

class Job {
    constructor(title, jobUrl, company, location, workplaceType, description, insight) {
        this.title = title
        this.jobUrl = jobUrl
        this.company = company
        this.location = location
        this.workplaceType = workplaceType
        this.description = description
        this.insight = insight
    }
}