class PagerModel 
{
    constructor(search, pageSize = 15, groupSize = 5) 
    {
        this.pages = []

        this.CurrentRecord = 1
        this.PageSize = pageSize
        this.GroupSize = groupSize
        this.TotalCount = 0
        this.Search = search
    }

    // -------------------- Record Functions --------------------

    currentFirst()      { return this.firstRecordInPage(this.currentPage()) }
    previous()          { return this.CurrentRecord !== 1 ? this.CurrentRecord - 1 : this.TotalCount }
    next()              { return this.hasRecords() && this.CurrentRecord < this.TotalCount ? this.CurrentRecord + 1 : 1 }
    hasRecords()        { return this.TotalCount > 0 }
    offset()            { 
        const offset = this.CurrentRecord - ((this.currentPage() - 1) * this.PageSize) - 1
        return offset > 0 ? offset : 0 
    }

    // -------------------- Page Functions ----------------------

    currentPage()       { return Math.ceil(this.CurrentRecord / this.PageSize) }
    firstPage()         { return 1 }
    lastPage()          { return Math.ceil(this.TotalCount / this.PageSize) }
    previousPage()      { return this.currentPage() <= 1 ? this.lastPage() : this.currentPage() - 1 }
    nextPage()          { return this.currentPage() * this.PageSize >= this.TotalCount ? this.firstPage() : this.currentPage() + 1 } 
    hasMultiplePages()  { return this.TotalCount > this.PageSize }

    // -------------------- Group Functions ---------------------

    currentGroup()      { return Math.ceil(this.CurrentRecord / (this.GroupSize * this.PageSize)) }
    firstGroup()        { return 1 }
    lastGroup()         { return Math.ceil(this.TotalCount / (this.GroupSize * this.PageSize)) }
    previousGroup()     { return this.currentGroup() <= 1 ? this.lastGroup() : this.currentGroup() - 1 }
    nextGroup()         { return this.currentGroup() >= this.lastGroup() ? 1 : this.currentGroup() + 1 }
    hasPreviousGroup()  { return this.currentGroup() > 1 }
    hasNextGroup()      { return this.TotalCount > this.currentGroup() * (this.PageSize * this.GroupSize) }

    // -------------------- Utility Functions -------------------

    firstRecordInPage(page)   { return ((page - 1) * this.PageSize) + 1 }
    firstRecordInGroup(group) { return this.firstRecordInPage(this.firstPageInGroup(group)) } 
    firstPageInGroup(group)   { return ((group - 1) * this.GroupSize) + 1 }

    // -------------------- GoTo Methods ------------------------

    goToRecord(newRecord)     { this.CurrentRecord = newRecord }
    goToPage(newPage)         { this.goToRecord(this.firstRecordInPage(newPage)) }
    goToGroup(newGroup)       { this.goToRecord(this.firstRecordInGroup(newGroup)) }

    goToNext()                { this.goToRecord(this.next()) }
    goToPrevious()            { this.goToRecord(this.previous()) }

    goToFirstPage()           { this.goToPage(this.firstPage()) }
    goToLastPage()            { this.goToPage(this.lastPage()) }
    goToPreviousPage()        { this.goToPage(this.previousPage()) }
    goToNextPage()            { this.goToPage(this.nextPage()) }

    goToFirstGroup()          { this.goToGroup(this.firstGroup()) }
    goToLastGroup()           { this.goToGroup(this.lastGroup()) }
    goToPreviousGroup()       { this.goToGroup(this.previousGroup()) }
    goToNextGroup()           { this.goToGroup(this.nextGroup()) }

    // -------------------- Page Creation -----------------------

    createPages() 
    {
        this.pages = []
        const beginPage = this.firstPageInGroup(this.currentGroup())
        const endPage = (beginPage + this.GroupSize) - 1

        for (let i = beginPage; i <= endPage; i++) 
        {
            const firstInPage = ((i - 1) * this.PageSize) + 1

            if (firstInPage > this.TotalCount) 
                break

            const isSelected = (this.currentPage() === i)

            this.pages.push(new PageItem(i.toString(), firstInPage, i, isSelected))
        }
    }

    // -------------------- Hydration ---------------------------

    static fromJson(json = {}, SearchFactory = () => new SearchModel()) 
    {
        const pager = Object.assign(new PagerModel(SearchFactory()), json)

        // ensure Search is hydrated using the provided factory
        pager.Search = SearchFactory().constructor.fromJson
            ? pager.Search = SearchFactory().constructor.fromJson(json.Search)
            : Object.assign(SearchFactory(), json.Search || {})

        return pager
    }
}

// ---------------- Supporting Classes ----------------

class SearchModel 
{
    constructor(filter = '', filterType = 'startswith', sort = '', sortDesc = false) 
    {
        this.Filter         = filter
        this.FilterType     = filterType
        this.Sort           = sort
        this.SortDesc       = sortDesc
    }

    static fromJson(json = {}) 
    {
        return Object.assign(new SearchModel(), json)
    }
}

class SearchForAccount extends SearchModel 
{
    constructor(filter = '', filterType = 'startswith', sort = '', sortDesc = false, stateProvinceFilter = [], postalCodeFilter = '') 
    {
        super(filter, filterType, sort, sortDesc)
        this.StateProvinceFilter    = stateProvinceFilter
        this.PostalCodeFilter       = postalCodeFilter
    }

    static fromJson(json = {}) 
    {
        return Object.assign(new SearchForAccount(), json)
    }
}

class SearchForUser extends SearchModel 
{
    constructor(filter = '', filterType = 'startswith', sort = '', sortDesc = false, roleFilter = '' ) 
    {
        super(filter, filterType, sort, sortDesc)
        this.RoleFilter    = roleFilter
    }

    static fromJson(json = {}) 
    {
        return Object.assign(new SearchForUser(), json)
    }
}

class Result 
{
    constructor(success = false, message = "Result not successful.") 
    {
        this.Success = success
        this.Message = message
    }

    static fromJson(json = {}) 
    {
        return Object.assign(new Result(), json)
    }
}

class PageItem 
{
    constructor(display, record, page, selected) 
    {
        this.Display = display
        this.Record = record
        this.Page = page
        this.Selected = selected
    }
}

class PagedList 
{
    constructor(pager, list = [], result = new Result()) 
    {
        this.Pager = pager
        this.ListItems = list
        this.Result = result
    }
}

// ---------------- Exports ----------------

export {
    PagerModel,
    PageItem,
    PagedList,
    SearchModel,
    SearchForAccount,
    SearchForUser,
    Result
}
