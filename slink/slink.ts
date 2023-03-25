import 'zx/globals';

export const LINUX = os.platform() === 'linux'
import { HOME, linuxConfigMapping } from './slinkConfig'
const myDots = path.join(HOME, 'dots2')
const configSrc = path.join(myDots, 'config')
const configDest = path.join(HOME, '.config')

export type ConfigMapping = {
    [program: string]: string | boolean
}

export async function slinkAll() {
    echo('slinkAll')
    for (const config of Object.entries(linuxConfigMapping)) {
        let [pkg, dest] = config
        if (dest === true) {
            const src = path.join(configSrc, pkg)
            dest = configDest
            await symlink(src, dest)
        }
        else if (dest === false) {
            echo(`skipping linking ${pkg}`)
        }
        else {
            const src = path.join(myDots, pkg)
            await symlink(src, dest)
        }
    }
    echo('slinkAll finished')
}

async function symlink(src: string, dest: string) {
    echo(`linking ${src} -> ${dest}`)
    try {
        if (src.endsWith('/')) {
            fs.ensureDirSync(dest)
            const allFiles = await globby(`${src}*`);
            await Promise.all(allFiles.map(file => {
                $`ln -sf ${file} ${dest}`
            }))
        }
        else {
            await $`ln -sf ${src} ${dest}`
        }
    }
    catch (e) {
        echo(chalk.red('Linking error: ', e))
    }
}
