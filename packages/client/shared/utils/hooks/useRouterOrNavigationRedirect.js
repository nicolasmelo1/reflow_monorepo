import dynamicImport from '../dynamicImport'


const createURL = dynamicImport('expo-linking', 'createURL')
const openURL = dynamicImport('expo-linking', 'openURL')
const useRouter = dynamicImport('next/router', 'useRouter')

/**
 * This is used to load either the useRouter from nextjs if it's on the web version or the useNavigation from react-navigation
 * if it's on the mobile version.
 */
export default function useRouterOrNavigationRedirect() {
    if (process.env.NODE_ENV === 'web') {
        const router = useRouter()
        return router.push
    } else {
        const push = (path) => {
            openURL(createURL(path))
        }
        return push
    }
}
