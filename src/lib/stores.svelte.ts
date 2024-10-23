let _page = $state("")

export const page = {
    get: () => _page,
    set: (page: string) => {
        _page = page
    }
}