import 'zx/globals';

// export const HOME = os.homedir()
// export const LINUX = os.platform() === 'linux'
import {HOME, LINUX} from './slinkConfig'
const myDots = path.join(HOME, 'dots2')
const configSrc = path.join(myDots, 'config')
const configDest = path.join(HOME, '.config')
import {configMapping} from './slinkConfig'

export type ConfigMapping = {
    [program: string]: string | boolean
}

Object.entries(configMapping).forEach(async ([pkg, dest]) => {
    if (dest === true) {
        const src = path.join(configSrc, pkg)
        dest = configDest
        await symlink(src, dest)
    }
    else if (dest === false) {
        console.log(`skipping linking ${pkg}`)
    }
    else {
        const src = path.join(myDots, pkg)
        await symlink(src, dest)
    }
})

async function symlink(src: string, dest: string) {
    console.log(`linking ${src} -> ${dest}`)
    if (fs.pathExistsSync(src)) {
        // console.log('linking')
        await $`ln -sf ${src} ${dest}`
    }
    else {
        console.log(chalk.red(`${src} doesn't exist`))
    }
}
