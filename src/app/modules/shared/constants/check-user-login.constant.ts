export const IS_USER_LOGGED_IN = (localStorageService: any) => {
    return !!localStorage.getItem('userSlug');
}